// ==UserScript==
// @name         💯BigIdeasMath Automatic answer
// @namespace    https://prysaic.com/
// @version      1.3.1
// @description  Automatically display answers for BigIdeas Math homework using MathJax for math rendering (homework only, not tests)
// @author       Prysaic
// @match        https://*.bigideasmath.com/BIM/student/*
// @icon         https://prysaic.com/wp-content/uploads/2025/04/e69caae591bde5908d-e589afe69cac-e589afe69cac.png
// @grant        none
// @license MIT
// @compatible         firefox
// @compatible         chrome
// @compatible         opera
// @compatible         safari
// @compatible         edge
// @downloadURL https://update.greasyfork.org/scripts/532053/%F0%9F%92%AFBigIdeasMath%20Automatic%20answer.user.js
// @updateURL https://update.greasyfork.org/scripts/532053/%F0%9F%92%AFBigIdeasMath%20Automatic%20answer.meta.js
// ==/UserScript==

  // ===========================================================================================================================================================================
  //           _____                    _____                _____                    _____                    _____                    _____                    _____
  //          /\    \                  /\    \              |\    \                  /\    \                  /\    \                  /\    \                  /\    \
  //         /::\    \                /::\    \             |:\____\                /::\    \                /::\    \                /::\    \                /::\    \
  //        /::::\    \              /::::\    \            |::|   |               /::::\    \              /::::\    \               \:::\    \              /::::\    \
  //       /::::::\    \            /::::::\    \           |::|   |              /::::::\    \            /::::::\    \               \:::\    \            /::::::\    \
  //      /:::/\:::\    \          /:::/\:::\    \          |::|   |             /:::/\:::\    \          /:::/\:::\    \               \:::\    \          /:::/\:::\    \
  //     /:::/__\:::\    \        /:::/__\:::\    \         |::|   |            /:::/__\:::\    \        /:::/__\:::\    \               \:::\    \        /:::/  \:::\    \
  //    /::::\   \:::\    \      /::::\   \:::\    \        |::|   |            \:::\   \:::\    \      /::::\   \:::\    \              /::::\    \      /:::/    \:::\    \
  //   /::::::\   \:::\    \    /::::::\   \:::\    \       |::|___|______    ___\:::\   \:::\    \    /::::::\   \:::\    \    ____    /::::::\    \    /:::/    / \:::\    \
  //  /:::/\:::\   \:::\____\  /:::/\:::\   \:::\____\      /::::::::\    \  /\   \:::\   \:::\    \  /:::/\:::\   \:::\    \  /\   \  /:::/\:::\    \  /:::/    /   \:::\    \
  // /:::/  \:::\   \:::|    |/:::/  \:::\   \:::|    |    /::::::::::\____\/::\   \:::\   \:::\____\/:::/  \:::\   \:::\____\/::\   \/:::/  \:::\____\/:::/____/     \:::\____\
  // \::/    \:::\  /:::|____|\::/   |::::\  /:::|____|   /:::/~~~~/~~      \:::\   \:::\   \::/    /\::/    \:::\  /:::/    /\:::\  /:::/    \::/    /\:::\    \      \::/    /
  //  \/_____/\:::\/:::/    /  \/____|:::::\/:::/    /   /:::/    /          \:::\   \:::\   \/____/  \/____/ \:::\/:::/    /  \:::\/:::/    / \/____/  \:::\    \      \/____/
  //           \::::::/    /         |:::::::::/    /   /:::/    /            \:::\   \:::\    \               \::::::/    /    \::::::/    /            \:::\    \
  //            \::::/    /          |::|\::::/    /   /:::/    /              \:::\   \:::\____\               \::::/    /      \::::/____/              \:::\    \
  //             \::/____/           |::| \::/____/    \::/    /                \:::\  /:::/    /               /:::/    /        \:::\    \               \:::\    \
  //              ~~                 |::|  ~|           \/____/                  \:::\/:::/    /               /:::/    /          \:::\    \               \:::\    \
  //                                 |::|   |                                     \::::::/    /               /:::/    /            \:::\    \               \:::\    \
  //                                 \::|   |                                      \::::/    /               /:::/    /              \:::\____\               \:::\____\
  //                                  \:|   |                                       \::/    /                \::/    /                \::/    /                \::/    /
  //                                   \|___|                                        \/____/                  \/____/                  \/____/                  \/____/
  // ===========================================================================================================================================================================

  // ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————-—————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

  // >Support email: Prysaic@gmail.com 【For support with more website adaptations and other features, please contact us via email】

  // This Plugin ("Plugin") is provided "as is" and "with all faults" without any warranty, express or implied, including, without limitation, any warranties of merchantability, fitness for a particular purpose, non-infringement, or that the use of the Plugin will be uninterrupted or error-free. By using this Plugin, you expressly acknowledge and agree that:

  // 1. Use of the Plugin is entirely at your own risk. You assume full responsibility for any and all losses, damages, or adverse consequences, whether direct, indirect, incidental, special, consequential, or punitive, that may result from your use or inability to use the Plugin, including, without limitation, any loss of data, loss of profits, or any other damages or losses.

  // 2. The developer, its affiliates, licensors, or any other parties involved in the creation, development, distribution, or maintenance of the Plugin shall not be liable for any claims, demands, actions, or causes of action, including without limitation, damages for loss of use, data, or profits, arising out of or in connection with your use of or reliance on the Plugin, even if advised of the possibility of such damages.

  // 3. The Plugin is provided solely for personal, non-commercial use for learning and assistance purposes. You agree that you will not use the Plugin for any illegal, unauthorized, or unethical purposes and that you are solely responsible for ensuring compliance with all applicable laws and regulations in your jurisdiction.

  // 4. Any reliance on the information provided by the Plugin is at your own risk. The Plugin is intended solely as an aid for educational purposes and does not guarantee any specific outcomes, accuracy, or completeness of the content generated. The developer makes no representations or warranties regarding the reliability, accuracy, or timeliness of the information or results obtained through the use of the Plugin.

  // 5. By installing, accessing, or using the Plugin, you agree to indemnify, defend, and hold harmless the developer and its affiliates from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from your use of the Plugin or any violation of these terms.

  // 6. In no event shall the developer, its affiliates, or any other parties involved be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, revenue, data, or use, incurred by you or any third party, whether in an action in contract, tort (including negligence), or otherwise, arising from your access to, use of, or inability to use the Plugin, even if advised of the possibility of such damages.

  // 7. This disclaimer is intended to limit the liability of the developer to the fullest extent permitted by applicable law. Some jurisdictions do not allow the exclusion or limitation of liability for incidental or consequential damages, so the above limitations may not apply to you.

  // By installing, accessing, or using the Plugin, you acknowledge that you have read, understood, and agree to be bound by the terms of this disclaimer. If you do not agree with any part of this disclaimer, you must not use the Plugin.



