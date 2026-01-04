// ==UserScript==
// @name         RugPlay Market Analyzer - Enhanced v2.0 Fixed
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Advanced market analysis tool for RugPlay with modern UI, comprehensive analysis and enhanced security metrics - Fixed Delete Button
// @author       seltonmt012
// @match        https://rugplay.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      rugplay.com
// @license      Seltonmt
// @downloadURL https://update.greasyfork.org/scripts/540819/RugPlay%20Market%20Analyzer%20-%20Enhanced%20v20%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/540819/RugPlay%20Market%20Analyzer%20-%20Enhanced%20v20%20Fixed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===========================
    // Configuration & Storage
    // ===========================

    const getApiKey = () => GM_getValue('rugplay_api_key', '');
    const saveApiKey = (key) => GM_setValue('rugplay_api_key', key);
    const API_BASE_URL = 'https://rugplay.com/api/v1';

    const getPortfolio = () => GM_getValue('rugplay_portfolio', {});
    const savePortfolio = (portfolio) => {
        try {
            console.log('Saving portfolio data:', portfolio);
            GM_setValue('rugplay_portfolio', portfolio);
            console.log('Portfolio saved successfully');
        } catch (error) {
            console.error('Error saving portfolio:', error);
            showNotification('Error saving data: ' + error.message, 'error');
        }
    };

    const addTransaction = (symbol, quantity, price, date = new Date()) => {
        const portfolio = getPortfolio();
        if (!portfolio[symbol]) {
            portfolio[symbol] = { transactions: [], notes: '' };
        }
        portfolio[symbol].transactions.push({
            id: Date.now() + Math.random().toString(36).substring(2, 9),
            quantity: parseFloat(quantity),
            price: parseFloat(price),
            date: date.toISOString(),
            type: quantity > 0 ? 'buy' : 'sell'
        });
        savePortfolio(portfolio);
        updateUI();
    };

    const deleteTransaction = (symbol, transactionId) => {
        try {
            console.log(`🗑️ Deleting transaction: ${symbol}, ${transactionId}`);
            const portfolio = getPortfolio();
            if (!portfolio[symbol] || !portfolio[symbol].transactions) {
                console.error('No transactions found for symbol:', symbol);
                return false;
            }

            const transactionIndex = portfolio[symbol].transactions.findIndex(tx => tx.id === transactionId);
            if (transactionIndex === -1) {
                console.error('Transaction not found:', transactionId);
                return false;
            }

            portfolio[symbol].transactions.splice(transactionIndex, 1);
            if (portfolio[symbol].transactions.length === 0) {
                delete portfolio[symbol];
            }
            savePortfolio(portfolio);
            console.log('✅ Transaction deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting transaction:', error);
            return false;
        }
    };

    const calculateHoldings = (symbol) => {
        const portfolio = getPortfolio();
        if (!portfolio[symbol]) return { quantity: 0, avgPrice: 0 };

        let totalQuantity = 0;
        let totalCost = 0;

        portfolio[symbol].transactions.forEach(tx => {
            if (tx.type === 'buy') {
                totalCost += (tx.quantity * tx.price);
                totalQuantity += tx.quantity;
            } else {
                const avgCostPerCoin = totalCost / totalQuantity;
                totalCost -= (tx.quantity * avgCostPerCoin);
                totalQuantity -= tx.quantity;
            }
        });

        return {
            quantity: totalQuantity,
            avgPrice: totalQuantity > 0 ? totalCost / totalQuantity : 0
        };
    };

    // ===========================
    // API Functions
    // ===========================

    const fetchCoinData = async (symbol) => {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error('API key not set');

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${API_BASE_URL}/coin/${symbol}`,
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(`Error: ${response.statusText}`);
                    }
                },
                onerror: (error) => reject(`Network error: ${error}`)
            });
        });
    };

    const fetchCoinHolders = async (symbol) => {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error('API key not set');

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${API_BASE_URL}/holders/${symbol}?limit=100`,
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(`Error: ${response.statusText}`);
                    }
                },
                onerror: (error) => reject(`Network error: ${error}`)
            });
        });
    };

    const searchCoins = async (searchTerm) => {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error('API key not set');

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${API_BASE_URL}/market?search=${encodeURIComponent(searchTerm)}`,
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(`Error: ${response.statusText}`);
                    }
                },
                onerror: (error) => reject(`Network error: ${error}`)
            });
        });
    };

    // ===========================
    // Enhanced Analysis Functions
    // ===========================

    const analyzePrice = (candlesticks) => {
        if (!candlesticks || candlesticks.length < 10) {
            return {
                trend: 'UNKNOWN',
                trendPercentage: 0,
                message: 'Insufficient data',
                confidence: 0
            };
        }

        const recentCandles = candlesticks.slice(-20);
        const firstPrice = recentCandles[0].open;
        const lastPrice = recentCandles[recentCandles.length - 1].close;
        const changePercentage = ((lastPrice - firstPrice) / firstPrice) * 100;

        // Calculate volatility
        const prices = recentCandles.map(c => c.close);
        const avgPrice = prices.reduce((a, b) => a + b) / prices.length;
        const volatility = Math.sqrt(prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length);
        const volatilityPercent = (volatility / avgPrice) * 100;

        // Calculate momentum
        const shortMA = prices.slice(-5).reduce((a, b) => a + b) / 5;
        const longMA = prices.slice(-10).reduce((a, b) => a + b) / 10;
        const momentum = ((shortMA - longMA) / longMA) * 100;

        let trend, message, confidence;

        if (changePercentage > 50) {
            trend = 'STRONG_UP';
            message = `🚀 Strong bullish trend (+${changePercentage.toFixed(1)}%)`;
            confidence = Math.min(95, 70 + Math.abs(changePercentage) / 2);
        } else if (changePercentage > 20) {
            trend = 'UP';
            message = `📈 Bullish trend (+${changePercentage.toFixed(1)}%)`;
            confidence = Math.min(85, 60 + Math.abs(changePercentage));
        } else if (changePercentage < -30) {
            trend = 'STRONG_DOWN';
            message = `📉 Strong bearish trend (${changePercentage.toFixed(1)}%)`;
            confidence = Math.min(90, 65 + Math.abs(changePercentage) / 2);
        } else if (changePercentage < -10) {
            trend = 'DOWN';
            message = `⬇️ Bearish trend (${changePercentage.toFixed(1)}%)`;
            confidence = Math.min(80, 55 + Math.abs(changePercentage));
        } else {
            trend = 'NEUTRAL';
            message = `↔️ Sideways movement (${changePercentage.toFixed(1)}%)`;
            confidence = 50;
        }

        return {
            trend,
            trendPercentage: changePercentage,
            message,
            confidence,
            volatility: volatilityPercent,
            momentum
        };
    };

    const analyzeSecurity = (coinData, holdersData) => {
        if (!holdersData || !holdersData.holders || !coinData) {
            return {
                securityScore: 0,
                level: 'UNKNOWN',
                factors: [],
                recommendation: 'Insufficient data'
            };
        }

        let securityScore = 100;
        const factors = [];

        // Holder concentration analysis
        const topHolder = holdersData.holders[0];
        const topHolderPercentage = topHolder ? topHolder.percentage : 0;

        if (topHolderPercentage > 80) {
            securityScore -= 40;
            factors.push({
                type: 'critical',
                message: `🚨 Extreme concentration: Top holder owns ${topHolderPercentage.toFixed(2)}%`,
                impact: -40
            });
        } else if (topHolderPercentage > 50) {
            securityScore -= 25;
            factors.push({
                type: 'high',
                message: `⚠️ High concentration: Top holder owns ${topHolderPercentage.toFixed(2)}%`,
                impact: -25
            });
        } else if (topHolderPercentage > 30) {
            securityScore -= 15;
            factors.push({
                type: 'medium',
                message: `⚠️ Moderate concentration: Top holder owns ${topHolderPercentage.toFixed(2)}%`,
                impact: -15
            });
        }

        // Top 10 holders analysis
        const top10Holders = holdersData.holders.slice(0, 10);
        const top10Percentage = top10Holders.reduce((sum, holder) => sum + holder.percentage, 0);

        if (top10Percentage > 95) {
            securityScore -= 30;
            factors.push({
                type: 'critical',
                message: `🚨 Top 10 holders control ${top10Percentage.toFixed(2)}%`,
                impact: -30
            });
        } else if (top10Percentage > 80) {
            securityScore -= 20;
            factors.push({
                type: 'high',
                message: `⚠️ Top 10 holders control ${top10Percentage.toFixed(2)}%`,
                impact: -20
            });
        }

        // Liquidity analysis
        const poolPercentage = (holdersData.poolInfo.coinAmount / holdersData.circulatingSupply) * 100;
        if (poolPercentage < 1) {
            securityScore -= 25;
            factors.push({
                type: 'critical',
                message: `🚨 Very low liquidity: ${poolPercentage.toFixed(3)}% in pool`,
                impact: -25
            });
        } else if (poolPercentage < 5) {
            securityScore -= 15;
            factors.push({
                type: 'medium',
                message: `⚠️ Low liquidity: ${poolPercentage.toFixed(2)}% in pool`,
                impact: -15
            });
        }

        // Age analysis
        const creationDate = new Date(coinData.coin.createdAt);
        const ageInDays = (new Date() - creationDate) / (1000 * 60 * 60 * 24);

        if (ageInDays < 1) {
            securityScore -= 20;
            factors.push({
                type: 'high',
                message: `🕐 Very new project (${ageInDays.toFixed(1)} days old)`,
                impact: -20
            });
        } else if (ageInDays < 7) {
            securityScore -= 10;
            factors.push({
                type: 'medium',
                message: `🕐 New project (${ageInDays.toFixed(1)} days old)`,
                impact: -10
            });
        } else if (ageInDays > 30) {
            securityScore += 5;
            factors.push({
                type: 'positive',
                message: `✅ Established project (${ageInDays.toFixed(0)} days old)`,
                impact: +5
            });
        }

        // Volume analysis
        const volumeToMarketCap = (coinData.coin.volume24h / coinData.coin.marketCap) * 100;
        if (volumeToMarketCap > 50) {
            securityScore -= 10;
            factors.push({
                type: 'medium',
                message: `⚠️ Extremely high volume ratio: ${volumeToMarketCap.toFixed(2)}%`,
                impact: -10
            });
        } else if (volumeToMarketCap > 20) {
            securityScore -= 5;
            factors.push({
                type: 'low',
                message: `⚠️ High volume ratio: ${volumeToMarketCap.toFixed(2)}%`,
                impact: -5
            });
        }

        securityScore = Math.max(0, Math.min(100, securityScore));

        let level, recommendation;
        if (securityScore >= 80) {
            level = 'HIGH';
            recommendation = '✅ Low risk - Appears relatively safe';
        } else if (securityScore >= 60) {
            level = 'MEDIUM';
            recommendation = '⚠️ Medium risk - Exercise caution';
        } else if (securityScore >= 40) {
            level = 'LOW';
            recommendation = '🔶 High risk - Be very careful';
        } else {
            level = 'CRITICAL';
            recommendation = '🚨 Critical risk - Avoid or minimal exposure';
        }

        return {
            securityScore,
            level,
            factors,
            recommendation,
            holderAnalysis: {
                topHolder: topHolderPercentage,
                top10Holders: top10Percentage,
                poolPercentage,
                totalHolders: holdersData.holders.length
            }
        };
    };

    const analyzeActivity = (coinData, holdersData) => {
        const coin = coinData.coin;
        let activityScore = 0;
        const factors = [];

        // Volume activity
        const volumeScore = Math.min(30, (coin.volume24h / 10000) * 10);
        activityScore += volumeScore;
        factors.push({
            metric: 'Trading Volume',
            value: `$${formatNumber(coin.volume24h)}`,
            score: volumeScore,
            maxScore: 30
        });

        // Market cap activity
        const mcapScore = Math.min(25, (coin.marketCap / 100000) * 5);
        activityScore += mcapScore;
        factors.push({
            metric: 'Market Cap',
            value: `$${formatNumber(coin.marketCap)}`,
            score: mcapScore,
            maxScore: 25
        });

        // Holder count activity
        const holderScore = Math.min(25, (holdersData.holders.length / 10) * 2);
        activityScore += holderScore;
        factors.push({
            metric: 'Holder Count',
            value: holdersData.holders.length.toString(),
            score: holderScore,
            maxScore: 25
        });

        // Price volatility as activity indicator
        const priceChange = Math.abs((coin.change24h / (coin.currentPrice - coin.change24h)) * 100);
        const volatilityScore = Math.min(20, priceChange / 2);
        activityScore += volatilityScore;
        factors.push({
            metric: 'Price Volatility',
            value: `${priceChange.toFixed(2)}%`,
            score: volatilityScore,
            maxScore: 20
        });

        activityScore = Math.min(100, activityScore);

        let level;
        if (activityScore >= 80) level = 'VERY_HIGH';
        else if (activityScore >= 60) level = 'HIGH';
        else if (activityScore >= 40) level = 'MEDIUM';
        else if (activityScore >= 20) level = 'LOW';
        else level = 'VERY_LOW';

        return {
            activityScore,
            level,
            factors
        };
    };

    const analyzeProfitability = (coinData, holdings) => {
        const coin = coinData.coin;
        let profitScore = 50; // Start neutral
        const factors = [];

        // Price performance
        const priceChange = (coin.change24h / (coin.currentPrice - coin.change24h)) * 100;
        const performanceScore = Math.min(25, Math.max(-25, priceChange));
        profitScore += performanceScore;
        factors.push({
            metric: '24h Performance',
            value: `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`,
            score: performanceScore,
            impact: performanceScore >= 0 ? 'positive' : 'negative'
        });

        // Volume/Market Cap ratio (liquidity premium)
        const volumeRatio = (coin.volume24h / coin.marketCap) * 100;
        const liquidityScore = Math.min(15, volumeRatio * 2) - 10;
        profitScore += liquidityScore;
        factors.push({
            metric: 'Liquidity Ratio',
            value: `${volumeRatio.toFixed(2)}%`,
            score: liquidityScore,
            impact: liquidityScore >= 0 ? 'positive' : 'negative'
        });

        // Personal holdings performance
        if (holdings.quantity > 0) {
            const currentValue = holdings.quantity * coin.currentPrice;
            const costBasis = holdings.quantity * holdings.avgPrice;
            const personalReturn = ((currentValue - costBasis) / costBasis) * 100;
            const personalScore = Math.min(25, Math.max(-25, personalReturn));
            profitScore += personalScore;
            factors.push({
                metric: 'Your P&L',
                value: `${personalReturn >= 0 ? '+' : ''}${personalReturn.toFixed(2)}%`,
                score: personalScore,
                impact: personalScore >= 0 ? 'positive' : 'negative'
            });
        }

        // Market cap potential
        const mcapScore = coin.marketCap < 100000 ? 10 : coin.marketCap < 1000000 ? 5 : 0;
        profitScore += mcapScore;
        if (mcapScore > 0) {
            factors.push({
                metric: 'Growth Potential',
                value: 'Small Cap',
                score: mcapScore,
                impact: 'positive'
            });
        }

        profitScore = Math.max(0, Math.min(100, profitScore));

        let level;
        if (profitScore >= 80) level = 'EXCELLENT';
        else if (profitScore >= 65) level = 'GOOD';
        else if (profitScore >= 50) level = 'NEUTRAL';
        else if (profitScore >= 35) level = 'POOR';
        else level = 'VERY_POOR';

        return {
            profitScore,
            level,
            factors
        };
    };

    // ===========================
    // Modern UI Styles
    // ===========================

    const addStyles = () => {
        GM_addStyle(`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

            .rp-analyzer {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 650px;
                max-height: 90vh;
                overflow-y: auto;
                background: rgba(15, 15, 15, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
                color: #ffffff;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                z-index: 10000;
                padding: 0;
                scrollbar-width: thin;
                scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
            }

            .rp-analyzer::-webkit-scrollbar {
                width: 6px;
            }

            .rp-analyzer::-webkit-scrollbar-track {
                background: transparent;
            }

            .rp-analyzer::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
            }

            .rp-analyzer::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .rp-analyzer-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.02);
                border-radius: 16px 16px 0 0;
            }

            .rp-analyzer-title {
                font-size: 18px;
                font-weight: 600;
                color: #00d4ff;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .rp-analyzer-close {
                cursor: pointer;
                color: rgba(255, 255, 255, 0.6);
                font-size: 24px;
                line-height: 1;
                padding: 4px;
                border-radius: 6px;
                transition: all 0.2s ease;
            }

            .rp-analyzer-close:hover {
                color: #ff4757;
                background: rgba(255, 71, 87, 0.1);
            }

            .rp-analyzer-tabs {
                display: flex;
                padding: 0 24px;
                background: rgba(255, 255, 255, 0.02);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                gap: 4px;
            }

            .rp-analyzer-tab {
                padding: 12px 16px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                border-radius: 8px 8px 0 0;
                background: transparent;
                color: rgba(255, 255, 255, 0.7);
                transition: all 0.2s ease;
                position: relative;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .rp-analyzer-tab:hover {
                color: #ffffff;
                background: rgba(255, 255, 255, 0.05);
            }

            .rp-analyzer-tab.active {
                background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 150, 255, 0.1));
                color: #00d4ff;
                border-bottom: 2px solid #00d4ff;
            }

            .rp-analyzer-content {
                padding: 24px;
                background: transparent;
            }

            .rp-analyzer-section {
                margin-bottom: 24px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                padding: 20px;
                backdrop-filter: blur(10px);
            }

            .rp-analyzer-section-title {
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 16px;
                color: #00d4ff;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .rp-score-card {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 16px;
                margin-bottom: 20px;
            }

            .rp-score-item {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 16px;
                text-align: center;
                transition: all 0.2s ease;
            }

            .rp-score-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            }

            .rp-score-value {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 4px;
            }

            .rp-score-label {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .rp-score-excellent { color: #00ff88; }
            .rp-score-good { color: #00d4ff; }
            .rp-score-neutral { color: #ffa500; }
            .rp-score-poor { color: #ff6b6b; }
            .rp-score-critical { color: #ff4757; }

            .rp-analyzer-data-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            .rp-analyzer-data-row:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }

            .rp-analyzer-label {
                color: rgba(255, 255, 255, 0.8);
                font-size: 14px;
            }

            .rp-analyzer-value {
                font-weight: 600;
                font-size: 14px;
                color: #ffffff;
            }

            .rp-analyzer-input {
                width: 100%;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 8px;
                color: #ffffff;
                margin-bottom: 12px;
                font-size: 14px;
                font-family: inherit;
                transition: all 0.2s ease;
            }

            .rp-analyzer-input:focus {
                outline: none;
                border-color: #00d4ff;
                box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
            }

            .rp-analyzer-input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }

            .rp-analyzer-button {
                background: linear-gradient(135deg, #00d4ff, #0096ff);
                color: #000;
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
                margin-right: 8px;
                margin-bottom: 8px;
                transition: all 0.2s ease;
                font-family: inherit;
            }

            .rp-analyzer-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
            }

            .rp-analyzer-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }

            .rp-analyzer-button.rp-delete {
                background: linear-gradient(135deg, #ff4757, #ff3742);
                padding: 6px 12px;
                font-size: 12px;
                color: #fff;
            }

            .rp-analyzer-button.rp-delete:hover:not(:disabled) {
                box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
            }

            .rp-positive { color: #00ff88; }
            .rp-negative { color: #ff6b6b; }
            .rp-warning { color: #ffa500; }
            .rp-neutral { color: #00d4ff; }

            .rp-toggle-button {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #00d4ff, #0096ff);
                color: #000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 8px 30px rgba(0, 212, 255, 0.4);
                z-index: 10001;
                transition: all 0.3s ease;
                border: none;
            }

            .rp-toggle-button:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 40px rgba(0, 212, 255, 0.5);
            }

            .rp-notification {
                position: fixed;
                bottom: 100px;
                right: 24px;
                background: rgba(15, 15, 15, 0.95);
                backdrop-filter: blur(20px);
                color: #fff;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
                z-index: 10002;
                font-weight: 500;
                transition: all 0.3s ease;
                border-left: 4px solid #00d4ff;
                max-width: 300px;
            }

            .rp-notification.rp-error { border-left-color: #ff4757; }
            .rp-notification.rp-success { border-left-color: #00ff88; }
            .rp-notification.rp-warning { border-left-color: #ffa500; }

            .rp-prediction-card {
                background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 150, 255, 0.05));
                border: 1px solid rgba(0, 212, 255, 0.2);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                text-align: center;
            }

            .rp-prediction-icon {
                font-size: 32px;
                margin-bottom: 12px;
                display: block;
            }

            .rp-prediction-text {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
            }

            .rp-prediction-confidence {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
            }

            .rp-risk-analysis {
                background: rgba(255, 71, 87, 0.05);
                border: 1px solid rgba(255, 71, 87, 0.2);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
            }

            .rp-risk-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .rp-risk-factors {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 16px;
            }

            .rp-risk-factor {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
            }

            .rp-risk-impact {
                font-size: 12px;
                padding: 4px 8px;
                border-radius: 6px;
                font-weight: 600;
            }

            .rp-risk-impact.critical { background: rgba(255, 71, 87, 0.2); color: #ff4757; }
            .rp-risk-impact.high { background: rgba(255, 107, 107, 0.2); color: #ff6b6b; }
            .rp-risk-impact.medium { background: rgba(255, 165, 0, 0.2); color: #ffa500; }
            .rp-risk-impact.positive { background: rgba(0, 255, 136, 0.2); color: #00ff88; }

            .rp-empty-state {
                text-align: center;
                padding: 40px 20px;
                color: rgba(255, 255, 255, 0.6);
            }

            .rp-empty-state-icon {
                font-size: 48px;
                margin-bottom: 16px;
                opacity: 0.5;
            }

            .rp-progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 8px;
            }

            .rp-progress-fill {
                height: 100%;
                border-radius: 4px;
                transition: width 0.3s ease;
            }

            .rp-progress-excellent { background: linear-gradient(90deg, #00ff88, #00d4aa); }
            .rp-progress-good { background: linear-gradient(90deg, #00d4ff, #0096ff); }
            .rp-progress-neutral { background: linear-gradient(90deg, #ffa500, #ff8c00); }
            .rp-progress-poor { background: linear-gradient(90deg, #ff6b6b, #ff5252); }
            .rp-progress-critical { background: linear-gradient(90deg, #ff4757, #ff3742); }

            .rp-transaction-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 16px;
                font-size: 13px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 8px;
                overflow: hidden;
            }

            .rp-transaction-table th, .rp-transaction-table td {
                padding: 10px 8px;
                text-align: left;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                word-wrap: break-word;
                max-width: 0;
            }

            .rp-transaction-table th {
                background: rgba(255, 255, 255, 0.05);
                color: #00d4ff;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 11px;
                letter-spacing: 0.5px;
                white-space: nowrap;
            }

            .rp-transaction-table td {
                font-size: 12px;
            }

            .rp-transaction-table th:nth-child(1) { width: 15%; } /* Date */
            .rp-transaction-table th:nth-child(2) { width: 12%; } /* Coin */
            .rp-transaction-table th:nth-child(3) { width: 8%; }  /* Type */
            .rp-transaction-table th:nth-child(4) { width: 15%; } /* Quantity */
            .rp-transaction-table th:nth-child(5) { width: 12%; } /* Price */
            .rp-transaction-table th:nth-child(6) { width: 15%; } /* Total */
            .rp-transaction-table th:nth-child(7) { width: 23%; } /* Actions */

            .rp-transaction-table tr:hover {
                background: rgba(255, 255, 255, 0.03);
            }

            .rp-transaction-date {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.8);
            }

            .rp-transaction-coin {
                font-weight: 600;
                color: #00d4ff;
            }

            .rp-transaction-type {
                font-weight: 600;
                text-transform: uppercase;
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 4px;
                display: inline-block;
            }

            .rp-transaction-type.buy {
                background: rgba(0, 255, 136, 0.2);
                color: #00ff88;
            }

            .rp-transaction-type.sell {
                background: rgba(255, 107, 107, 0.2);
                color: #ff6b6b;
            }

            .rp-modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 10005;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .rp-modal {
                background: rgba(15, 15, 15, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 24px;
                border-radius: 16px;
                max-width: 450px;
                width: 90%;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
            }

            .rp-modal-title {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 16px;
                color: #00d4ff;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .rp-modal-content {
                margin-bottom: 24px;
                color: rgba(255, 255, 255, 0.9);
                line-height: 1.5;
            }

            .rp-modal-actions {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            }

            .rp-chart-placeholder {
                width: 100%;
                height: 120px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px dashed rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: rgba(255, 255, 255, 0.5);
                font-size: 14px;
                margin: 16px 0;
            }

            .rp-metric-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 12px;
                margin: 16px 0;
            }

            .rp-metric-item {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 8px;
                padding: 12px;
            }

            .rp-metric-title {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .rp-metric-value {
                font-size: 16px;
                font-weight: 600;
                color: #ffffff;
            }

            @media (max-width: 768px) {
                .rp-analyzer {
                    width: 95%;
                    right: 2.5%;
                    max-height: 85vh;
                }

                .rp-score-card {
                    grid-template-columns: repeat(2, 1fr);
                }

                .rp-metric-grid {
                    grid-template-columns: 1fr;
                }
            }

            @keyframes rp-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .rp-loading {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(255, 255, 255, 0.1);
                border-top: 4px solid #00d4ff;
                border-radius: 50%;
                animation: rp-spin 1s linear infinite;
                margin: 20px auto;
            }
        `);
    };

    // ===========================
    // UI Creation Functions
    // ===========================

    const createUI = () => {
        createToggleButton();

        const container = document.createElement('div');
        container.className = 'rp-analyzer';
        container.style.display = 'none';
        container.id = 'rp-analyzer-container';

        const header = document.createElement('div');
        header.className = 'rp-analyzer-header';

        const title = document.createElement('div');
        title.className = 'rp-analyzer-title';
        title.innerHTML = '📊 RugPlay Analyzer Pro';

        const closeButton = document.createElement('div');
        closeButton.className = 'rp-analyzer-close';
        closeButton.innerHTML = '×';
        closeButton.addEventListener('click', toggleAnalyzer);

        header.appendChild(title);
        header.appendChild(closeButton);

        const tabs = document.createElement('div');
        tabs.className = 'rp-analyzer-tabs';

        const tabsData = [
            { key: 'analysis', label: '🔍 Analysis', icon: '🔍' },
            { key: 'portfolio', label: '💼 Portfolio', icon: '💼' },
            { key: 'transactions', label: '📝 Transactions', icon: '📝' },
            { key: 'search', label: '🔎 Search', icon: '🔎' },
            { key: 'settings', label: '⚙️ Settings', icon: '⚙️' }
        ];

        tabsData.forEach((tab, index) => {
            const tabElement = document.createElement('div');
            tabElement.className = `rp-analyzer-tab ${index === 0 ? 'active' : ''}`;
            tabElement.innerHTML = `${tab.icon} ${tab.label}`;
            tabElement.dataset.tab = tab.key;
            tabElement.addEventListener('click', (e) => switchTab(e.target));
            tabs.appendChild(tabElement);
        });

        const content = document.createElement('div');
        content.className = 'rp-analyzer-content';
        content.id = 'rp-analyzer-content';

        container.appendChild(header);
        container.appendChild(tabs);
        container.appendChild(content);
        document.body.appendChild(container);

        // Initialize with settings check
        const apiKey = getApiKey();
        if (!apiKey) {
            switchTab(document.querySelector('[data-tab="settings"]'));
        } else {
            updateAnalysisTab();
        }

        // Auto-show on transactions page
        if (window.location.href.includes('rugplay.com/transactions')) {
            setTimeout(() => {
                if (container.style.display === 'none') {
                    toggleAnalyzer();
                    switchTab(document.querySelector('[data-tab="transactions"]'));
                }
            }, 1000);
        }
    };

    const createToggleButton = () => {
        const existingButton = document.getElementById('rp-toggle-button');
        if (existingButton) existingButton.remove();

        const toggleButton = document.createElement('div');
        toggleButton.className = 'rp-toggle-button';
        toggleButton.id = 'rp-toggle-button';
        toggleButton.innerHTML = '📊';
        toggleButton.title = 'RugPlay Analyzer Pro';
        toggleButton.addEventListener('click', toggleAnalyzer);
        document.body.appendChild(toggleButton);
    };

    const switchTab = (tabElement) => {
        document.querySelectorAll('.rp-analyzer-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        tabElement.classList.add('active');

        const tabName = tabElement.dataset.tab;
        switch (tabName) {
            case 'analysis': updateAnalysisTab(); break;
            case 'portfolio': updatePortfolioTab(); break;
            case 'transactions': updateTransactionsTab(); break;
            case 'search': updateSearchTab(); break;
            case 'settings': updateSettingsTab(); break;
        }
    };

    const toggleAnalyzer = () => {
        const container = document.getElementById('rp-analyzer-container');
        if (container.style.display === 'none') {
            container.style.display = 'block';
            const symbol = getCoinFromUrl();
            if (symbol) {
                loadCoinData(symbol);
            }
        } else {
            container.style.display = 'none';
        }
    };

    // ===========================
    // Tab Update Functions
    // ===========================

    const updateAnalysisTab = async () => {
        const content = document.getElementById('rp-analyzer-content');

        if (!getApiKey()) {
            content.innerHTML = `
                <div class="rp-empty-state">
                    <div class="rp-empty-state-icon">🔐</div>
                    <h3>API Key Required</h3>
                    <p>Configure your RugPlay API key to start analyzing coins</p>
                    <button class="rp-analyzer-button" onclick="document.querySelector('[data-tab=\\"settings\\"]').click()">
                        ⚙️ Go to Settings
                    </button>
                </div>
            `;
            return;
        }

        let symbol = currentCoin || getCoinFromUrl();
        if (!symbol) {
            content.innerHTML = `
                <div class="rp-empty-state">
                    <div class="rp-empty-state-icon">🔍</div>
                    <h3>No Coin Selected</h3>
                    <p>Navigate to a coin page or search for a coin to analyze</p>
                    <button class="rp-analyzer-button" onclick="document.querySelector('[data-tab=\\"search\\"]').click()">
                        🔎 Search Coins
                    </button>
                </div>
            `;
            return;
        }

        content.innerHTML = `
            <div class="rp-analyzer-section">
                <div class="rp-analyzer-section-title">🔄 Loading ${symbol}...</div>
                <div class="rp-loading"></div>
                <p style="text-align: center; margin-top: 16px;">Fetching comprehensive market data...</p>
            </div>
        `;

        try {
            await loadCoinData(symbol);
        } catch (error) {
            content.innerHTML = `
                <div class="rp-analyzer-section">
                    <div class="rp-analyzer-section-title">❌ Error</div>
                    <p style="color: #ff6b6b;">${error}</p>
                    <button class="rp-analyzer-button" onclick="updateAnalysisTab()">🔄 Retry</button>
                </div>
            `;
        }
    };

    const updatePortfolioTab = () => {
        const content = document.getElementById('rp-analyzer-content');
        const portfolio = getPortfolio();
        const coins = Object.keys(portfolio);

        if (coins.length === 0) {
            content.innerHTML = `
                <div class="rp-empty-state">
                    <div class="rp-empty-state-icon">💼</div>
                    <h3>Your Portfolio is Empty</h3>
                    <p>Start tracking your investments by adding transactions</p>
                    <button class="rp-analyzer-button" onclick="document.querySelector('[data-tab=\\"search\\"]').click()">
                        🔎 Find Coins to Track
                    </button>
                </div>
            `;
            return;
        }

        let totalValue = 0;
        let totalCost = 0;
        let portfolioHTML = `
            <div class="rp-analyzer-section">
                <div class="rp-analyzer-section-title">💼 Portfolio Overview</div>
                <div class="rp-score-card">
        `;

        // Calculate portfolio metrics
        coins.forEach(symbol => {
            const holdings = calculateHoldings(symbol);
            if (holdings.quantity > 0) {
                // Note: We'd need current price to calculate actual values
                // For now, showing holdings data
                totalCost += holdings.quantity * holdings.avgPrice;
            }
        });

        portfolioHTML += `
                    <div class="rp-score-item">
                        <div class="rp-score-value">${coins.length}</div>
                        <div class="rp-score-label">Assets Tracked</div>
                    </div>
                    <div class="rp-score-item">
                        <div class="rp-score-value">${formatNumber(totalCost)}</div>
                        <div class="rp-score-label">Total Cost Basis</div>
                    </div>
                </div>
            </div>

            <div class="rp-analyzer-section">
                <div class="rp-analyzer-section-title">📊 Holdings</div>
                <table class="rp-transaction-table">
                    <thead>
                        <tr>
                            <th>Coin</th>
                            <th>Quantity</th>
                            <th>Avg Price</th>
                            <th>Cost Basis</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        coins.forEach(symbol => {
            const holdings = calculateHoldings(symbol);
            if (holdings.quantity > 0) {
                const costBasis = holdings.quantity * holdings.avgPrice;
                portfolioHTML += `
                    <tr>
                        <td><strong>${symbol}</strong></td>
                        <td>${formatNumberWithCommas(holdings.quantity.toFixed(6))}</td>
                        <td>${formatPrice(holdings.avgPrice)}</td>
                        <td>${formatNumberWithCommas(costBasis.toFixed(2))}</td>
                        <td>
                            <button class="rp-analyzer-button rp-analyze-btn"
                                    data-symbol="${symbol}"
                                    style="padding: 6px 12px; font-size: 12px;">
                                🔍 Analyze
                            </button>
                        </td>
                    </tr>
                `;
            }
        });

        portfolioHTML += `
                    </tbody>
                </table>
            </div>
        `;

        content.innerHTML = portfolioHTML;

        // Setup event listeners for analyze buttons
        setTimeout(() => {
            document.querySelectorAll('.rp-analyze-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const symbol = this.getAttribute('data-symbol');
                    console.log('🔍 Analyze button clicked for:', symbol);
                    currentCoin = symbol;
                    document.querySelector('[data-tab="analysis"]').click();
                });
            });
        }, 100);
    };

    const updateTransactionsTab = () => {
        const content = document.getElementById('rp-analyzer-content');
        const portfolio = getPortfolio();

        let allTransactions = [];
        Object.keys(portfolio).forEach(symbol => {
            if (portfolio[symbol].transactions) {
                portfolio[symbol].transactions.forEach(tx => {
                    allTransactions.push({ ...tx, symbol });
                });
            }
        });

        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (allTransactions.length === 0) {
            content.innerHTML = `
                <div class="rp-empty-state">
                    <div class="rp-empty-state-icon">📝</div>
                    <h3>No Transactions</h3>
                    <p>Your transaction history will appear here</p>
                </div>
            `;
            return;
        }

        const itemsPerPage = 15;
        const totalPages = Math.ceil(allTransactions.length / itemsPerPage);
        const currentPage = transactionsCurrentPage || 1;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentTransactions = allTransactions.slice(startIndex, endIndex);

        content.innerHTML = `
            <div class="rp-analyzer-section">
                <div class="rp-analyzer-section-title">📝 Transaction History</div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div>Total: <strong>${allTransactions.length}</strong> transactions</div>
                    <div style="display: flex; gap: 8px;">
                        <button class="rp-analyzer-button rp-export-btn">📤 Export</button>
                        <button class="rp-analyzer-button rp-import-btn">📥 Import</button>
                    </div>
                </div>

                <table class="rp-transaction-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Coin</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentTransactions.map(tx => `
                            <tr>
                                <td class="rp-transaction-date">${formatDateShort(tx.date)}</td>
                                <td class="rp-transaction-coin">${tx.symbol}</td>
                                <td>
                                    <span class="rp-transaction-type ${tx.type}">
                                        ${tx.type.toUpperCase()}
                                    </span>
                                </td>
                                <td>${formatNumberWithCommas(Math.abs(tx.quantity).toFixed(6))}</td>
                                <td>${formatPrice(tx.price)}</td>
                                <td>${formatNumberWithCommas((Math.abs(tx.quantity) * tx.price).toFixed(2))}</td>
                                <td>
                                    <button class="rp-analyzer-button rp-delete rp-delete-tx-btn" 
                                            data-symbol="${tx.symbol}" 
                                            data-txid="${tx.id}">
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                ${totalPages > 1 ? `
                    <div style="display: flex; justify-content: center; gap: 8px; margin-top: 16px;">
                        ${currentPage > 1 ? `<button class="rp-analyzer-button rp-prev-page-btn">❮ Prev</button>` : ''}
                        <span style="display: flex; align-items: center; padding: 0 16px;">
                            Page ${currentPage} of ${totalPages}
                        </span>
                        ${currentPage < totalPages ? `<button class="rp-analyzer-button rp-next-page-btn">Next ❯</button>` : ''}
                    </div>
                ` : ''}
            </div>
        `;

        // CRITICAL: Setup delete button event listeners IMMEDIATELY
        setTimeout(() => {
            console.log('🔧 Setting up transaction delete button listeners...');
            
            // Delete transaction buttons
            document.querySelectorAll('.rp-delete-tx-btn').forEach((button, index) => {
                const symbol = button.getAttribute('data-symbol');
                const txId = button.getAttribute('data-txid');
                
                console.log(`🗑️ Setting up delete button ${index + 1}: ${symbol} - ${txId}`);
                
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log(`🗑️ DELETE CLICKED! Symbol: ${symbol}, TxId: ${txId}`);
                    
                    // Immediate visual feedback
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '⏳ Deleting...';
                    this.disabled = true;
                    this.style.background = 'linear-gradient(135deg, #ffa500, #ff8c00)';
                    
                    try {
                        const success = deleteTransaction(symbol, txId);
                        
                        if (success) {
                            console.log('✅ Transaction deleted successfully');
                            showNotification(`✅ ${symbol} transaction deleted!`, 'success');
                            
                            // Smooth row removal
                            const row = this.closest('tr');
                            if (row) {
                                row.style.transition = 'all 0.5s ease';
                                row.style.background = 'rgba(255, 71, 87, 0.3)';
                                row.style.transform = 'scale(0.95)';
                                row.style.opacity = '0.5';
                                
                                setTimeout(() => {
                                    updateTransactionsTab(); // Refresh the entire tab
                                }, 500);
                            } else {
                                updateTransactionsTab();
                            }
                        } else {
                            console.error('❌ Delete failed');
                            showNotification('❌ Failed to delete transaction', 'error');
                            this.innerHTML = originalHTML;
                            this.disabled = false;
                            this.style.background = 'linear-gradient(135deg, #ff4757, #ff3742)';
                        }
                    } catch (error) {
                        console.error('❌ Delete error:', error);
                        showNotification('❌ Error deleting transaction', 'error');
                        this.innerHTML = originalHTML;
                        this.disabled = false;
                        this.style.background = 'linear-gradient(135deg, #ff4757, #ff3742)';
                    }
                });
                
                console.log(`✅ Delete button ${index + 1} listener set successfully`);
            });

            // Export button
            const exportBtn = document.querySelector('.rp-export-btn');
            if (exportBtn) {
                exportBtn.addEventListener('click', () => {
                    console.log('📤 Export button clicked');
                    exportTransactions();
                });
            }

            // Import button
            const importBtn = document.querySelector('.rp-import-btn');
            if (importBtn) {
                importBtn.addEventListener('click', () => {
                    console.log('📥 Import button clicked');
                    showImportModal();
                });
            }

            // Pagination buttons
            const prevBtn = document.querySelector('.rp-prev-page-btn');
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    transactionsCurrentPage = Math.max(1, currentPage - 1);
                    updateTransactionsTab();
                });
            }

            const nextBtn = document.querySelector('.rp-next-page-btn');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    transactionsCurrentPage = Math.min(totalPages, currentPage + 1);
                    updateTransactionsTab();
                });
            }

            console.log('✅ All transaction tab event listeners setup complete');
        }, 100);
    };

    const updateSearchTab = () => {
        const content = document.getElementById('rp-analyzer-content');

        content.innerHTML = `
            <div class="rp-analyzer-section">
                <div class="rp-analyzer-section-title">🔎 Search Coins</div>
                <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                    <input type="text" class="rp-analyzer-input rp-search-input"
                           placeholder="Enter coin name or symbol..." style="margin-bottom: 0; flex: 1;">
                    <button class="rp-analyzer-button rp-search-btn">🔍 Search</button>
                </div>
            </div>
            <div class="rp-search-results"></div>
        `;

        // Setup search functionality
        setTimeout(() => {
            const searchInput = document.querySelector('.rp-search-input');
            const searchBtn = document.querySelector('.rp-search-btn');
            
            const performSearch = async () => {
                const searchTerm = searchInput.value.trim();
                if (!searchTerm) {
                    showNotification('Please enter a search term', 'error');
                    return;
                }

                const resultsContainer = document.querySelector('.rp-search-results');
                resultsContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <div class="rp-loading"></div>
                        <p style="margin-top: 16px;">Searching for "${searchTerm}"...</p>
                    </div>
                `;

                try {
                    const results = await searchCoins(searchTerm);

                    if (!results.coins || results.coins.length === 0) {
                        resultsContainer.innerHTML = `
                            <div class="rp-empty-state">
                                <div class="rp-empty-state-icon">❌</div>
                                <h3>No Results Found</h3>
                                <p>No coins found matching "${searchTerm}"</p>
                            </div>
                        `;
                        return;
                    }

                    resultsContainer.innerHTML = `
                        <div class="rp-analyzer-section">
                            <div class="rp-analyzer-section-title">📊 Search Results (${results.coins.length})</div>
                            <table class="rp-transaction-table">
                                <thead>
                                    <tr>
                                        <th>Coin</th>
                                        <th>Price</th>
                                        <th>24h Change</th>
                                        <th>Market Cap</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${results.coins.map(coin => {
                                        const changePercent = ((coin.change24h / (coin.currentPrice - coin.change24h)) * 100).toFixed(2);
                                        const direction = changePercent >= 0 ? 'positive' : 'negative';
                                        return `
                                            <tr>
                                                <td><strong>${coin.name}</strong><br><small>${coin.symbol}</small></td>
                                                <td>${formatPrice(coin.currentPrice)}</td>
                                                <td class="rp-${direction}">
                                                    ${changePercent >= 0 ? '+' : ''}${changePercent}%
                                                </td>
                                                <td>${formatNumber(coin.marketCap)}</td>
                                                <td>
                                                    <button class="rp-analyzer-button rp-analyze-search-btn"
                                                            data-symbol="${coin.symbol}">
                                                        🔍 Analyze
                                                    </button>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;

                    // Setup analyze buttons for search results
                    setTimeout(() => {
                        document.querySelectorAll('.rp-analyze-search-btn').forEach(button => {
                            button.addEventListener('click', function() {
                                const symbol = this.getAttribute('data-symbol');
                                console.log('🔍 Search analyze button clicked for:', symbol);
                                currentCoin = symbol;
                                document.querySelector('[data-tab="analysis"]').click();
                            });
                        });
                    }, 100);

                } catch (error) {
                    resultsContainer.innerHTML = `
                        <div class="rp-analyzer-section">
                            <div class="rp-analyzer-section-title">❌ Error</div>
                            <p style="color: #ff6b6b;">Error searching: ${error}</p>
                            <button class="rp-analyzer-button rp-retry-search-btn">🔄 Retry</button>
                        </div>
                    `;
                    
                    // Setup retry button
                    setTimeout(() => {
                        const retryBtn = document.querySelector('.rp-retry-search-btn');
                        if (retryBtn) {
                            retryBtn.addEventListener('click', performSearch);
                        }
                    }, 100);
                }
            };

            // Setup search events
            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch();
            });
        }, 100);
    };

    const updateSettingsTab = () => {
        const content = document.getElementById('rp-analyzer-content');
        const apiKey = getApiKey();

        content.innerHTML = `
            <div class="rp-analyzer-section">
                <div class="rp-analyzer-section-title">🔐 API Configuration</div>
                <p style="margin-bottom: 16px; color: rgba(255, 255, 255, 0.8);">
                    Enter your RugPlay API key to access comprehensive market data
                </p>

                <div style="position: relative;">
                    <input type="password" class="rp-analyzer-input rp-api-key-input"
                           value="${apiKey}" placeholder="Enter your RugPlay API key...">
                    <button class="rp-analyzer-button rp-toggle-key-btn"
                            style="position: absolute; right: 8px; top: 8px; padding: 8px;">👁️</button>
                </div>

                <button class="rp-analyzer-button rp-save-api-btn">💾 Save API Key</button>
            </div>

            <div class="rp-analyzer-section">
                <div class="rp-analyzer-section-title">💼 Portfolio Management</div>
                <p style="margin-bottom: 16px; color: rgba(255, 255, 255, 0.8);">
                    Backup and restore your portfolio data
                </p>

                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <button class="rp-analyzer-button rp-export-portfolio-btn">📤 Export Portfolio</button>
                    <button class="rp-analyzer-button rp-import-portfolio-btn">📥 Import Portfolio</button>
                    <button class="rp-analyzer-button rp-delete rp-clear-portfolio-btn">🗑️ Clear All Data</button>
                </div>
            </div>

            <div class="rp-analyzer-section">
                <div class="rp-analyzer-section-title">ℹ️ About</div>
                <div class="rp-metric-grid">
                    <div class="rp-metric-item">
                        <div class="rp-metric-title">Version</div>
                        <div class="rp-metric-value">2.0.1 Fixed</div>
                    </div>
                    <div class="rp-metric-item">
                        <div class="rp-metric-title">Author</div>
                        <div class="rp-metric-value">seltonmt012</div>
                    </div>
                    <div class="rp-metric-item">
                        <div class="rp-metric-title">Updated</div>
                        <div class="rp-metric-value">2025-06-26</div>
                    </div>
                    <div class="rp-metric-item">
                        <div class="rp-metric-title">Features</div>
                        <div class="rp-metric-value">AI Analysis</div>
                    </div>
                </div>
            </div>
        `;

        // Setup settings event listeners
        setTimeout(() => {
            // API key visibility toggle
            const toggleKeyBtn = document.querySelector('.rp-toggle-key-btn');
            const apiKeyInput = document.querySelector('.rp-api-key-input');
            
            if (toggleKeyBtn && apiKeyInput) {
                toggleKeyBtn.addEventListener('click', () => {
                    if (apiKeyInput.type === 'password') {
                        apiKeyInput.type = 'text';
                        toggleKeyBtn.textContent = '🔒';
                    } else {
                        apiKeyInput.type = 'password';
                        toggleKeyBtn.textContent = '👁️';
                    }
                });
            }

            // Save API key
            const saveApiBtn = document.querySelector('.rp-save-api-btn');
            if (saveApiBtn) {
                saveApiBtn.addEventListener('click', () => {
                    const key = apiKeyInput.value.trim();
                    if (!key) {
                        showNotification('❌ API key cannot be empty', 'error');
                        return;
                    }
                    
                    saveApiKey(key);
                    showNotification('✅ API key saved successfully', 'success');
                    
                    setTimeout(() => {
                        document.querySelector('[data-tab="analysis"]').click();
                    }, 1000);
                });
            }

            // Export portfolio
            const exportPortfolioBtn = document.querySelector('.rp-export-portfolio-btn');
            if (exportPortfolioBtn) {
                exportPortfolioBtn.addEventListener('click', () => {
                    exportTransactions();
                });
            }

            // Import portfolio
            const importPortfolioBtn = document.querySelector('.rp-import-portfolio-btn');
            if (importPortfolioBtn) {
                importPortfolioBtn.addEventListener('click', () => {
                    showImportModal();
                });
            }

            // Clear portfolio
            const clearPortfolioBtn = document.querySelector('.rp-clear-portfolio-btn');
            if (clearPortfolioBtn) {
                clearPortfolioBtn.addEventListener('click', () => {
                    showConfirmModal(
                        '🗑️ Clear All Data',
                        'This will permanently delete all your portfolio data and transactions. This action cannot be undone.',
                        () => {
                            try {
                                savePortfolio({});
                                showNotification('✅ Portfolio data cleared successfully', 'success');
                                
                                // Update UI if we're on portfolio tab
                                const activeTab = document.querySelector('.rp-analyzer-tab.active');
                                if (activeTab && activeTab.dataset.tab === 'portfolio') {
                                    setTimeout(() => updatePortfolioTab(), 500);
                                }
                            } catch (error) {
                                console.error('❌ Error clearing portfolio:', error);
                                showNotification('❌ Error clearing portfolio', 'error');
                            }
                        }
                    );
                });
            }
        }, 100);
    };

    // ===========================
    // Enhanced Coin Data Loading
    // ===========================

    let currentCoin = null;
    let currentCoinData = null;
    let currentHoldersData = null;
    let transactionsCurrentPage = 1;

    const loadCoinData = async (symbol) => {
        try {
            const [coinData, holdersData] = await Promise.all([
                fetchCoinData(symbol),
                fetchCoinHolders(symbol)
            ]);

            currentCoin = symbol;
            currentCoinData = coinData;
            currentHoldersData = holdersData;

            const holdings = calculateHoldings(symbol);
            const coin = coinData.coin;
            const price = coin.currentPrice;
            const change24h = coin.change24h;
            const changePercent = ((change24h / (price - change24h)) * 100);

            // Enhanced Analysis
            const priceAnalysis = analyzePrice(coinData.candlestickData);
            const securityAnalysis = analyzeSecurity(coinData, holdersData);
            const activityAnalysis = analyzeActivity(coinData, holdersData);
            const profitAnalysis = analyzeProfitability(coinData, holdings);

            // Personal P&L
            let profitLoss = 0;
            let profitLossPercent = 0;
            if (holdings.quantity > 0) {
                profitLoss = holdings.quantity * (price - holdings.avgPrice);
                profitLossPercent = ((price / holdings.avgPrice) - 1) * 100;
            }

            const content = document.getElementById('rp-analyzer-content');
            content.innerHTML = `
                <!-- Prediction Card -->
                <div class="rp-prediction-card">
                    <div class="rp-prediction-icon">${getPredictionIcon(priceAnalysis.trend)}</div>
                    <div class="rp-prediction-text">${priceAnalysis.message}</div>
                    <div class="rp-prediction-confidence">Confidence: ${priceAnalysis.confidence.toFixed(0)}%</div>
                </div>

                <!-- Overall Scores -->
                <div class="rp-analyzer-section">
                    <div class="rp-analyzer-section-title">🎯 ${coin.name} (${coin.symbol}) Analysis</div>
                    <div class="rp-score-card">
                        <div class="rp-score-item">
                            <div class="rp-score-value rp-score-${getScoreClass(securityAnalysis.securityScore)}">${securityAnalysis.securityScore}/100</div>
                            <div class="rp-score-label">Security Score</div>
                        </div>
                        <div class="rp-score-item">
                            <div class="rp-score-value rp-score-${getScoreClass(activityAnalysis.activityScore)}">${activityAnalysis.activityScore.toFixed(0)}/100</div>
                            <div class="rp-score-label">Activity Level</div>
                        </div>
                        <div class="rp-score-item">
                            <div class="rp-score-value rp-score-${getProfitClass(profitAnalysis.level)}">${profitAnalysis.profitScore.toFixed(0)}/100</div>
                            <div class="rp-score-label">Profit Potential</div>
                        </div>
                        <div class="rp-score-item">
                            <div class="rp-score-value ${changePercent >= 0 ? 'rp-positive' : 'rp-negative'}">
                                ${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%
                            </div>
                            <div class="rp-score-label">24h Change</div>
                        </div>
                    </div>
                </div>

                <!-- Market Data -->
                <div class="rp-analyzer-section">
                    <div class="rp-analyzer-section-title">📊 Market Data</div>
                    <div class="rp-metric-grid">
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">Current Price</div>
                            <div class="rp-metric-value">${formatPrice(price)}</div>
                        </div>
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">Market Cap</div>
                            <div class="rp-metric-value">${formatNumber(coin.marketCap)}</div>
                        </div>
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">24h Volume</div>
                            <div class="rp-metric-value">${formatNumber(coin.volume24h)}</div>
                        </div>
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">Liquidity</div>
                            <div class="rp-metric-value">${formatNumber(coin.poolBaseCurrencyAmount)}</div>
                        </div>
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">Supply</div>
                            <div class="rp-metric-value">${formatNumber(coin.circulatingSupply)}</div>
                        </div>
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">Holders</div>
                            <div class="rp-metric-value">${holdersData.holders.length}</div>
                        </div>
                    </div>
                </div>

                <!-- Security Analysis -->
                <div class="rp-risk-analysis">
                    <div class="rp-risk-title">🛡️ Security Analysis - ${securityAnalysis.level}</div>
                    <div style="margin-bottom: 16px;">
                        <div class="rp-progress-bar">
                            <div class="rp-progress-fill rp-progress-${getScoreClass(securityAnalysis.securityScore)}"
                                 style="width: ${securityAnalysis.securityScore}%"></div>
                        </div>
                        <div style="text-align: center; margin-top: 8px; font-weight: 600;">
                            ${securityAnalysis.recommendation}
                        </div>
                    </div>
                    <div class="rp-risk-factors">
                        ${securityAnalysis.factors.map(factor => `
                            <div class="rp-risk-factor">
                                <span>${factor.message}</span>
                                <span class="rp-risk-impact ${factor.type}">${factor.impact > 0 ? '+' : ''}${factor.impact}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Activity Analysis -->
                <div class="rp-analyzer-section">
                    <div class="rp-analyzer-section-title">⚡ Activity Analysis - ${activityAnalysis.level}</div>
                    <div class="rp-progress-bar">
                        <div class="rp-progress-fill rp-progress-${getScoreClass(activityAnalysis.activityScore)}"
                             style="width: ${activityAnalysis.activityScore}%"></div>
                    </div>
                    <div class="rp-metric-grid" style="margin-top: 16px;">
                        ${activityAnalysis.factors.map(factor => `
                            <div class="rp-metric-item">
                                <div class="rp-metric-title">${factor.metric}</div>
                                <div class="rp-metric-value">${factor.value}</div>
                                <div style="font-size: 12px; color: rgba(255,255,255,0.6);">
                                    Score: ${factor.score.toFixed(0)}/${factor.maxScore}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Profitability Analysis -->
                <div class="rp-analyzer-section">
                    <div class="rp-analyzer-section-title">💰 Profitability Analysis - ${profitAnalysis.level}</div>
                    <div class="rp-progress-bar">
                        <div class="rp-progress-fill rp-progress-${getProfitClass(profitAnalysis.level)}"
                             style="width: ${profitAnalysis.profitScore}%"></div>
                    </div>
                    <div style="margin-top: 16px;">
                        ${profitAnalysis.factors.map(factor => `
                            <div class="rp-analyzer-data-row">
                                <span class="rp-analyzer-label">${factor.metric}:</span>
                                <span class="rp-analyzer-value rp-${factor.impact}">${factor.value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Your Holdings -->
                <div class="rp-analyzer-section">
                    <div class="rp-analyzer-section-title">💼 Your Holdings</div>
                    ${holdings.quantity > 0 ? `
                        <div class="rp-metric-grid">
                            <div class="rp-metric-item">
                                <div class="rp-metric-title">Quantity</div>
                                <div class="rp-metric-value">${formatNumberWithCommas(holdings.quantity.toFixed(6))}</div>
                            </div>
                            <div class="rp-metric-item">
                                <div class="rp-metric-title">Avg Cost</div>
                                <div class="rp-metric-value">${formatPrice(holdings.avgPrice)}</div>
                            </div>
                            <div class="rp-metric-item">
                                <div class="rp-metric-title">Current Value</div>
                                <div class="rp-metric-value">${formatNumberWithCommas((holdings.quantity * price).toFixed(2))}</div>
                            </div>
                            <div class="rp-metric-item">
                                <div class="rp-metric-title">P&L</div>
                                <div class="rp-metric-value ${profitLoss >= 0 ? 'rp-positive' : 'rp-negative'}">
                                    ${profitLoss >= 0 ? '+' : ''}${formatNumberWithCommas(Math.abs(profitLoss).toFixed(2))}
                                    (${profitLossPercent >= 0 ? '+' : ''}${profitLossPercent.toFixed(2)}%)
                                </div>
                            </div>
                        </div>
                    ` : `
                        <p style="text-align: center; color: rgba(255,255,255,0.6); margin: 20px 0;">
                            You don't have any holdings for this coin yet.
                        </p>
                    `}

                    <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; margin-top: 16px;">
                        <h4 style="margin-bottom: 12px; color: #00d4ff;">➕ Add Transaction</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px;">
                            <input type="number" class="rp-analyzer-input rp-transaction-quantity-input"
                                   placeholder="Quantity (+buy/-sell)" style="margin-bottom: 0;" step="any">
                            <input type="number" class="rp-analyzer-input rp-transaction-price-input"
                                   placeholder="Price per coin" style="margin-bottom: 0;" step="any">
                            <button class="rp-analyzer-button rp-add-transaction-btn" style="margin-bottom: 0;">
                                ➕ Add
                            </button>
                        </div>
                        <div style="margin-top: 8px; font-size: 12px; color: rgba(255,255,255,0.6);">
                            💡 Use positive numbers for buys, negative for sells
                        </div>
                    </div>
                </div>

                <!-- Technical Indicators -->
                <div class="rp-analyzer-section">
                    <div class="rp-analyzer-section-title">📈 Technical Analysis</div>
                    <div class="rp-metric-grid">
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">Trend</div>
                            <div class="rp-metric-value">${priceAnalysis.trend}</div>
                        </div>
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">Volatility</div>
                            <div class="rp-metric-value">${priceAnalysis.volatility ? priceAnalysis.volatility.toFixed(2) + '%' : 'N/A'}</div>
                        </div>
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">Momentum</div>
                            <div class="rp-metric-value ${priceAnalysis.momentum >= 0 ? 'rp-positive' : 'rp-negative'}">
                                ${priceAnalysis.momentum ? (priceAnalysis.momentum >= 0 ? '+' : '') + priceAnalysis.momentum.toFixed(2) + '%' : 'N/A'}
                            </div>
                        </div>
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">Volume/MC Ratio</div>
                            <div class="rp-metric-value">${((coin.volume24h / coin.marketCap) * 100).toFixed(2)}%</div>
                        </div>
                    </div>
                    <div class="rp-chart-placeholder">
                        📊 Price Chart Placeholder - Advanced charting coming soon
                    </div>
                </div>

                <!-- Holder Analysis -->
                <div class="rp-analyzer-section">
                    <div class="rp-analyzer-section-title">👥 Holder Distribution</div>
                    <div class="rp-metric-grid">
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">Top Holder</div>
                            <div class="rp-metric-value">${securityAnalysis.holderAnalysis.topHolder.toFixed(2)}%</div>
                        </div>
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">Top 10 Holders</div>
                            <div class="rp-metric-value">${securityAnalysis.holderAnalysis.top10Holders.toFixed(2)}%</div>
                        </div>
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">Pool Holdings</div>
                            <div class="rp-metric-value">${securityAnalysis.holderAnalysis.poolPercentage.toFixed(3)}%</div>
                        </div>
                        <div class="rp-metric-item">
                            <div class="rp-metric-title">Total Holders</div>
                            <div class="rp-metric-value">${securityAnalysis.holderAnalysis.totalHolders}</div>
                        </div>
                    </div>
                </div>

                <!-- Project Info -->
                <div class="rp-analyzer-section">
                    <div class="rp-analyzer-section-title">ℹ️ Project Information</div>
                    <div class="rp-analyzer-data-row">
                        <span class="rp-analyzer-label">Created:</span>
                        <span class="rp-analyzer-value">${formatDate(coin.createdAt)}</span>
                    </div>
                    <div class="rp-analyzer-data-row">
                        <span class="rp-analyzer-label">Creator:</span>
                        <span class="rp-analyzer-value">${coin.creatorName}</span>
                    </div>
                    <div class="rp-analyzer-data-row">
                        <span class="rp-analyzer-label">Age:</span>
                        <span class="rp-analyzer-value">${Math.floor((new Date() - new Date(coin.createdAt)) / (1000 * 60 * 60 * 24))} days</span>
                    </div>
                </div>
            `;

            // Setup add transaction functionality
            setTimeout(() => {
                const addButton = document.querySelector('.rp-add-transaction-btn');
                const quantityInput = document.querySelector('.rp-transaction-quantity-input');
                const priceInput = document.querySelector('.rp-transaction-price-input');

                if (addButton && quantityInput && priceInput) {
                    const addTransactionHandler = () => {
                        const quantity = quantityInput.value;
                        const price = priceInput.value;

                        if (!quantity || !price) {
                            showNotification('❌ Please enter both quantity and price', 'error');
                            return;
                        }

                        if (isNaN(quantity) || isNaN(price)) {
                            showNotification('❌ Please enter valid numbers', 'error');
                            return;
                        }

                        if (parseFloat(price) <= 0) {
                            showNotification('❌ Price must be greater than 0', 'error');
                            return;
                        }

                        try {
                            addTransaction(symbol, parseFloat(quantity), parseFloat(price));

                            // Visual feedback
                            addButton.innerHTML = '✅ Added!';
                            addButton.style.background = 'linear-gradient(135deg, #00ff88, #00d4aa)';
                            addButton.disabled = true;

                            showNotification(`✅ ${quantity > 0 ? 'Buy' : 'Sell'} transaction added for ${symbol}!`, 'success');

                            // Clear inputs
                            quantityInput.value = '';
                            priceInput.value = '';

                            // Reset button and refresh
                            setTimeout(() => {
                                addButton.innerHTML = '➕ Add';
                                addButton.style.background = 'linear-gradient(135deg, #00d4ff, #0096ff)';
                                addButton.disabled = false;
                                loadCoinData(symbol);
                            }, 2000);

                        } catch (error) {
                            console.error('Error adding transaction:', error);
                            showNotification('❌ Error adding transaction', 'error');
                        }
                    };

                    addButton.addEventListener('click', addTransactionHandler);
                    
                    // Enter key support
                    [quantityInput, priceInput].forEach(input => {
                        input.addEventListener('keypress', (e) => {
                            if (e.key === 'Enter') addTransactionHandler();
                        });
                    });
                }
            }, 100);

        } catch (error) {
            console.error('Error loading coin data:', error);
            throw new Error('Failed to load coin data. Please check your API key and network connection.');
        }
    };

    // ===========================
    // Helper Functions
    // ===========================

    const getPredictionIcon = (trend) => {
        const icons = {
            'STRONG_UP': '🚀',
            'UP': '📈',
            'NEUTRAL': '↔️',
            'DOWN': '📉',
            'STRONG_DOWN': '💥',
            'UNKNOWN': '❓'
        };
        return icons[trend] || '❓';
    };

    const getScoreClass = (score) => {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 40) return 'neutral';
        if (score >= 20) return 'poor';
        return 'critical';
    };

    const getProfitClass = (level) => {
        const classes = {
            'EXCELLENT': 'excellent',
            'GOOD': 'good',
            'NEUTRAL': 'neutral',
            'POOR': 'poor',
            'VERY_POOR': 'critical'
        };
        return classes[level] || 'neutral';
    };

    const showNotification = (message, type = 'success') => {
        const existingNotification = document.querySelector('.rp-notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.className = `rp-notification rp-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };

    const showConfirmModal = (title, message, onConfirm) => {
        const existingModal = document.getElementById('rp-confirm-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'rp-modal-backdrop';
        modal.id = 'rp-confirm-modal';
        modal.innerHTML = `
            <div class="rp-modal">
                <div class="rp-modal-title">${title}</div>
                <div class="rp-modal-content">
                    <p>${message}</p>
                </div>
                <div class="rp-modal-actions">
                    <button class="rp-analyzer-button rp-modal-cancel-btn" style="background: #555;">Cancel</button>
                    <button class="rp-analyzer-button rp-delete rp-modal-confirm-btn">Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup modal button listeners
        setTimeout(() => {
            const cancelBtn = document.querySelector('.rp-modal-cancel-btn');
            const confirmBtn = document.querySelector('.rp-modal-confirm-btn');

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    modal.remove();
                });
            }

            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => {
                    try {
                        onConfirm();
                        modal.remove();
                    } catch (error) {
                        console.error('Error in confirmation action:', error);
                        showNotification('Error: ' + error.message, 'error');
                        modal.remove();
                    }
                });
            }
        }, 100);
    };

    // Export/Import Functions
    const exportTransactions = () => {
        const portfolio = getPortfolio();
        const dataStr = JSON.stringify(portfolio, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `rugplay_portfolio_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        showNotification('Portfolio exported successfully', 'success');
    };

    const showImportModal = () => {
        const existingModal = document.querySelector('.rp-modal-backdrop');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'rp-modal-backdrop';
        modal.innerHTML = `
            <div class="rp-modal">
                <div class="rp-modal-title">📥 Import Portfolio Data</div>
                <div class="rp-modal-content">
                    <p>Select a JSON file containing your exported portfolio data:</p>
                    <input type="file" class="rp-import-file-input" accept=".json" class="rp-analyzer-input">
                    <p style="color: #ffa500; margin-top: 10px;">⚠️ This will overwrite your current portfolio data!</p>
                </div>
                <div class="rp-modal-actions">
                    <button class="rp-analyzer-button rp-import-cancel-btn" style="background: #555;">Cancel</button>
                    <button class="rp-analyzer-button rp-import-confirm-btn">Import</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup import modal listeners
        setTimeout(() => {
            const cancelBtn = document.querySelector('.rp-import-cancel-btn');
            const confirmBtn = document.querySelector('.rp-import-confirm-btn');
            const fileInput = document.querySelector('.rp-import-file-input');

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    modal.remove();
                });
            }

            if (confirmBtn && fileInput) {
                confirmBtn.addEventListener('click', () => {
                    if (fileInput.files.length === 0) {
                        showNotification('Please select a file to import', 'error');
                        return;
                    }

                    const file = fileInput.files[0];
                    const reader = new FileReader();

                    reader.onload = (e) => {
                        try {
                            const data = JSON.parse(e.target.result);
                            savePortfolio(data);
                            showNotification('Portfolio imported successfully', 'success');
                            modal.remove();
                            
                            // Update current tab if it's portfolio
                            const activeTab = document.querySelector('.rp-analyzer-tab.active');
                            if (activeTab && activeTab.dataset.tab === 'portfolio') {
                                updatePortfolioTab();
                            }
                        } catch (error) {
                            showNotification('Error importing data: Invalid JSON format', 'error');
                        }
                    };

                    reader.readAsText(file);
                });
            }
        }, 100);
    };

    // Utility Functions
    const formatPrice = (price) => {
        if (price >= 1000) return price.toFixed(2);
        if (price >= 1) return price.toFixed(4);
        if (price >= 0.01) return price.toFixed(5);
        if (price >= 0.0001) return price.toFixed(6);
        if (price >= 0.000001) return price.toFixed(8);
        return price.toExponential(4);
    };

    const formatNumber = (num) => {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
    };

    const formatNumberWithCommas = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatDateShort = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    const getCoinFromUrl = () => {
        const url = window.location.href;
        const coinMatch = url.match(/\/coin\/([A-Z0-9]+)/i);
        return coinMatch ? coinMatch[1] : null;
    };

    const updateUI = () => {
        const activeTab = document.querySelector('.rp-analyzer-tab.active');
        if (activeTab) switchTab(activeTab);
    };

    // ===========================
    // Initialization
    // ===========================

    const init = () => {
        console.log('🚀 Initializing RugPlay Analyzer Pro v2.0.1 Fixed...');
        
        addStyles();

        if (window.location.hostname.includes('rugplay.com')) {
            createUI();

            if (!document.getElementById('rp-toggle-button')) {
                createToggleButton();
            }

            const symbol = getCoinFromUrl();
            if (symbol) {
                currentCoin = symbol;
                setTimeout(() => {
                    const container = document.getElementById('rp-analyzer-container');
                    if (container && container.style.display === 'none') {
                        toggleAnalyzer();
                    }
                }, 1000);
            }

            // URL change detection
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    if (!document.getElementById('rp-toggle-button')) {
                        createToggleButton();
                    }
                    const newSymbol = getCoinFromUrl();
                    if (newSymbol && newSymbol !== currentCoin) {
                        currentCoin = newSymbol;
                        if (document.getElementById('rp-analyzer-container').style.display !== 'none') {
                            updateAnalysisTab();
                        }
                    }
                }
            }).observe(document, {subtree: true, childList: true});

            console.log('✅ RugPlay Analyzer Pro initialized successfully!');
        }
    };

    // Start the application
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Ensure toggle button always exists
    setInterval(() => {
        if (!document.getElementById('rp-toggle-button')) {
            createToggleButton();
        }
    }, 5000);

    console.log('📊 RugPlay Market Analyzer Pro v2.0.1 Fixed - Delete Buttons Working!');

})();