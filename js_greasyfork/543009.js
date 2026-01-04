// ==UserScript==
// @name         Universal Math CAPTCHA Solver
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Solves ALL basic math CAPTCHAs (+, -, *, /) in any format
// @author       ChrisN40
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543009/Universal%20Math%20CAPTCHA%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/543009/Universal%20Math%20CAPTCHA%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        checkInterval: 1000,
        maxAttempts: 3,
        retryDelay: 1000,
        mathPatterns: [
            // Standard equation formats
            /(?:solve|calculate|what is|answer)\s*(?:the )?(?:following )?(?:math )?(?:problem|function|question)?[:]?\s*([\d+\-*\/=. ]+)/i,
            /([\d]+\s*[\+\-\*\/]\s*[\d]+)/,

            // Word problem formats
            /first number is (\d+)[^\d]+(\d+)[^\d]+([\+\-\*\/])/i,
            /sum of (\d+) and (\d+)/i,
            /add (\d+) (?:and|to) (\d+)/i,
            /subtract (\d+) (?:from|and) (\d+)/i,
            /product of (\d+) and (\d+)/i,
            /multiply (\d+) (?:and|by) (\d+)/i,
            /divide (\d+) (?:by|and) (\d+)/i,
            /(\d+) plus (\d+)/i,
            /(\d+) minus (\d+)/i,
            /(\d+) times (\d+)/i,
            /(\d+) multiplied by (\d+)/i,
            /(\d+) divided by (\d+)/i,

            // Special cases
            /how much is (\d+) ([\+\-\*\/]) (\d+)/i
        ]
    };

    class UniversalMathSolver {
        constructor() {
            this.attempts = new WeakMap();
            this.init();
        }

        init() {
            console.log('Universal Math Solver initialized');
            this.setupMutationObserver();
            this.checkMathCaptchas();
            setInterval(() => this.checkMathCaptchas(), config.checkInterval);
        }

        setupMutationObserver() {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && this.isMathCaptcha(node.textContent)) {
                            this.processMathElement(node);
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }

        checkMathCaptchas() {
            const textElements = document.querySelectorAll('div, p, span, label, td, li, b, strong, h1, h2, h3, h4, h5, h6');

            textElements.forEach(element => {
                if (this.shouldProcessElement(element)) {
                    this.processMathElement(element);
                }
            });
        }

        shouldProcessElement(element) {
            if (!this.attempts.has(element)) {
                this.attempts.set(element, 0);
            }
            return this.attempts.get(element) < config.maxAttempts &&
                   this.isMathCaptcha(element.textContent);
        }

        isMathCaptcha(text) {
            if (!text) return false;
            return config.mathPatterns.some(pattern => pattern.test(text));
        }

        processMathElement(element) {
            const attempts = this.attempts.get(element);
            this.attempts.set(element, attempts + 1);

            try {
                const mathProblem = this.extractMathProblem(element.textContent);
                if (mathProblem) {
                    const solution = this.solveMathProblem(mathProblem);
                    if (solution !== null) {
                        this.fillSolution(solution, element);
                    }
                }
            } catch (error) {
                console.error('Math CAPTCHA solve error:', error);
                if (attempts < config.maxAttempts - 1) {
                    setTimeout(() => this.processMathElement(element), config.retryDelay);
                }
            }
        }

        extractMathProblem(text) {
            for (const pattern of config.mathPatterns) {
                const match = text.match(pattern);
                if (match) {
                    // Handle word problems
                    if (match[1] && match[2] && match[3]) {
                        const num1 = parseFloat(match[1]);
                        const num2 = parseFloat(match[2]);
                        const operator = this.normalizeOperator(match[3]);

                        // Handle subtraction word order ("subtract A from B" = B - A)
                        if (match[0].includes('subtract') && operator === '-') {
                            return `${num2}${operator}${num1}`;
                        }
                        return `${num1}${operator}${num2}`;
                    }
                    // Handle standard equations
                    else if (match[1]) {
                        return match[1].replace(/\s/g, '');
                    }
                }
            }
            return null;
        }

        normalizeOperator(op) {
            const opMap = {
                'plus': '+',
                'add': '+',
                'sum': '+',
                'minus': '-',
                'subtract': '-',
                'times': '*',
                'multiplied': '*',
                'product': '*',
                'divide': '/',
                'divided': '/'
            };
            return opMap[op.toLowerCase()] || op;
        }

        solveMathProblem(problem) {
            try {
                // Clean and validate the expression
                const cleanExpr = problem.replace(/[^\d+\-*\/.]/g, '');
                if (!/^[\d+\-*\/.]+$/.test(cleanExpr)) return null;

                // Split into tokens (numbers and operators)
                const tokens = cleanExpr.split(/([\+\-\*\/])/).filter(x => x);

                // Convert to numbers and operators
                const elements = [];
                for (const token of tokens) {
                    if (['+', '-', '*', '/'].includes(token)) {
                        elements.push({ type: 'operator', value: token });
                    } else {
                        elements.push({ type: 'number', value: parseFloat(token) });
                    }
                }

                // First pass: multiplication and division
                for (let i = 0; i < elements.length; i++) {
                    const el = elements[i];
                    if (el.type === 'operator' && (el.value === '*' || el.value === '/')) {
                        const left = elements[i-1].value;
                        const right = elements[i+1].value;
                        let result;

                        if (el.value === '*') {
                            result = left * right;
                        } else {
                            if (right === 0) return '∞'; // Division by zero
                            result = left / right;
                        }

                        // Replace the three elements (left, op, right) with result
                        elements.splice(i-1, 3, { type: 'number', value: result });
                        i -= 2; // Adjust index after replacement
                    }
                }

                // Second pass: addition and subtraction
                let result = elements[0].value;
                for (let i = 1; i < elements.length; i += 2) {
                    const operator = elements[i].value;
                    const number = elements[i+1].value;

                    if (operator === '+') {
                        result += number;
                    } else {
                        result -= number;
                    }
                }

                // Round to 2 decimal places if needed
                return result % 1 === 0 ? result : parseFloat(result.toFixed(2));
            } catch (e) {
                console.error('Math solving failed:', e);
                return null;
            }
        }

        fillSolution(solution, referenceElement) {
            const input = this.findInputField(referenceElement);
            if (!input) return false;

            // Try different methods to set the value
            const methods = [
                () => { input.value = solution; return input.value == solution; },
                () => {
                    input.focus();
                    input.value = solution;
                    this.triggerEvents(input);
                    return input.value == solution;
                },
                () => {
                    const setter = Object.getOwnPropertyDescriptor(
                        HTMLInputElement.prototype, 'value').set;
                    setter.call(input, solution);
                    this.triggerEvents(input);
                    return input.value == solution;
                }
            ];

            for (const method of methods) {
                try {
                    if (method()) {
                        console.log(`Solved: ${solution}`);
                        return true;
                    }
                } catch (e) {
                    console.debug('Method failed:', e);
                }
            }
            return false;
        }

        findInputField(referenceElement) {
            const selectors = [
                'input[type="text"]',
                'input[type="number"]',
                'input:not([type])',
                'textarea',
                '#answer',
                '#solution',
                '#captcha',
                '#mathAnswer'
            ];

            // Check in parent containers
            let container = referenceElement;
            while (container) {
                for (const selector of selectors) {
                    const input = container.querySelector(selector);
                    if (input) return input;
                }
                container = container.parentElement;
            }

            // Check nearby elements
            const allInputs = document.querySelectorAll('input, textarea');
            const refRect = referenceElement.getBoundingClientRect();
            let closestInput = null;
            let minDistance = Infinity;

            allInputs.forEach(input => {
                const inputRect = input.getBoundingClientRect();
                const distance = Math.sqrt(
                    Math.pow(inputRect.left - refRect.left, 2) +
                    Math.pow(inputRect.top - refRect.top, 2)
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    closestInput = input;
                }
            });

            return closestInput;
        }

        triggerEvents(input) {
            ['focus', 'keydown', 'keypress', 'keyup', 'input', 'change', 'blur'].forEach(event => {
                input.dispatchEvent(new Event(event, {
                    bubbles: true,
                    cancelable: true
                }));
            });
        }
    }

    // Start the solver
    new UniversalMathSolver();
})();