(function() {
    const CSS = `
        <style>
            .answer-planet {
                transition: transform 0.2s ease;
                cursor: copy;
                position: relative;
            }
            @keyframes gentleAppear {
                0% { opacity:0; transform:translateY(8px) scale(0.98); }
                100% { opacity:1; transform:none; }
            }
            .prysaic-universe {
                position:fixed;
                top:80px;
                right:40px;
                padding:1.8rem;
                border-radius:22px;
                backdrop-filter:blur(40px) saturate(200%);
                background:rgba(251,251,253,0.92);
                border:1px solid rgba(255,255,255,0.5);
                box-shadow:0 24px 64px rgba(0,0,0,0.12),
                          inset 0 1px 2px rgba(255,255,255,0.3);
                max-width:480px;
                min-width:340px;
                color:#1d1d1f;
                z-index:2147483647;
                transition:all 0.48s cubic-bezier(0.32, 0.72, 0.38, 1.02);
            }
            .answer-galaxy {
                display:grid;
                gap:1.6rem;
            }
            .answer-planet {
                position:relative;
                padding:1.6rem;
                background:rgba(255,255,255,0.28);
                border-radius:16px;
                backdrop-filter:blur(16px);
                box-shadow:0 6px 16px -4px rgba(0,0,0,0.06);
                animation:gentleAppear 0.72s var(--delay) cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
                opacity:0;
            }
            .cosmic-divider {
                height:1.2px;
                background:linear-gradient(90deg,transparent 12%,rgba(0,0,0,0.08) 50%,transparent 88%);
                margin:0 1.6rem;
                opacity:0.6;
            }
            .prysaic-universe[hidden] {
                opacity:0;
                transform:translateY(-20px) scale(0.98);
                pointer-events:none;
            }
        </style>
    `;

    let universe;

    function bigBang() {
        const existing = document.getElementById('prysaic-universe');
        if (existing) existing.remove();

        document.head.insertAdjacentHTML('beforeend', CSS);

        universe = document.createElement('div');
        universe.id = 'prysaic-universe';
        universe.className = 'prysaic-universe';
        universe.innerHTML = '<div class="answer-galaxy"></div>';

        universe.ondblclick = () => universe.hidden = !universe.hidden;
        universe.hidden = false;

        document.body.appendChild(universe);
    }

    function supernovaRender(answers) {
        const galaxy = universe.querySelector('.answer-galaxy');
        const newGalaxy = document.createElement('div');
        newGalaxy.className = 'answer-galaxy';

        answers.forEach((answer, index) => {
            const planet = document.createElement('div');
            planet.className = 'answer-planet';
            planet.style.setProperty('--delay', `${index * 0.07}s`);

            // 存储原始LaTeX并渲染数学公式
            const rawLatex = answer.replace(/\\\[|\\\]/g, '');
            planet.dataset.latex = rawLatex;
            planet.innerHTML = `\\[${rawLatex}\\]`;

            // 点击复制功能
            planet.addEventListener('click', function(event) {
                navigator.clipboard.writeText(this.dataset.latex)
                    .then(() => {
                        this.style.transform = 'scale(0.98)';
                        setTimeout(() => {
                            this.style.transform = '';
                        }, 180);
                    })
                    .catch(err => {
                        console.error('复制失败:', err);
                    });
            });

            if (index < answers.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'cosmic-divider';
                newGalaxy.appendChild(divider);
            }

            newGalaxy.appendChild(planet);
        });

        galaxy.parentNode.replaceChild(newGalaxy, galaxy);
        if (window.MathJax?.typesetPromise) {
            MathJax.typesetPromise([newGalaxy]);
        }
    }

    function quantumFlatten(response) {
        const collapseWave = (arr, singularity = []) => {
            arr.forEach(particle => {
                Array.isArray(particle) ?
                    collapseWave(particle, singularity) :
                particle?.value ?
                    singularity.push(particle.value) :
                    singularity.push(particle)
            });
            return singularity;
        };
        return collapseWave(response);
    }

    function darkMatterProcessor(rawData) {
        return quantumFlatten(rawData).map(str => {
            str = String(str).trim()
                .replace(/&nbsp;/g, ' ')
                .replace(/\\left\(/g, '(')
                .replace(/\\right\)/g, ')')
                .replace(/\$begin:math:display\$|\$end:math:display\$/g, '');
            return /\\[a-zA-Z]/.test(str) ? `\\[${str}\\]` : str;
        }).join(' ');
    }

    function eventHorizon() {
        try {
            const answers = LearnosityAssess.getCurrentItem()
                .response_ids.map(id =>
                    darkMatterProcessor(
                        LearnosityAssess.getQuestions()[id]
                            .validation.valid_response.value
                    )
                ).filter(Boolean);
            supernovaRender(answers);
        } catch(e) {}
    }

    function temporalObserver() {
        let lastQuantumState;
        setInterval(() => {
            try {
                const currentState = LearnosityAssess.getCurrentItem().response_ids[0];
                if (currentState !== lastQuantumState) {
                    lastQuantumState = currentState;
                    eventHorizon();
                }
            } catch {}
        }, 920);
    }

    function singularityInit() {
        bigBang();
        temporalObserver();
        eventHorizon();
        const mathScript = document.createElement('script');
        mathScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        document.head.appendChild(mathScript);
    }

    window.addEventListener('load', singularityInit);
})();