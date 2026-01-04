// ==UserScript==
// @name         Brain.js Text Generator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simple text generation using brain.js LSTM
// @match        https://pastebin.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/518398/Brainjs%20Text%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/518398/Brainjs%20Text%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/brain.js@2.0.0-beta.24/dist/browser.min.js";
    document.head.appendChild(script);

    script.onload = function() {
        class TextGenerator {
            constructor() {
                this.net = new brain.recurrent.LSTM({
                    hiddenLayers: [20],
                    maxPredictionLength: 100
                });
                this.stats = {
                    examples: 0,
                    vocab: new Set(),
                    tokens: 0
                };
            }

            preprocessText(text) {
                return text.toLowerCase()
                    .replace(/[^\w\s]/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
            }

            train(jsonData) {
                console.log("Processing training data...");

                // Create training pairs
                const trainingData = jsonData.map(item => {
                    const input = this.preprocessText(`${item.instruction} ${item.input || ''}`);
                    const output = this.preprocessText(item.output);

                    // Update stats
                    input.split(' ').forEach(word => this.stats.vocab.add(word));
                    output.split(' ').forEach(word => this.stats.vocab.add(word));
                    this.stats.tokens += input.split(' ').length + output.split(' ').length;

                    return {
                        input,
                        output
                    };
                });

                this.stats.examples = trainingData.length;

                console.log(`Training Statistics:
                    Examples: ${this.stats.examples}
                    Vocabulary Size: ${this.stats.vocab.size}
                    Total Tokens: ${this.stats.tokens}
                `);

                // Train the network
                console.log("Starting training...");
                this.net.train(trainingData, {
                    iterations: 20,
                    errorThresh: 0.025,
                    learningRate: 0.005,
                    logPeriod: 1,
                    log: (details) => {
                        if(details && typeof details.iterations !== 'undefined') {
                            console.log(`Iteration: ${details.iterations}, Error: ${details.error}`);
                        }
                    }
                });

                console.log("Training completed!");
            }

            generate(prompt) {
                try {
                    const processed = this.preprocessText(prompt);
                    return this.net.run(processed);
                } catch (error) {
                    console.error("Generation error:", error);
                    return "Error generating text";
                }
            }

            save() {
                return {
                    model: this.net.toJSON(),
                    stats: this.stats
                };
            }

            load(data) {
                this.net.fromJSON(data.model);
                this.stats = data.stats;
            }
        }

        const generator = new TextGenerator();

        async function trainHandler() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = async e => {
                const file = e.target.files[0];
                console.log(`Loading ${(file.size/1024/1024).toFixed(2)}MB file...`);

                try {
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                        const data = JSON.parse(event.target.result);
                        console.log(`Loaded ${data.length} examples`);

                        generator.train(data);
                        GM_setValue('model', generator.save());
                        alert('Training completed and model saved!');
                    };
                    reader.readAsText(file);
                } catch(error) {
                    console.error('Training error:', error);
                    alert('Error during training: ' + error.message);
                }
            };

            input.click();
        }

        function generateHandler() {
            try {
                const savedModel = GM_getValue('model');
                if (!savedModel) {
                    alert('Please train model first!');
                    return;
                }

                generator.load(savedModel);
                const prompt = window.prompt('Enter prompt:');
                if (prompt) {
                    console.log('Input:', prompt);
                    const generated = generator.generate(prompt);
                    console.log('Generated:', generated);
                    alert(generated);
                }
            } catch(error) {
                console.error('Generation error:', error);
                alert('Error generating text: ' + error.message);
            }
        }

        GM_registerMenuCommand('🧠 Train Model', trainHandler);
        GM_registerMenuCommand('💭 Generate', generateHandler);
    };
})();