// ==UserScript==
// @name         MathSpace MathGPT Integration
// @namespace    http://tampermonkey.net/
// @version      1.69420
// @description  MathGPT-like interface with problem solving for Mathspace
// @author       PrimeMinisteModiji1111111111
// @match        https://*.mathspace.co/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/527168/MathSpace%20MathGPT%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/527168/MathSpace%20MathGPT%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .mathgpt-container {
            position: fixed;
            right: 20px;
            top: 20px;
            width: 400px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            padding: 20px;
            font-family: Arial, sans-serif;
        }

        .mathgpt-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }

        .mathgpt-title {
            font-size: 20px;
            font-weight: bold;
            color: #1a73e8;
        }

        .mathgpt-input {
            width: 100%;
            min-height: 60px;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 10px;
            resize: none;
            font-size: 14px;
        }

        .mathgpt-button {
            background: #1a73e8;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }

        .mathgpt-button:hover {
            background: #1557b0;
        }

        .mathgpt-solution {
            margin-top: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            display: none;
        }

        .mathgpt-step {
            background: white;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            border: 1px solid #eee;
        }

        .mathgpt-error {
            color: #dc3545;
            padding: 10px;
            background: #ffe6e6;
            border-radius: 5px;
            margin-top: 10px;
        }
    `);

    class MathSolver {
        solve(problem) {
            problem = this.prepareProblem(problem);
            const type = this.identifyProblemType(problem);
            
            try {
                switch(type) {
                    case 'arithmetic':
                        return this.solveArithmetic(problem);
                    case 'algebraic':
                        return this.solveAlgebraic(problem);
                    case 'quadratic':
                        return this.solveQuadratic(problem);
                    default:
                        return this.solveBasic(problem);
                }
            } catch (error) {
                throw new Error('Unable to solve problem: ' + error.message);
            }
        }

        prepareProblem(problem) {
            return problem
                .replace(/÷/g, '/')
                .replace(/×/g, '*')
                .replace(/\^/g, '**')
                .trim();
        }

        identifyProblemType(problem) {
            const cleanProblem = problem.replace(/\s+/g, '');
            if (cleanProblem.includes('x²') || 
                cleanProblem.includes('x**2') || 
                cleanProblem.match(/x\^2/)) {
                return 'quadratic';
            }
            if (cleanProblem.includes('x') || cleanProblem.includes('=')) {
                return 'algebraic';
            }
            return 'arithmetic';
        }

        solveArithmetic(problem) {
            const result = this.safeEval(problem);
            return {
                steps: [
                    `Original expression: ${problem}`,
                    `Simplified result: ${result}`
                ],
                result: result,
                type: 'arithmetic'
            };
        }

        solveAlgebraic(problem) {
            if (!problem.includes('=')) {
                throw new Error('Algebraic equations must contain an equals sign');
            }

            const [left, right] = problem.split('=').map(side => side.trim());
            // Simple linear equation solver
            if (left.includes('x')) {
                const coefficient = this.getCoefficient(left);
                const constant = this.getConstant(right);
                const solution = constant / coefficient;
                
                return {
                    steps: [
                        `Original equation: ${problem}`,
                        `Isolating x term: ${left} = ${right}`,
                        `Solving for x: x = ${solution}`
                    ],
                    result: solution,
                    type: 'algebraic'
                };
            }
            
            throw new Error('Cannot solve this type of algebraic equation');
        }

        solveQuadratic(problem) {
            // Remove spaces and convert to standard form
            let equation = problem.replace(/\s+/g, '');
            
            // Handle equations with = 0
            if (equation.includes('=')) {
                const [left, right] = equation.split('=').map(side => side.trim());
                equation = left + '-(' + right + ')';
            }
            
            // Parse coefficients
            let a = 0, b = 0, c = 0;
            
            // Convert equation to standard form
            equation = equation
                .replace(/-x²/g, '-1x²')
                .replace(/\+x²/g, '+1x²')
                .replace(/^x²/, '1x²')
                .replace(/-x(?!²)/g, '-1x')
                .replace(/\+x(?!²)/g, '+1x')
                .replace(/^x(?!²)/, '1x');
            
            // Extract a (coefficient of x²)
            const aMatch = equation.match(/([-+]?\d*\.?\d*)x²/);
            if (aMatch && aMatch[1]) {
                a = aMatch[1] === '-' ? -1 : (aMatch[1] === '' ? 1 : parseFloat(aMatch[1]));
            }
            
            // Extract b (coefficient of x)
            const bMatch = equation.match(/(?<!x)([-+]?\d*\.?\d*)x(?!²)/);
            if (bMatch && bMatch[1]) {
                b = bMatch[1] === '-' ? -1 : (bMatch[1] === '+' || bMatch[1] === '' ? 1 : parseFloat(bMatch[1]));
            }
            
            // Extract c (constant term)
            let cTerms = equation.match(/(?<!x)([-+]?\d+\.?\d*)(?!x)/g);
            if (cTerms) {
                c = cTerms.reduce((sum, term) => sum + parseFloat(term), 0);
            }
            
            // Validate coefficients
            if (isNaN(a) || isNaN(b) || isNaN(c)) {
                throw new Error('Invalid coefficients found in the equation');
            }
            
            if (a === 0) {
                throw new Error('This is not a quadratic equation (coefficient of x² is 0)');
            }
            
            // Calculate discriminant
            const discriminant = b * b - 4 * a * c;
            
            if (discriminant < 0) {
                throw new Error('This equation has no real solutions (discriminant < 0)');
            }
            
            // Calculate solutions
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            
            return {
                steps: [
                    `Original equation: ${problem}`,
                    `Standard form: ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
                    `Using quadratic formula: x = (-b ± √(b² - 4ac)) / 2a`,
                    `a = ${a}, b = ${b}, c = ${c}`,
                    `Discriminant = b² - 4ac = (${b})² - 4(${a})(${c}) = ${discriminant}`,
                    `x₁ = (-${b} + √${discriminant}) / (2 × ${a}) = ${x1.toFixed(4)}`,
                    `x₂ = (-${b} - √${discriminant}) / (2 × ${a}) = ${x2.toFixed(4)}`
                ],
                result: `x = ${x1.toFixed(4)} or x = ${x2.toFixed(4)}`,
                type: 'quadratic'
            };
        }

        solveBasic(problem) {
            const result = this.safeEval(problem);
            return {
                steps: [
                    `Expression: ${problem}`,
                    `Result: ${result}`
                ],
                result: result,
                type: 'basic'
            };
        }

        safeEval(expr) {
            // Basic safety checks
            if (expr.includes('function') || expr.includes(';')) {
                throw new Error('Invalid expression');
            }
            
            try {
                return Function('"use strict";return (' + expr + ')')();
            } catch (e) {
                throw new Error('Invalid expression');
            }
        }

        getCoefficient(expr) {
            const match = expr.match(/-?\d*x/);
            if (!match) return 1;
            const coeff = match[0].replace('x', '');
            return coeff === '-' ? -1 : coeff === '' ? 1 : Number(coeff);
        }

        getConstant(expr) {
            return Number(expr);
        }
    }

    function createInterface() {
        const container = document.createElement('div');
        container.className = 'mathgpt-container';
        container.innerHTML = `
            <div class="mathgpt-header">
                <div class="mathgpt-title">MathGPT Solver</div>
            </div>
            <textarea class="mathgpt-input" placeholder="Enter your math problem here...
Examples:
- 2 + 2
- 3x = 9
- x² + 5x + 6 = 0
- 2x² - 7x + 3 = 0"></textarea>
            <button class="mathgpt-button" id="solve-button">Solve</button>
            <div class="mathgpt-solution" id="solution-area"></div>
        `;

        document.body.appendChild(container);

        const solver = new MathSolver();
        const button = container.querySelector('#solve-button');
        const input = container.querySelector('.mathgpt-input');
        const solutionArea = container.querySelector('#solution-area');

        button.addEventListener('click', () => {
            const problem = input.value;
            if (!problem) return;

            try {
                const solution = solver.solve(problem);
                solutionArea.style.display = 'block';
                solutionArea.innerHTML = `
                    <h3>Solution:</h3>
                    ${solution.steps.map(step => `
                        <div class="mathgpt-step">${step}</div>
                    `).join('')}
                    <div class="mathgpt-step">
                        <strong>Final Answer:</strong> ${solution.result}
                    </div>
                `;
            } catch (error) {
                solutionArea.style.display = 'block';
                solutionArea.innerHTML = `
                    <div class="mathgpt-error">
                        ${error.message}
                    </div>
                `;
            }
        });

        // Allow Enter key to trigger solve
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                button.click();
            }
        });
    }

    // Initialize when page loads
    if (window.location.hostname.includes('mathspace.co')) {
        createInterface();
    }
})();

