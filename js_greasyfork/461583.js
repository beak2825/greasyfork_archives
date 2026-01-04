// ==UserScript==
// @name         Solver - Letters with red lines
// @namespace    satology.solver.letter.with.red.lines
// @version      0.15
// @description  Custom text captcha solver
// @author       satology
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/rgbquant@1.1.2/src/rgbquant.js
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461583/Solver%20-%20Letters%20with%20red%20lines.user.js
// @updateURL https://update.greasyfork.org/scripts/461583/Solver%20-%20Letters%20with%20red%20lines.meta.js
// ==/UserScript==


(function() {
    /*
    * @v0.15: Adjusted to try to solve despite the colors used (except when using same color for letters and lines)
    * Letter 'j' is not recognized
    */


    /*
    * CBL-js
    * CAPTCHA Breaking Library in JavaScript
    * https://github.com/skotz/cbl-js
    * Copyright (c) 2015-2021 Scott Clayton
    */

    var CBL = function (options) {

        var defaults = {
            preprocess: function() { warn("You should define a preprocess method!"); },
            model_file: "",
            model_string: "",
            model_loaded: function() { },
            training_complete: function() { },
            blob_min_pixels: 1,
            blob_max_pixels: 99999,
            blob_min_width: 1,
            blob_min_height: 1,
            blob_max_width: 99999,
            blob_max_height: 99999,
            pattern_width: 20,
            pattern_height: 20,
            pattern_maintain_ratio: false,
            pattern_auto_rotate: false,
            incorrect_segment_char: "\\",
            blob_debug: "",
            blob_console_debug: false,
            allow_console_log: false,
            allow_console_warn: true,
            perceptive_colorspace: false,
            character_set: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            fixed_blob_locations: [ ], // Expected format: [ { x1: 0, y1: 0, x2: 0, y2: 0 }, ... ]
            exact_characters: -1,
            exact_characters_width: -1, // Used to guess how many characters there are in a large blob
            exact_characters_play: -1 // Used to find a good vertical split point when splitting by an exact number of characters
        };

        options = options || {};
        for (var opt in defaults) {
            if (defaults.hasOwnProperty(opt) && !options.hasOwnProperty(opt)) {
                options[opt] = defaults[opt];
            }
        }

        var obj = {

            /***********************************************\
        | General Methods                               |
        \***********************************************/

            // Load an image and attempt to solve it based on trained model
            solve : function (el) {
                return obj.train(el, true);
            },

            done : function (resultHandler) {
                addQueue(function () {
                    resultHandler(doneResult);
                    runQueue();
                });
            },

            // Load an image and attempt to solve it based on trained model
            train : function (el, solving) {
                if (typeof solving === 'undefined') {
                    solving = false;
                }
                addQueue(function() {
                    var image;
                    var needSetSrc = false;
                    if (document.getElementById(el) != null) {
                        image = document.getElementById(el);
                    } else if (document.querySelector(el)) {
                        image = document.querySelector(el);
                    } else {
                        image = document.createElement("img");
                        needSetSrc = true;
                    }
                    var afterLoad = function() {
                        var solution = "";
                        var canvas = document.createElement('canvas');
                        canvas.width = image.width;
                        canvas.height = image.height;
                        canvas.getContext('2d', {willReadFrequently: true}).drawImage(image, 0, 0);

                        // Run user-specified image preprocessing
                        var cblImage = new cbl_image(canvas);
                        options.preprocess(cblImage);

                        // Run segmentation
                        var blobs;
                        if (options.fixed_blob_locations.length > 0) {
                            blobs = cblImage.segmentBlocks(options.pattern_width,
                                                           options.pattern_height,
                                                           options.fixed_blob_locations,
                                                           options.blob_debug);
                        } else {
                            blobs = cblImage.segmentBlobs(options.blob_min_pixels,
                                                          options.blob_max_pixels,
                                                          options.pattern_width,
                                                          options.pattern_height,
                                                          options.blob_debug);
                        }

                        // FOR TRAINING
                        // Set up a list of patterns for a human to classify
                        if (!solving) {
                            for (var i = 0; i < blobs.length; i++) {
                                var imgUrl = blobs[i].toDataURL();
                                var blobPattern = blobToPattern(blobs[i]);
                                pendingPatterns.push({
                                    imgSrc: imgUrl,
                                    pattern: blobPattern,
                                    imgId: patternElementID,
                                    txtId: humanSolutionElementID,
                                    self: obj,
                                    onComplete: options.training_complete
                                });
                            }

                            // Load first pattern
                            if (!currentlyTraining) {
                                obj.loadNextPattern();
                            }
                            currentlyTraining = true;
                        }

                        // FOR SOLVING
                        // Solve an image buy comparing each blob against our model of learned patterns
                        else {
                            for (var i = 0; i < blobs.length; i++) {
                                solution += findBestMatch(blobToPattern(blobs[i]));
                            }
                            log("Solution = " + solution);
                        }

                        doneResult = solution;
                        runQueue();
                    };
                    if (image.complete && !needSetSrc) {
                        afterLoad();
                    }
                    else {
                        image.onload = afterLoad;

                        // Set the source AFTER setting the onload
                        if (needSetSrc) {
                            image.src = el;
                        }
                    }
                });
                return this;
            },

            // Load the next pattern pending human classification
            loadNextPattern: function() {
                var nextPattern = pendingPatterns.pop();
                if (nextPattern) {
                    log("Loading a pattern for human classification.");
                    openClassifierDialog();
                    document.getElementById(nextPattern.imgId).src = nextPattern.imgSrc;
                    document.getElementById(nextPattern.txtId).focus();
                    document.getElementById(nextPattern.txtId).onkeyup = function(event) {
                        var typedLetter = document.getElementById(nextPattern.txtId).value;
                        if ((options.character_set.indexOf(typedLetter) > -1 && typedLetter.length) || typedLetter == options.incorrect_segment_char) {
                            if (typedLetter != options.incorrect_segment_char) {
                                model.push({
                                    pattern: nextPattern.pattern,
                                    solution: document.getElementById(nextPattern.txtId).value
                                });
                                log("Added \"" + document.getElementById(nextPattern.txtId).value + "\" pattern to model!");
                            } else {
                                log("Did not add bad segment to model.");
                            }
                            document.getElementById(nextPattern.txtId).value = "";

                            // Load the next pattern
                            if (pendingPatterns.length) {
                                nextPattern.self.loadNextPattern();
                            }
                            else {
                                currentlyTraining = false;
                                document.getElementById(nextPattern.txtId).onkeyup = function () { };
                                if (typeof nextPattern.onComplete === 'function') {
                                    nextPattern.onComplete();
                                    closeClassifierDialog();
                                }
                            }
                        }
                        else {
                            document.getElementById(nextPattern.txtId).value = "";
                        }
                    };
                }
            },

            // Load a model by deserializing a model string
            loadModelString: function (modelString) {
                modelString = LZString.decompressFromBase64(modelString);
                model = new Array();
                var patterns = modelString.replace(/\[/g, "").split("]");
                for (var i = 0; i < patterns.length; i++) {
                    var parts = patterns[i].split("=");
                    if (parts.length == 2) {
                        var p = parts[1];
                        var s = parts[0];
                        model.push({
                            pattern: p,
                            solution: s
                        });
                    }
                }
                if (!model.length) {
                    warn("No patterns to load in provided model.");
                }
                else {
                    log("Model loaded with " + model.length + " patterns!");
                    options.model_loaded();
                }
            },

            // Load a model from a file on the server
            loadModel: function (url) {
                try {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url, true);
                    xhr.send();
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
                            obj.loadModelString(xhr.responseText);
                        }
                    }
                }
                catch (err) {
                    warn("Could not load model from \"" + url + "\"! (" + err.message + ")");
                }
            },

            // Serialize the model
            serializeModel: function () {
                var str = "";
                for (var i = 0; i < model.length; i++) {
                    str += "[" + model[i].solution + "=" + model[i].pattern + "]";
                }
                str = LZString.compressToBase64(str);
                return str;
            },

            // Save the model to a file
            saveModel: function () {
                var str = obj.serializeModel();
                var anchor = document.createElement('a');
                anchor.href = "data:application/octet-stream," + encodeURIComponent(str);
                anchor.setAttribute('download', 'cbl-model.dat');
                anchor.click();
            },

            // Debug stuff about the model
            debugModel: function () {
                for (var i = 0; i < model.length; i++) {
                    log(model[i].solution + " pattern length = " + model[i].pattern.split(".").length);
                }
            },

            // Sort the model by pattern solution alphabetically
            sortModel: function() {
                model = model.sort(function(a, b) { return a.solution.localeCompare(b.solution); });
            },

            // Output the model as images to an element for debugging
            visualizeModel: function (elementId) {
                for (var m = 0; m < model.length; m++) {
                    var pattern = document.createElement('canvas');
                    pattern.width = options.pattern_width;
                    pattern.height = options.pattern_height;
                    var pctx = pattern.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, options.pattern_width, options.pattern_height);

                    var patternValues = model[m].pattern.split('.');

                    for (var x = 0; x < options.pattern_width; x++) {
                        for (var y = 0; y < options.pattern_height; y++) {
                            var i = x * 4 + y * 4 * options.pattern_width;
                            var p = y + x * options.pattern_width;
                            pctx.data[i] = patternValues[p];
                            pctx.data[i + 1] = patternValues[p];
                            pctx.data[i + 2] = patternValues[p];
                            pctx.data[i + 3] = 255;
                        }
                    }

                    pattern.getContext('2d', {willReadFrequently: true}).putImageData(pctx, 0, 0);

                    var test = document.createElement("img");
                    test.src = pattern.toDataURL();
                    document.getElementById(elementId).appendChild(test);
                }
            },

            // Condense the model by combining patterns with the same solution
            condenseModel: function () {
                var newModel = new Array();
                var oldCount = model.length;
                for (var i = 0; i < model.length; i++) {
                    var patternArray = model[i].pattern.split(".");
                    var found = false;
                    for (var j = 0; j < newModel.length; j++) {
                        // These two patterns have the same solution, so combine the patterns
                        if (newModel[j].solution == model[i].solution) {
                            for (var x = 0; x < newModel[j].tempArray.length; x++) {
                                newModel[j].tempArray[x] = parseInt(newModel[j].tempArray[x]) + parseInt(patternArray[x]);
                            }
                            newModel[j].tempCount++;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        newModel.push({
                            pattern: model[i].pattern,
                            solution: model[i].solution,
                            tempArray: patternArray,
                            tempCount: 1
                        });
                    }
                }
                // Normalize the patterns
                for (var i = 0; i < newModel.length; i++) {
                    for (var x = 0; x < newModel[i].tempArray.length; x++) {
                        newModel[i].tempArray[x] = Math.round(newModel[i].tempArray[x] / newModel[i].tempCount);
                    }
                    newModel[i].pattern = newModel[i].tempArray.join(".");
                }
                model = newModel;
                log("Condensed model from " + oldCount + " patterns to " + model.length + " patterns!");
                return this;
            }
        };

        var cbl_image = function (canvas) {
            var obj = {
                /***********************************************\
            | Image Manipulation Methods                    |
            \***********************************************/

                // Fills each distinct region in the image with a different random color
                colorRegions: function (tolerance, ignoreWhite, pixelJump) {
                    if (typeof ignoreWhite === 'undefined') {
                        ignoreWhite = false;
                    }
                    if (typeof pixelJump === 'undefined') {
                        pixelJump = 0;
                    }
                    var exclusions = new Array();
                    var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                    for (var x = 0; x < image.width; x++) {
                        for (var y = 0; y < image.height; y++) {
                            var i = x * 4 + y * 4 * image.width;
                            if (!arrayContains(exclusions, i)) {
                                obj.floodfill(x, y, getRandomColor(), tolerance, image, exclusions, ignoreWhite, pixelJump);
                            }
                        }
                    }
                    canvas.getContext('2d', {willReadFrequently: true}).putImageData(image, 0, 0);
                    return this;
                },

                // Display an image in an image tag
                display: function (el) {
                    document.getElementById(el).src = canvas.toDataURL();
                    return this;
                },

                // Displays the canvas as an image in another element
                debugImage: function (debugElement) {
                    var test = document.createElement("img");
                    test.src = canvas.toDataURL();
                    document.getElementById(debugElement).appendChild(test);
                    return this;
                },

                // Flood fill a given color into a region starting at a certain point
                floodfill: function (x, y, fillcolor, tolerance, image, exclusions, ignoreWhite, pixelJump) {
                    var internalImage = false;
                    if (typeof image === 'undefined') {
                        internalImage = true;
                        image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                    }
                    if (typeof pixelJump === 'undefined') {
                        pixelJump = 0;
                    }
                    var data = image.data;
                    var length = data.length;
                    var Q = [];
                    var i = (x + y * image.width) * 4;
                    var e = i, w = i, me, mw, w2 = image.width * 4;
                    var targetcolor = [data[i], data[i + 1], data[i + 2], data[i + 3]];
                    var targettotal = data[i] + data[i + 1] + data[i + 2] + data[i + 3];

                    if (!pixelCompare(i, targetcolor, targettotal, fillcolor, data, length, tolerance)) {
                        return false;
                    }
                    Q.push(i);
                    while (Q.length) {
                        i = Q.pop();
                        if (typeof exclusions !== 'undefined') {
                            if (arrayContains(exclusions, i)) {
                                continue;
                            }
                        }
                        if (pixelCompareAndSet(i, targetcolor, targettotal, fillcolor, data, length, tolerance, exclusions, ignoreWhite)) {
                            e = i;
                            w = i;
                            mw = (i / w2) * w2;
                            me = mw + w2;

                            while (mw < (w -= 4) && pixelCompareAndSet(w, targetcolor, targettotal, fillcolor, data, length, tolerance, exclusions, ignoreWhite));
                            while (me > (e += 4) && pixelCompareAndSet(e, targetcolor, targettotal, fillcolor, data, length, tolerance, exclusions, ignoreWhite));

                            if (pixelJump > 0) {
                                // Skip over a certain number of pixels that don't match
                                w -= pixelJump * 4;
                                e += pixelJump * 4;
                            }

                            for (var j = w; j < e; j += 4) {
                                if (j - w2 >= 0 && pixelCompare(j - w2, targetcolor, targettotal, fillcolor, data, length, tolerance)) {
                                    Q.push(j - w2);
                                }
                                if (j + w2 < length && pixelCompare(j + w2, targetcolor, targettotal, fillcolor, data, length, tolerance)) {
                                    Q.push(j + w2);
                                }
                            }
                        }
                    }
                    if (internalImage) {
                        canvas.getContext('2d', {willReadFrequently: true}).putImageData(image, 0, 0);
                    }
                },

                // Blur the image (box blur)
                blur : function (level) {
                    if (typeof level === 'undefined') {
                        level = 1;
                    }

                    if (level == 2) {
                        return this.convolute([ [1, 1, 1, 1, 1],
                                               [1, 1, 1, 1, 1],
                                               [1, 1, 1, 1, 1],
                                               [1, 1, 1, 1, 1],
                                               [1, 1, 1, 1, 1] ], 1.0/25);
                    }
                    else if (level == 3) {
                        return this.convolute([ [1, 1, 1, 1, 1, 1, 1],
                                               [1, 1, 1, 1, 1, 1, 1],
                                               [1, 1, 1, 1, 1, 1, 1],
                                               [1, 1, 1, 1, 1, 1, 1],
                                               [1, 1, 1, 1, 1, 1, 1],
                                               [1, 1, 1, 1, 1, 1, 1],
                                               [1, 1, 1, 1, 1, 1, 1] ], 1.0/49);
                    }
                    else {
                        return this.convolute([ [1, 1, 1],
                                               [1, 1, 1],
                                               [1, 1, 1] ], 1.0/9);
                    }
                },

                // Sharpen
                sharpen : function () {
                    return this.convolute([ [ 0, -1,  0],
                                           [-1,  5, -1],
                                           [ 0, -1,  0] ]);
                },

                // Convert the image to grayscale
                grayscale : function () {
                    var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                    for (var x = 0; x < image.width; x++) {
                        for (var y = 0; y < image.height; y++) {
                            var i = x * 4 + y * 4 * image.width;
                            var brightness = 0.34 * image.data[i] + 0.5 * image.data[i + 1] + 0.16 * image.data[i + 2];
                            image.data[i] = brightness;
                            image.data[i + 1] = brightness;
                            image.data[i + 2] = brightness;
                            image.data[i + 3] = 255;
                        }
                    }
                    canvas.getContext('2d', {willReadFrequently: true}).putImageData(image, 0, 0);
                    return this;
                },

                // Change all semi-gray colors to white
                removeGray : function (tolerance) {
                    var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                    for (var x = 0; x < image.width; x++) {
                        for (var y = 0; y < image.height; y++) {
                            var i = x * 4 + y * 4 * image.width;
                            var diff = Math.max(Math.abs(image.data[i] - image.data[i + 1]),
                                                Math.abs(image.data[i + 1] - image.data[i + 2]),
                                                Math.abs(image.data[i + 2] - image.data[i]));
                            if (diff < tolerance) {
                                image.data[i] = 255;
                                image.data[i + 1] = 255;
                                image.data[i + 2] = 255;
                                image.data[i + 3] = 255;
                            }
                        }
                    }
                    canvas.getContext('2d', {willReadFrequently: true}).putImageData(image, 0, 0);
                    return this;
                },

                // Change all colors above a certain brightness to white
                removeLight : function (brightness) {
                    var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                    for (var x = 0; x < image.width; x++) {
                        for (var y = 0; y < image.height; y++) {
                            var i = x * 4 + y * 4 * image.width;
                            var diff = Math.max(image.data[i], image.data[i + 1], image.data[i + 2]);
                            if (diff > brightness) {
                                image.data[i] = 255;
                                image.data[i + 1] = 255;
                                image.data[i + 2] = 255;
                                image.data[i + 3] = 255;
                            }
                        }
                    }
                    canvas.getContext('2d', {willReadFrequently: true}).putImageData(image, 0, 0);
                    return this;
                },

            changePalette: function () {
                var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                var opts = {
                    colors: 3,
                    method: 1,
                    boxSize: [64,64],
                    boxPxls: 2,
                    initColors: 4096,
                    minHueCols: 0,
                    dithKern: null,
                    dithDelta: 0,
                    dithSerp: false,
                    palette: [],
                    reIndex: false,
                    useCache: true,
                    cacheFreq: 10,
                    colorDist: "euclidean",
                };

                var q = new RgbQuant(opts);

                q.sample(image);
                var pal = q.palette(false, true);
                console.log(pal);
                var outA = q.reduce(image);
                console.log(outA);

                let aPos =[outA.length, 0], bPos =[outA.length, 0], cPos =[outA.length, 0];

                for (var x = 0; x < outA.length; x += 4) {
                    let pxR, pxG, pxB, pxA;
                    let newR, newG, newB, newA;
                    pxR = outA[x];
                    pxG = outA[x + 1];
                    pxB = outA[x + 2];
                    pxA = outA[x + 3];
                    if (pxR == pal[0] &&
                        pxG == pal[1] &&
                        pxB == pal[2] &&
                        pxA == pal[3]) {
                        if (x < aPos[0]) aPos[0] = x;
                        if (x > aPos[1]) aPos[1] = x;
                    } else if (pxR == pal[4] &&
                        pxG == pal[5] &&
                        pxB == pal[6] &&
                        pxA == pal[7]) {
                        if (x < bPos[0]) bPos[0] = x;
                        if (x > bPos[1]) bPos[1] = x;
                    } else {
                        if (x < cPos[0]) cPos[0] = x;
                        if (x > cPos[1]) cPos[1] = x;
                    }
                }

                let letterColors = [pal[0], pal[1], pal[2], pal[3]];
                if (bPos[1] - bPos[0] < aPos[1] - aPos[0]) {
                    letterColors = [pal[4], pal[5], pal[6], pal[7]];
                }
                if (cPos[1] - cPos[0] < bPos[1] - bPos[0]) {
                    letterColors = [pal[8], pal[9], pal[10], pal[11]];
                }

                for (x = 0; x < outA.length; x += 4) {
                    if (outA[x] == letterColors[0] && outA[x + 1] == letterColors[1] &&
                        outA[x + 2] == letterColors[2] && outA[x + 3] == letterColors[3]) {
                            outA[x] = 0;
                            outA[x + 1] = 0;
                            outA[x + 2] = 0;
                            outA[x + 3] = 255;
                    } else {
                        outA[x] = 255;
                        outA[x + 1] = 255;
                        outA[x + 2] = 255;
                        outA[x + 3] = 255;
                    }
                }

                let newImageData = new ImageData(Uint8ClampedArray.from(outA), canvas.width, canvas.height);
                canvas.getContext('2d', {willReadFrequently: true}).putImageData(newImageData, 0, 0);
                return this;
            },

                // Convert the image to black and white given a grayscale threshold
                binarize : function (threshold) {
                    var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                    for (var x = 0; x < image.width; x++) {
                        for (var y = 0; y < image.height; y++) {
                            var i = x * 4 + y * 4 * image.width;
                            var brightness = 0.34 * image.data[i] + 0.5 * image.data[i + 1] + 0.16 * image.data[i + 2];
                            image.data[i] = brightness >= threshold ? 255 : 0;
                            image.data[i + 1] = brightness >= threshold ? 255 : 0;
                            image.data[i + 2] = brightness >= threshold ? 255 : 0;
                            image.data[i + 3] = 255;
                        }
                    }
                    canvas.getContext('2d', {willReadFrequently: true}).putImageData(image, 0, 0);
                    return this;
                },

                // Apply a convolution filter
                convolute : function (matrix, factor) {
                    var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                    var out = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                    var w = matrix[0].length;
                    var h = matrix.length;
                    var half = Math.floor(h / 2);
                    if (typeof factor === 'undefined') {
                        factor = 1;
                    }
                    var bias = 0;

                    for (var y = 0; y < image.height - 1; y++) {
                        for (var x = 0; x < image.width - 1; x++) {
                            var px = x * 4 + y * 4 * image.width;
                            var r = 0;
                            var g = 0;
                            var b = 0;

                            for (var cy = 0; cy < w; cy++) {
                                for (var cx = 0; cx < h; cx++) {
                                    var cpx = ((y + (cy - half)) * image.width + (x + (cx - half))) * 4;
                                    r += image.data[(cpx + image.data.length) % image.data.length] * matrix[cy][cx];
                                    g += image.data[(cpx + 1 + image.data.length) % image.data.length] * matrix[cy][cx];
                                    b += image.data[(cpx + 2 + image.data.length) % image.data.length] * matrix[cy][cx];
                                }
                            }

                            out.data[px + 0] = factor * r + bias;
                            out.data[px + 1] = factor * g + bias;
                            out.data[px + 2] = factor * b + bias;
                            out.data[px + 3] = 255;
                        }
                    }

                    canvas.getContext('2d', {willReadFrequently: true}).putImageData(out, 0, 0);
                    return this;
                },

                // Apply an erosion filter
                erode : function () {
                    return this.convolute([ [-1, -1, -1],
                                           [-1,  8, -1],
                                           [-1, -1, -1] ]);
                },

                // Apply an specific filter to each pixel
                // The filter method should accept and return one parameter that will have three properties: r, g, and b
                // foreach(function (p) { return p; })
                foreach : function (filter) {
                    var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                    for (var x = 0; x < image.width; x++) {
                        for (var y = 0; y < image.height; y++) {
                            var i = x * 4 + y * 4 * image.width;
                            var pixel = { r: image.data[i + 0], g: image.data[i + 1], b: image.data[i + 2] };

                            pixel = filter(pixel);

                            image.data[i + 0] = pixel.r;
                            image.data[i + 1] = pixel.g;
                            image.data[i + 2] = pixel.b;
                            image.data[i + 3] = 255;
                        }
                    }
                    canvas.getContext('2d', {willReadFrequently: true}).putImageData(image, 0, 0);
                    return this;
                },

                // Replace transparent pixels with a solid color
                removeTransparency : function (opacity, color) {
                    if (typeof opacity === 'undefined') {
                        opacity = 128;
                    }
                    if (typeof color === 'undefined') {
                        color = { r: 255, g: 255, b: 255 };
                    }
                    var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                    for (var x = 0; x < image.width; x++) {
                        for (var y = 0; y < image.height; y++) {
                            var i = x * 4 + y * 4 * image.width;
                            if (image.data[i + 3] <= opacity) {
                                image.data[i + 0] = color.r;
                                image.data[i + 1] = color.g;
                                image.data[i + 2] = color.b;
                                image.data[i + 3] = 255;
                            }
                        }
                    }
                    canvas.getContext('2d', {willReadFrequently: true}).putImageData(image, 0, 0);
                    return this;
                },

                // Invert the color of every pixel
                invert : function (filter) {
                    return this.foreach(function (p) {
                        p.r = 255 - p.r;
                        p.g = 255 - p.g;
                        p.b = 255 - p.b;
                        return p;
                    });
                },

                // Crop an image
                cropRelative : function (left, top, right, bottom) {
                    var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(left, top, canvas.width - left - right, canvas.height - top - bottom);
                    canvas.width = canvas.width - left - right;
                    canvas.height = canvas.height - top - bottom;
                    canvas.getContext('2d', {willReadFrequently: true}).putImageData(image, 0, 0);
                    return this;
                },

                // Remove a horizontal line from the image (must span the entire picture width)
                removeHorizontalLine : function (lineWidth, color) {
                    if (typeof color === 'undefined') {
                        color = { r: 0, g: 0, b: 0 };
                    }
                    if (typeof lineWidth === 'undefined') {
                        lineWidth = 1;
                    }
                    var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                    var play = [ 0, -1, 1 ];
                    // Get all the possible line starts
                    var starts = [];
                    for (var y = 0; y < canvas.height; y++) {
                        var pixel = this.getPixel(0, y);
                        if (pixel.r == color.r && pixel.g == color.g && pixel.b == color.b) {
                            starts.push({ x: 0, y: y });
                        }
                    }
                    // Get all the possible line ends
                    var ends = [];
                    for (var y = 0; y < canvas.height; y++) {
                        var pixel = this.getPixel(canvas.width - 1, y);
                        if (pixel.r == color.r && pixel.g == color.g && pixel.b == color.b) {
                            ends.push({ x: canvas.width - 1, y: y });
                        }
                    }
                    // Find a line which connects at least one start with at least one end (with the fewest vertical movements possible)
                    var self = this;
                    var maxSearch = 10000;
                    var dead = [];
                    var search = function (x, y, line) {
                        if (false) {
                            // Debug
                            var i = x * 4 + y * 4 * image.width;
                            image.data[i + 0] = 255;
                            image.data[i + 1] = 0;
                            image.data[i + 2] = 0;
                            image.data[i + 3] = 255;
                        }
                        if (maxSearch-- <= 0) {
                            return null;
                        }
                        var allLines = [];
                        var copy = JSON.parse(JSON.stringify(line));
                        copy.points.push({ x: x, y: y });
                        if (x >= canvas.width - 1 && ends.some(function (e) { return e.x == copy.points[copy.points.length - 1].x && e.y == copy.points[copy.points.length - 1].y; })) {
                            return copy;
                        }
                        var pixel = self.getPixel(x, y);
                        if (pixel.r != color.r || pixel.g != color.g || pixel.b != color.b) {
                            return null;
                        }
                        for (var d = 0; d < play.length; d++) {
                            if (y + play[d] >= 0 && y + play[d] < canvas.height) {
                                copy.vertical += Math.abs(play[d]);
                                if (dead.some(function (e) { return e.x == x + 1 && e.y == y + play[d]; })) {
                                    // Don't revisit dead nodes
                                    continue;
                                }
                                var subLine = search(x + 1, y + play[d], copy);
                                if (subLine != null) {
                                    allLines.push(subLine);
                                    // Return the first one we find
                                    return subLine;
                                } else {
                                    dead.push({ x: x + 1, y: y + play[d] });
                                }
                            }
                        }
                        return allLines && allLines.length ? allLines.reduce(function (a, b) { return a.vertical < b.vertical ? a : b; }) : null;
                    };
                    // Remove the lines
                    for (var s = 0; s < starts.length; s++) {
                        var line = search(starts[s].x, starts[s].y, { points: [], vertical: 0 });
                        if (line && line.points) {
                            for (var p = 0; p < line.points.length; p++) {
                                for (var w = -lineWidth; w <= lineWidth; w++) {
                                    var i = line.points[p].x * 4 + (line.points[p].y + w) * 4 * image.width;
                                    var k = line.points[p].x * 4 + (line.points[p].y + w - 1) * 4 * image.width;
                                    image.data[i + 0] = image.data[k + 0];
                                    image.data[i + 1] = image.data[k + 1];
                                    image.data[i + 2] = image.data[k + 2];
                                    image.data[i + 3] = 255;
                                }
                            }
                        }
                    }
                    canvas.getContext('2d', {willReadFrequently: true}).putImageData(image, 0, 0);
                    return this;
                },

                /***********************************************\
            | Image Helper Methods                          |
            \***********************************************/

                // Get the R, G, and B values of a pixel at a given location in the image
                // Returned object is in the format { r: 0, g: 0, b: 0 }
                getPixel : function (x, y) {
                    var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                    var i = x * 4 + y * 4 * image.width;
                    var pixel = { r: image.data[i + 0], g: image.data[i + 1], b: image.data[i + 2] };
                    return pixel;
                },

                /***********************************************\
            | Image Segmentation Methods                    |
            \***********************************************/

                // Cut the image into separate, pre-defined sections
                segmentBlocks : function (segmentWidth, segmentHeight, segmentLocations, debugElement) {
                    if (typeof segmentWidth === 'undefined') {
                        segmentWidth = 20;
                    }
                    if (typeof segmentHeight === 'undefined') {
                        segmentHeight = 20;
                    }
                    if (typeof segmentLocations === 'undefined') {
                        segmentLocations = [ ];
                    }

                    var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);

                    // Create blobs
                    var blobs = new Array();
                    for (var c = 0; c < segmentLocations.length; c++) {
                        var blob = document.createElement('canvas');
                        blob.width = image.width;
                        blob.height = image.height;
                        var blobContext = blob.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                        var blobData = blobContext.data;
                        var pixels = 0;
                        var leftmost = segmentLocations[c].x1;
                        var rightmost = segmentLocations[c].x2;
                        var topmost = segmentLocations[c].y1;
                        var bottommost = segmentLocations[c].y2;

                        // Scale, crop, and resize blobs
                        var temp = document.createElement('canvas');
                        temp.width = rightmost - leftmost + 1;
                        temp.height = bottommost - topmost + 1;
                        temp.getContext('2d', {willReadFrequently: true}).putImageData(image, -leftmost, -topmost, leftmost, topmost, temp.width, temp.height);
                        blob.width = segmentWidth;
                        blob.height = segmentHeight;
                        if (options.pattern_maintain_ratio) {
                            var dWidth = temp.width;
                            var dHeight = temp.height;
                            if (dWidth / segmentWidth > dHeight / segmentHeight) {
                                // Scale width
                                blob.getContext('2d', {willReadFrequently: true}).drawImage(temp, 0, 0, segmentWidth, dHeight * (segmentWidth / dWidth));
                            }
                            else {
                                // Scale height
                                blob.getContext('2d', {willReadFrequently: true}).drawImage(temp, 0, 0, dWidth * (segmentHeight / dHeight), segmentHeight);
                            }
                        }
                        else {
                            // Stretch the image
                            blob.getContext('2d', {willReadFrequently: true}).drawImage(temp, 0, 0, segmentWidth, segmentHeight);
                        }

                        blobs.push(blob);

                        // Debugging help
                        if (typeof debugElement !== 'undefined' && debugElement.length) {
                            if (options.blob_console_debug) {
                                log("Blob size = " + pixels);
                            }
                            var test = document.createElement("img");
                            test.src = blob.toDataURL();
                            document.getElementById(debugElement).appendChild(test);
                        }
                    }

                    return blobs;
                },

                // Cut the image into separate blobs where each distinct color is a blob
                segmentBlobs : function (minPixels, maxPixels, segmentWidth, segmentHeight, debugElement) {
                    if (typeof minPixels === 'undefined') {
                        minPixels = 1;
                    }
                    if (typeof maxPixels === 'undefined') {
                        maxPixels = 100000;
                    }
                    if (typeof segmentWidth === 'undefined') {
                        segmentWidth = 20;
                    }
                    if (typeof segmentHeight === 'undefined') {
                        segmentHeight = 20;
                    }

                    var image = canvas.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                    var toColor = function (d, i) { return d[i] * 255 * 255 + d[i + 1] * 256 + d[i + 2]; };
                    var white = toColor([ 255, 255, 255 ], 0);

                    // Find distinct colors
                    var colors = new Array();
                    for (var x = 0; x < image.width; x++) {
                        for (var y = 0; y < image.height; y++) {
                            var i = x * 4 + y * 4 * image.width;
                            var rgb = toColor(image.data, i);
                            if (!arrayContains(colors, rgb) && rgb != white) {
                                colors.push(rgb);
                            }
                        }
                    }

                    // Create blobs
                    var blobs = new Array();
                    for (var c = 0; c < colors.length; c++) {
                        var blob = document.createElement('canvas');
                        blob.width = image.width;
                        blob.height = image.height;
                        var blobContext = blob.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, canvas.width, canvas.height);
                        var blobData = blobContext.data;
                        var pixels = 0;
                        var leftmost = image.width;
                        var rightmost = 0;
                        var topmost = image.height;
                        var bottommost = 0;

                        for (var x = 0; x < image.width; x++) {
                            for (var y = 0; y < image.height; y++) {
                                var i = x * 4 + y * 4 * image.width;
                                var rgb = toColor(image.data, i);
                                if (rgb == colors[c]) {
                                    blobData[i] = 0;
                                    blobData[i + 1] = 0;
                                    blobData[i + 2] = 0;
                                    blobData[i + 3] = 255;

                                    pixels++;

                                    if (x < leftmost) {
                                        leftmost = x;
                                    }
                                    if (x > rightmost) {
                                        rightmost = x;
                                    }
                                    if (y < topmost) {
                                        topmost = y;
                                    }
                                    if (y > bottommost) {
                                        bottommost = y;
                                    }
                                } else {
                                    blobData[i] = 255;
                                    blobData[i + 1] = 255;
                                    blobData[i + 2] = 255;
                                    blobData[i + 3] = 255;
                                }
                            }
                        }

                        // Only save blobs of a certain size
                        if (pixels >= minPixels && pixels <= maxPixels &&
                            rightmost - leftmost >= options.blob_min_width &&
                            bottommost - topmost >= options.blob_min_height &&
                            rightmost - leftmost <= options.blob_max_width &&
                            bottommost - topmost <= options.blob_max_height) {
                            // Scale, crop, and resize blobs
                            var temp = document.createElement('canvas');
                            temp.width = rightmost - leftmost + 1;
                            temp.height = bottommost - topmost + 1;
                            temp.getContext('2d', {willReadFrequently: true}).putImageData(blobContext, -leftmost, -topmost, leftmost, topmost, temp.width, temp.height);
                            blob.width = segmentWidth;
                            blob.height = segmentHeight;
                            blob.orig_width = temp.width;
                            blob.orig_image = temp;
                            if (options.pattern_maintain_ratio) {
                                var dWidth = temp.width;
                                var dHeight = temp.height;
                                if (dWidth / segmentWidth > dHeight / segmentHeight) {
                                    // Scale width
                                    blob.getContext('2d', {willReadFrequently: true}).drawImage(temp, 0, 0, segmentWidth, dHeight * (segmentWidth / dWidth));
                                }
                                else {
                                    // Scale height
                                    blob.getContext('2d', {willReadFrequently: true}).drawImage(temp, 0, 0, dWidth * (segmentHeight / dHeight), segmentHeight);
                                }
                            }
                            else {
                                // Stretch the image
                                blob.getContext('2d', {willReadFrequently: true}).drawImage(temp, 0, 0, segmentWidth, segmentHeight);
                            }

                            // Rotate the blobs using a histogram to minimize the width of non-white pixels
                            if (options.pattern_auto_rotate) {
                                blob = obj.histogramRotate(blob);
                            }

                            blobs.push(blob);
                        }
                    }

                    // Make sure we have exactly N blobs if we know there are N characters
                    if (options.exact_characters > 0) {
                        // Split the largest blob into two
                        while (blobs.length < options.exact_characters) {
                            var largestIndex = 0;
                            var largest = blobs[0].orig_width;
                            for (var i = 1; i < blobs.length; i++) {
                                if (blobs[i].orig_width > largest) {
                                    largest = blobs[i].orig_width;
                                    largestIndex = i;
                                }
                            }

                            // How many blobs should this one large blob be split into?
                            var resultingBlobs = 2;
                            if (options.exact_characters_width > 0) {
                                resultingBlobs = Math.ceil(largest / options.exact_characters_width);
                                resultingBlobs = Math.max(resultingBlobs, 2);
                                resultingBlobs = Math.min(resultingBlobs, options.exact_characters - blobs.length + 1);
                            }

                            for (var split = 1; split <= resultingBlobs; split ++) {
                                var splitSection = cloneCanvas(blobs[largestIndex].orig_image);
                                var blobContext = splitSection.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, splitSection.width, splitSection.height);

                                var slice = splitSection.width / resultingBlobs;

                                leftmost = Math.floor(slice * (split - 1));
                                rightmost = Math.floor(slice * split);
                                topmost = 0;
                                bottommost = splitSection.height;

                                // How far to look for the best vertical split point
                                if (options.exact_characters_play > 0) {
                                    // Find the best left cut
                                    var bestLeft = 0;
                                    var bestLeftX = 0;
                                    for (var fpx = leftmost - options.exact_characters_play; fpx < leftmost + options.exact_characters_play; fpx++) {
                                        var currentLeft = 0;
                                        for (var fpy = topmost; fpy < bottommost; fpy++) {
                                            var fpix = getPixel(blobContext, fpx, fpy);
                                            if (fpix.r == 255 && fpix.g == 255 && fpix.b == 255) {
                                                currentLeft++;
                                            }
                                        }
                                        if (currentLeft > bestLeft) {
                                            bestLeftX = fpx;
                                            bestLeft = currentLeft;
                                        }
                                    }
                                    leftmost = bestLeftX;

                                    // Find the best right cut
                                    var bestRight = 0;
                                    var bestRightX = 0;
                                    for (var fpx = rightmost + options.exact_characters_play; fpx > rightmost - options.exact_characters_play; fpx--) {
                                        var currentRight = 0;
                                        for (var fpy = topmost; fpy < bottommost; fpy++) {
                                            var fpix = getPixel(blobContext, fpx, fpy);
                                            if (fpix.r == 255 && fpix.g == 255 && fpix.b == 255) {
                                                currentRight++;
                                            }
                                        }
                                        if (currentRight > bestRight) {
                                            bestRightX = fpx;
                                            bestRight = currentRight;
                                        }
                                    }
                                    rightmost = bestRightX;
                                }

                                // Find the highest pixel that's not the background color
                                for (var fpy = topmost; fpy < bottommost && topmost == 0; fpy++) {
                                    for (var fpx = leftmost; fpx < rightmost && topmost == 0; fpx++) {
                                        var fpix = getPixel(blobContext, fpx, fpy);
                                        if (fpix.r != 255 || fpix.g != 255 || fpix.b != 255) {
                                            topmost = fpy;
                                        }
                                    }
                                }
                                // Find the lowest pixel that's not the background color
                                for (var fpy = bottommost - 1; fpy > topmost && bottommost == splitSection.height; fpy--) {
                                    for (var fpx = leftmost; fpx < rightmost && bottommost == splitSection.height; fpx++) {
                                        var fpix = getPixel(blobContext, fpx, fpy);
                                        if (fpix.r != 255 || fpix.g != 255 || fpix.b != 255) {
                                            bottommost = fpy;
                                        }
                                    }
                                }

                                // Split the largest image
                                var temp = document.createElement('canvas');
                                temp.width = rightmost - leftmost + 1;
                                temp.height = bottommost - topmost + 1;
                                temp.getContext('2d', {willReadFrequently: true}).putImageData(blobContext, -leftmost, -topmost, leftmost, topmost, temp.width, temp.height);
                                splitSection.width = segmentWidth;
                                splitSection.height = segmentHeight;
                                splitSection.orig_width = temp.width;
                                splitSection.orig_image = temp;
                                if (options.pattern_maintain_ratio) {
                                    var dWidth = temp.width;
                                    var dHeight = temp.height;
                                    if (dWidth / segmentWidth > dHeight / segmentHeight) {
                                        // Scale width
                                        splitSection.getContext('2d', {willReadFrequently: true}).drawImage(temp, 0, 0, segmentWidth, dHeight * (segmentWidth / dWidth));
                                    }
                                    else {
                                        // Scale height
                                        splitSection.getContext('2d', {willReadFrequently: true}).drawImage(temp, 0, 0, dWidth * (segmentHeight / dHeight), segmentHeight);
                                    }
                                }
                                else {
                                    // Stretch the image
                                    splitSection.getContext('2d', {willReadFrequently: true}).drawImage(temp, 0, 0, segmentWidth, segmentHeight);
                                }

                                // Rotate the blobs using a histogram to minimize the width of non-white pixels
                                if (options.pattern_auto_rotate) {
                                    splitSection = obj.histogramRotate(splitSection);
                                }

                                // Must insert into the same location to preserve order
                                blobs.splice(largestIndex + split, 0, splitSection);
                            }

                            blobs.splice(largestIndex, 1);

                            if (options.blob_console_debug) {
                                log("Large blob divided");
                            }
                        }
                        // Remove the smallest blobs
                        while (blobs.length > options.exact_characters) {
                            var smallestIndex = 0;
                            var smallest = blobs[0].orig_width;
                            for (var i = 1; i < blobs.length; i++) {
                                if (blobs[i].orig_width < smallest) {
                                    smallest = blobs[i].orig_width;
                                    smallestIndex = i;
                                }
                            }
                            blobs.splice(smallestIndex, 1);
                            if (options.blob_console_debug) {
                                log("Small blob removed");
                            }
                        }
                    }

                    // Debugging help
                    if (typeof debugElement !== 'undefined' && debugElement.length) {
                        for (var i = 0; i < blobs.length; i++) {
                            if (options.blob_console_debug) {
                                log("Blob size = " + pixels);
                            }
                            var test = document.createElement("img");
                            test.src = blobs[i].toDataURL();
                            // test.border = 1;
                            document.getElementById(debugElement).appendChild(test);
                        }
                    }

                    return blobs;
                },

                histogramRotate : function (blob) {
                    var initial = new Image();
                    initial.src = blob.toDataURL();

                    var range = 90;
                    var resolution = 5;
                    var best = blob;
                    var bestWidth = blob.width;
                    for (var degrees = -range / 2; degrees <= range / 2; degrees += resolution) {
                        var test = document.createElement('canvas');
                        var testctx = test.getContext('2d', {willReadFrequently: true});
                        test.width = blob.width;
                        test.height = blob.height;
                        testctx.save();
                        testctx.translate(blob.width / 2, blob.height / 2);
                        testctx.rotate(degrees * Math.PI/180);
                        testctx.drawImage(initial, -initial.width / 2, -initial.width / 2);
                        testctx.restore();
                        var testImage = testctx.getImageData(0, 0, test.width, test.height)

                        // Check width of non-white pixels
                        var testWidth = 0;
                        for (var x = 0; x < testImage.width; x++) {
                            for (var y = 0; y < testImage.height; y++) {
                                var i = x * 4 + y * 4 * testImage.width;
                                if (testImage.data[i] != 255 && testImage.data[i + 3] != 0) {
                                    //  Found a non-white pixel in this column
                                    testWidth++;
                                    break;
                                }

                                // testImage.data[i] = testImage.data[i + 3] = 255;
                                // testImage.data[i + 1] = testImage.data[i + 2] = 0;
                            }
                        }

                        testctx.putImageData(testImage, 0, 0);

                        // Minimize the number of non-white columns
                        if (testWidth < bestWidth) {
                            bestWidth = testWidth;
                            best = test;
                        }

                        // var test2 = document.createElement("img");
                        // test2.src = test.toDataURL();
                        // document.getElementById("debugPreprocessed").appendChild(test2);
                    }
                    return best;
                }
            };
            return obj;
        };

        /***********************************************\
    | Private Variables and Helper Methods          |
    \***********************************************/

        var model = new Array();
        var pendingPatterns = new Array();
        var currentlyTraining = false;

        var processQueue = new Array();
        var processBusy = false;
        var doneResult = "";

        // Add a method to the process queue and run the first item if nothing's already running
        var addQueue = function (action) {
            processQueue.push(action);
            if (!processBusy) {
                runQueue();
            }
        };

        // Run the next process in the queue if one is not already running
        var runQueue = function () {
            if (processQueue.length) {
                processBusy = true;
                processQueue.shift()();
            } else {
                processBusy = false;
            }
        };

        // Find the best match for a pattern in the current model
        var findBestMatch = function (pattern) {
            var best = 4000000000;
            var solution = "?";
            for (var i = 0; i < model.length; i++) {
                var test = getPatternDifference(model[i].pattern, pattern);
                if (test < best) {
                    best = test;
                    solution = model[i].solution;
                }
            }
            return solution;
        };

        // Convert a blob to a pattern object
        var blobToPattern = function (blob) {
            var pattern = new Array();
            var image = blob.getContext('2d', {willReadFrequently: true}).getImageData(0, 0, blob.width, blob.height);
            for (var x = 0; x < image.width; x++) {
                for (var y = 0; y < image.height; y++) {
                    var i = x * 4 + y * 4 * image.width;
                    var brightness = Math.round(0.34 * image.data[i] + 0.5 * image.data[i + 1] + 0.16 * image.data[i + 2]);
                    if (image.data[i + 3] < 255) {
                        brightness = 255;
                    }
                    pattern.push(brightness);
                }
            }
            return pattern.join('.');
        };

        // Clone a canvas object
        var cloneCanvas = function (oldCanvas) {
            var newCanvas = document.createElement('canvas');
            var context = newCanvas.getContext('2d', {willReadFrequently: true});
            newCanvas.width = oldCanvas.width;
            newCanvas.height = oldCanvas.height;
            context.drawImage(oldCanvas, 0, 0);
            return newCanvas;
        };

        // Get a value indicating how different two patterns are using the root mean square distance formula
        var getPatternDifference = function (p1, p2) {
            var pattern1 = p1.split('.');
            var pattern2 = p2.split('.');
            var diff = 0;
            for (var i = 0; i < pattern1.length; i++) {
                diff += (pattern1[i] - pattern2[i]) * (pattern1[i] - pattern2[i]);
            }
            return Math.sqrt(diff / pattern1.length);
        };

        // Compare two pixels
        var pixelCompare = function (i, targetcolor, targettotal, fillcolor, data, length, tolerance) {
            // Out of bounds?
            if (i < 0 || i >= length) {
                return false;
            }

            var cNew = dataToColor(targetcolor, 0);
            var cOld = dataToColor(data, i);
            var cFill = fillcolor;

            // Already filled?
            if (colorCompareMaxRGB(cNew, cFill) == 0) {
                return false;
            }
            else if (colorCompareMaxRGB(cNew, cOld) == 0) {
                return true;
            }

            // Compare colors
            if (options.perceptive_colorspace) {
                // LAB comparison
                if (colorComparePerceptive(cNew, cOld) <= tolerance) {
                    return true;
                }
            }
            else {
                // RGB comparison
                if (colorCompareMaxRGB(cNew, cOld) <= tolerance) {
                    return true;
                }
            }

            // No match
            return false;
        };

        // Compare two pixels and set the value if within set rules
        var pixelCompareAndSet = function (i, targetcolor, targettotal, fillcolor, data, length, tolerance, exclusions, ignoreWhite) {
            if (pixelCompare(i, targetcolor, targettotal, fillcolor, data, length, tolerance)) {
                if (typeof exclusions !== 'undefined') {
                    if (arrayContains(exclusions, i)) {
                        return false;
                    }
                }

                if (!(ignoreWhite && data[i] == 255 && data[i + 1] == 255 && data[i + 2] == 255)) {
                    data[i] = fillcolor.r;
                    data[i + 1] = fillcolor.g;
                    data[i + 2] = fillcolor.b;
                    data[i + 3] = fillcolor.a;
                }

                if (typeof exclusions !== 'undefined') {
                    exclusions.push(i);
                }
                return true;
            }
            return false;
        };

        var dataToColor = function (data, i) {
            return {
                r: data[i],
                g: data[i + 1],
                b: data[i + 2]
            };
        };

        // Measure the difference between two colors in the RGB colorspace using Root Mean Square
        var colorCompareMaxRGB = function (color1, color2) {
            return Math.sqrt((Math.pow(color1.r - color2.r, 2), Math.pow(color1.g - color2.g, 2), Math.pow(color1.g - color2.g, 2))/3);
        };

        // Measure the difference between two colors as measured by the human eye.
        // The "just noticeable difference" (JND) is about 2.3.
        var colorComparePerceptive = function (color1, color2) {
            // Measure the difference between two colors in the LAB colorspace (a perceptive colorspace)
            var eDelta = function (color1, color2) {
                var a = toLAB(toXYZ(color1));
                var b = toLAB(toXYZ(color2));
                return Math.sqrt(Math.pow(a.l - b.l, 2) + Math.pow(a.a - b.a, 2) + Math.pow(a.b - b.b, 2));
            };

            // Convert a color in the RGB colorspace to the XYZ colorspace
            var toXYZ = function (c) {
                var xR = c.r / 255.0;
                var xG = c.g / 255.0;
                var xB = c.b / 255.0;

                xR = xR > 0.04045 ? Math.pow((xR + 0.055) / 1.055, 2.4) : (xR / 12.92);
                xG = xG > 0.04045 ? Math.pow((xG + 0.055) / 1.055, 2.4) : (xG / 12.92);
                xB = xB > 0.04045 ? Math.pow((xB + 0.055) / 1.055, 2.4) : (xB / 12.92);

                xR = xR * 100;
                xG = xG * 100;
                xB = xB * 100;

                return {
                    x: xR * 0.4124 + xG * 0.3576 + xB * 0.1805,
                    y: xR * 0.2126 + xG * 0.7152 + xB * 0.0722,
                    z: xR * 0.0193 + xG * 0.1192 + xB * 0.9505
                };
            };

            // Convert a color in the XYZ colorspace to the LAB colorspace
            var toLAB = function (c) {
                var xX = c.x / 95.047;
                var xY = c.y / 100.000;
                var xZ = c.z / 108.883;

                xX = xX > 0.008856 ? Math.pow(xX, 1.0 / 3) : (7.787 * xX) + (16.0 / 116);
                xY = xY > 0.008856 ? Math.pow(xY, 1.0 / 3) : (7.787 * xY) + (16.0 / 116);
                xZ = xZ > 0.008856 ? Math.pow(xZ, 1.0 / 3) : (7.787 * xZ) + (16.0 / 116);

                return {
                    l: (116 * xY) - 16,
                    a: 500 * (xX - xY),
                    b: 200 * (xY - xZ)
                };
            };

            // Perform the comparison
            return eDelta(color1, color2);
        };

        var arrayContains = function (arr, obj) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        };

        var toColor = function (r, g, b) {
            return {r: r, g: g, b: b, a: 255};
        };

        var getRandomColor = function () {
            var r = Math.round(Math.random() * 200) + 55;
            var g;
            var b;
            while ((g = Math.round(Math.random() * 200) + 55) == r);
            while ((b = Math.round(Math.random() * 200) + 55) == r || b == g);
            return toColor(r, g, b);
        };

        var getPixel = function (image, x, y) {
            var i = x * 4 + y * 4 * image.width;
            var pixel = { r: image.data[i + 0], g: image.data[i + 1], b: image.data[i + 2] };
            return pixel;
        };

        var patternElementID = "cbl-pattern";
        var humanSolutionElementID = "cbl-solution";

        var closeClassifierDialog = function () {
            document.getElementById("cbl-trainer").style.display = "none";
        };

        var openClassifierDialog = function () {
            if (document.getElementById("cbl-trainer") != null) {
                document.getElementById("cbl-trainer").style.display = "flex";
            }
            else {
                var appendHtml = function (el, str) {
                    var div = document.createElement('div');
                    div.innerHTML = str;
                    while (div.children.length > 0) {
                        el.appendChild(div.children[0]);
                    }
                };

                appendHtml(document.body,
                           '<div id="cbl-trainer">' +
                           '    <div id="cbl-trainer-dialog">' +
                           '        <span id="cbl-close" onclick="">&cross;</span>' +
                           '        <h1>CBL-js Pattern Classifier</h1>' +
                           '        <p>Identify the character in the image below by typing it into the textbox.</p>' +
                           '        <p>Type <span class="cbl-discard">' + options.incorrect_segment_char + '</span> to discard a pattern if the image was not segmented properly.</p>' +
                           '        <div class="cbl-row">' +
                           '            <div class="cbl-cell-50 cbl-right">' +
                           '                <img id="' + patternElementID + '" />' +
                           '            </div>' +
                           '            <div class="cbl-cell-50">' +
                           '                <input id="' + humanSolutionElementID + '" type="text" />' +
                           '            </div>' +
                           '        </div>' +
                           '    </div>' +
                           '    <small><a href="https://github.com/skotz/cbl-js" target="_blank">CBL-js &copy; Scott Clayton</a></small>' +
                           '</div>');

                document.getElementById("cbl-close").addEventListener("click", function(e) {
                    closeClassifierDialog();
                    e.preventDefault();
                });
            }
        };

        var log = function (message) {
            if (options.allow_console_log) {
                console.log("CBL: " + message);
            }
        };

        var warn = function (message) {
            if (options.allow_console_warn) {
                console.warn("CBL: " + message);
            }
        };

        // ZIP compression from https://github.com/pieroxy/lz-string
        var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);

        // Load the model
        if (options.model_file.length) {
            obj.loadModel(options.model_file);
        } else if (options.model_string.length) {
            obj.loadModelString(options.model_string);
        }

        return obj;

    };

    let qtyChecks = 0;
    let cbl;
    const imgElmId = 'Imageid';

    function getSolutionElement() {
        const solutionSelector = '#fauform input,center input[type="text"],#captchaClaims,#captchaAddress';
        let solutionElm = document.querySelector(solutionSelector);
        if (!solutionElm) {
            try {
                solutionElm = document.querySelector(`#${imgElmId},#captchaClaimsImage img,#captchaAddressImage img`).parentElement.querySelector('input[type="number"],input[type="text"]');
            } catch (err) {}
        }
        return solutionElm;
    }

    let checks = setInterval(() => {
        let imgElm = document.querySelector(`#${imgElmId},#captchaClaimsImage img,#captchaAddressImage img`);
        let solutionElm = getSolutionElement();
        if(imgElm && solutionElm) {
            clearInterval(checks);
            start();
            // console.log('starting slwrd');
        } else {
            // console.log('Elements not found...' + `ImgElm: ${imgElm} | SolutionElm: ${solutionElm}`);
            qtyChecks++;
            if (qtyChecks > 10) {
                clearInterval(checks);
            }
        }
    }, 3000);

    function start() {
        cbl = new CBL({
            preprocess: function(img) {
                // img.removeLight(75);
                img.changePalette();
                img.binarize(75);
                img.colorRegions(5, true, 2);
            },
            model_string: "NoTQvADAdNs/doCYCMUBsAWKKIHYdMAOHATjSQGZskBWWqOhpx+15tlrznjv9gd35DBvUcLEipkmRLniFiBMrioM2XARTEyFagunzDB2SaOnjli9fO2zKh0rVYc+QiRTlG+q3d/3/QJsA4KC/YKVI5U8oWlIoUg9KdBw8FNRmZO94pExKRkx02mRafLCQ8MqK6vLaiMcGlBSdImgUdsJ8lDSydLdUEiQkQcoc4prQyaq66amJ+SjFnCQoSgJ0FaIU9rQULJRaLTwGTzLcRmGCotmb+buZ+7mRJaicgkwGDahWhI8Y7Q06Hip0YKEGeUetwe0KesNuLwcJ3SBDWUB0cSgeGBKBWANSzH6o0hxJhULhJNMCKcsQSyxw23imGgWJw/0OvW81wpZJ53L5tQogtBwrUoqF/22K3izDIsXiiRw+x6GU52QKZUKrBKZXJpP5uoNn2wLhNxrN6gtLgxOlRSC0KSRaJIPx2nVSDL6BAGFxGYxKvL1gcNd00ri0blDkYj0fDBAVPy+H0YcbpqK+W1Zu327O6J1IZ2Ql1yXKDAeDpfs2g8Oir7jrtYbNZr+w6Ga+qJxtLtaM+m2gCvawMwgOB+dB4J1Zan+unxk8uy8890y6Xq8Xi562i6regNYd9OTq3eJAxLPauOH+MYhLGs/L97vRh8z5oL+8r4/79BJ03WQVGJiFYGGBXEGTRZlsWBHNSHSLIK3gh8ZyQqR9hgnAcxiFkmVlJo6WlRhZQxAclXSA4vyoT8KPIt8qNomj6MohjqMYljmLYujWNoxCuCJJAI2OQgNE7FlrRIW17RpXCWjaDot3dFd1wXJSFOUtdVMUlTNLUrSNO0vTdIM5SEOYCFvRBJohyE+VnWgRNmBTTs002bZZP2Jtqw8+t3K8zzG187y/J8oLApCgKwv8zzjKuH1QTaMdc3QrQWzQNsVg7KVDyTdN+w8GMw3yqNYwKvLCuKorSoqkqqvK6qyrq0MoroZBeKLMFry0NDum2CFXR+PdJORI8nTlS1zVNUaJvGqaxpmybZumubFpcRrSi1aLcjKXi4LIrrFRSf9RwI4C6VwwChTFEVzquy6bouu7rvu26Hue5Dy30VcazcZa0CpBpfv+v7Aacbi3o0RdPvWGgfqBmGAbh2HlBWqF3vB3LIeFeHMYRrHgcfEkUd2CGLTUHHsbJ0n/Ve5GwcJtHiehinyaZgGkfuAn6y+qHme5xnfpWnVkE1Da1SoUif22P8T0OoDaU7U6chex6lcVlWnrV5X1YoEGOGanJWsGCNOs3Hqd2G3DHW7VF0XiBbbfm+2lodu3HZd5btfW1q4q6ASDiSlyUpSdstAy7ssr7X56tqyqapjyPY+juPE4T5P+nd4WzPioFBNZazvlslYk27EChvTf29uC8KK4iqua9C6u69ryuG8a3j+JOS9z0xaVGTEr0JMdaTMzdXb9PUsedPH0eJ+nqfZ8M6eW49RKc678CcMlWkZRiIikm2ZUyI49imMPk/j7Pzjz6Pi/r6v2/T6h8Xy4O2UZeL+W17PNkOtgks07/vHyhz0nvPEeJsUq7g8PuXCltjwjU/heDQAk+Jel4v/Km6DAFNywfXZK3xA5pWDl2d4vY84R0HNnCyZAzgTgwWg1m/gU7x1qvGfOPZDzFycngoeextg5h9mOVAhZwS/wAXQsR8hnaSOwKJIa3ZzYHkHq6OSI80LIPHDFKgfpaGiJ0fcVWGsJR4RpLibuZCSLflVJo9U61xh0EnNohx9CxDw1fidMC2FP5QW/pY8RjjfF6nhhbFEsDTzYgQVeNRVinG6OiUheGbw2HZTIf8DuWcQTenTv4rJMTgzw0cusZy3DsxHDzAWDRQtsl+JybyPJzQbLcJ6puVR/Q2pDF9GtWJnTKnlDyaY4ie8xaWN4qZCp2oqnjK6fCMmzgNARhrF4Li1SJndN8S4tALhIzzL0DQFZSzJkOLWRaTZHgFk+F2csvZ5z9nXKubcy59yLmPJuQ855Ty7lvJee8153yvm/M+f8j5gKfkAuBUCv5YKQXgtBdCqFsLIXwohYimFCLkVIrhWilF6LUXYqxbi/5ABdYAAALSAPMyW83JZSil1KqW0ppfSuljKGXMqZayll7K2Wco5dyrlvKeX8r5YKgVwqhWipFUsDWkr9HSpuoYzs+EViuLlmBKVms1Wqo1S9KRrsna6sWjI8SB4GBBKGtbHV5rtWWr1eNRhSco72qYY6/KLCMAF3srSBJYdSEDgdXap1tqA2+oDdgxu9cQ0Nwjc2MuqUhpywIa6rhSi3JhpTaGtNkbU0ZvrCAnNwC80z1zSuY225wFm22HU0hSjGkMnzUAgttbC11rrffO+l8W3trbT4Hav59pSxwn03e8kVQdpviO1to7O0Tp2ZijgAt1qmS2qRLQRBCYnHOHgbAlASAeMgsvTwP8MWHpubrDRrTDbbBXehYEW7WRxhSBu1enc8QJUiagmdR7ulC09lQq8vtCAnBvXsXYuRb2shkpZeko5qHWJxe+65pk2rmTSR3f45x2jBw0JQLM1YTh8NKbFcpIiP1wboa3EpFDhLxAfZ1boioPAAUvfu9q6i2ki1sXi4jGDUK8K0JhRk0Ab0PvaG0JMYJBQoNgjkEZRQxmwc4/Q9mDZOY3Q2XMk52z5McexYpom31hSqa0Fs8iWmTMop03TPTMyCpGcWZpkj9mvwfQs1zKzxzly2bk55qF5n8qWfWbMwz6njMOa8yFnzoY/NHLU+5s5IXTNIvC8ptQ29c48KHQfOCwyNQydYPY0Ldn+SJfRslitLpZLVo5JE1pRZUGU3y/V0GK5dNc3yQmjMSaeO/oEecVjxYCsNdnEV+mRDEnhwHCkkcP6MmmXiwN/GNMObFbQCaq2fb4EUKQTefrs3GtOd8y5mkb93EQRXn+pjotttxYAdxvdfG15yoylvAd5ddrDsneOj7Y6vvvY818sjv6UMrBEj3WR/cFH1Krd7Gt9aYdNsbfDhtRkoUIZOV0ZDVkI4Jjdew1MBTE2uW6pm8NxOiek/Td5bFX7Bhofij7HMuCY3pRG16n4Pr/VBo5+zrnfq6o4pPb1s93jQEltIf1FbISbbWqlxa6X2qcVzr6+nRdFiR6SxGoBQ7biX4ys1eqnX+idtPiXmdu72EHubwIuKmGc3LD/YSs+yjI0bR9yNWKhGNuLAo5/ZQh3ucsdsKLm7vmhuDBU4I+ZOnfsh6M8IVbhEHvzD8/1sxpjwvo8QIPHHwGCeTAK6FgunI21H5pefjELPEqQ/wSG3p8vDQc9V4W0ppbQfreV+4tXrmteoj17b1dy7/ee998HwP3vI+h+j+H5Pif0/x+z7H/Pqfc/F8L5nyvpfq/l+b439v9fu+1/7+MoSgAnqSrvgNt4kE6pQb2iqeuYFvPce/4e8C4mvwkB0JzCKX4ljfgjuQH/PAt4AwX7v6Ki/6CIFAAFPBP4QHdCv75BoS0Cf4gFX7gF35QH8Bn4IgoE/6pC36CwYE1AwFoYv5gGgFIH9qxDf5kFwF/4wGUhAEIzbz7RdCUBtDoAGwmQK60BayKq0B8E6g0DEG7BCZ/g2yKpCEYBoCkBJTezIAQDpAjJSbKGMHAEVqfwia4h4BlAQDMDQJDAXCF6KEahaJmREBaBsA4jYCkArDoDQDshEC4gRhYZ7qXp8SkTIA9bnBYHn75BEjoDAQyTdSgQeBEBdCkAEheh8TeASEcAUB0BkDAjaGEDBxSgMBEDAgQDbgSwiZdB8JtCkG0G0E+FLDnBsGxDMj9gyRtDlHaDAjoDLoEhlAGG5AlCKqUC34mIiG4j8GKjAa4ggY4iShJA1FZisHjFkElENBRGrAOi2QMAsjxSnREhNBdDmGgh6CzreCDAgZ8SjgnCMboC8LtwAYnBIAuTbBuAyGgFoRoRTFRCYYXCrACYg60ApCOGsgXhaEUAQB6AlBCGZDpDdioAKzyG7DrFNDdRnGzL5AfHoDLYniImqFMFoiYiuCKgHgxAtAY4HBgyFgSASFSbGEFDNRRFtAQmWEGEZGxBehgyUH/CHQMn0mMksnMlslMkcmsmcn0n0ZGIpD5ACbzGuBZh7w/ESYiyYCxEFCDA8GsCvgMgWEgSbD5BZSIhIkUEanqlalUE6mam6nal6mGkGnGn6mxDYBJhwTIFtCsBmnfBCRdCNLhE5AtJAmZAah8F6AKlXrLDKmJIOC3H7SBk3FBkBnBlhmhkRkhlRnhnRmRnfBUbGi7j8kiEETRGXgcEJC4jLH1FaEMjyF6GF4agjBekHBKnfAqmfAOB7ATHVk0Fv61kNn1lNk1nNl1ktntltmdmNkdndk0GDFZHlkWgLqrDoSrD5C9F4DQBEC5SSgnH0gHEEjMAJG5CAlkCKk+mDmqlKBFGFG7laH7l4GHk7kHnHlHl7lnknnnmnnXlXm3mgQ1FdAQDOhAT8m7jolUCrAMA6B2GYibC8asH1F5ieGKHtElkARUkVkYAOAQEwVeGeHwV/5wWIUIWwUoVIWoXIWYUYXYXoU05IisG7AQC2S9w0gbyAT8l+HShTlZkOmPyvpGFrnek4i+lbmIwwHsUqH/6QHcVcW8UcU8X8V8WcWCUiXCViUCXiVUALh5EuTxCXrpk4AER+GolnEVHfDBxIgmIMUXaeDrnMWbmVm4wH5pw3p8SILYauDYB4BoC2gjA4DVi0jGhsJhEbmlmMUXY6XXFuX6UuWsWqA77ISYCChrG4YjGuBA7GjLZoDYS1HyhQVJguX6XeXXEeWoR6UQV+lGVb6ziXhDCKpEWpD0YSxCRpGryJivmEDxXpFdAGHJXimeXpUsWGWIwBXwSYAoKeFgyhGgTtwgQzl2kJpm4kDNDVWuUAQpWZZgVlm+XNX+V75dJJ4KwGwnLLr2iv4nAKGryykfkjWDlJXjX1VpVMUZV+XwDZWvRFkwamVv5DB6xgyaXLCX6fAUDDXOU1U9GjiHVTUbkzVQVZWtVfIflgjtyXFUYCa2FvVjWfVDLfU+WQUpD/XzVaZA1EAg2uBg2rAQ0JXvVMUTUHq6XHVNV/UtVI1L4o1o24AY0dFVV7W1UHUw2MXeUnWzVnUA1wbk2ECg2Yjg002JV03Q2pWw3M3E1zXGUhYc3aBc2TmY280411UM0E1M1E0I0k1i1HoS2aiU3c0y27V80fXuWTWM3gXK3QVs1Ioa1S08261y302C1G3TXw2m2k1+I7IUA6ArkFDtHaUQBJGGZCRoB4DbqKEYD9gAa7BHHXh6DimK3G0GUi2s3O1OJu3tHNF6GeiJH2VtAASAa0ZoQCRfA2FjW4huF37NRC0m2I1q2Bju03WAS6FkAFHlo9GEyv4DHbiPnWEgQaDtVHkRGghSabTl1x0q2i3nXV1LmLn2VIhzk4hnE1VnHBxhV7Cv7HGpDhE/F6y0n41eWx2/Uj0J1V3cSSmgh5nzmKjYiwlxgBbLBZjd2QIiEaAQmkAKyKq7FwQwFHVK3D1O2H2DbOlHBQmsiwlAS2T7QyTtzsEHEKyCg7GZDtHggcCgX20/WO2V1j26ioQ5nLDpEEDjCOT3pOFDgXpnCcXsa8G5ZymCCf272oOIwflDDNGMMXBMMMPMNsOsMcP0NcMsPcPsO8OcM8OCN8NCNqLdAAWuAEOrAKrDXSFnGQImJLkiP8P8P8TiO4CSNEgMDbmo1T26PA16M6P6NGOGMmMLkGNmPGMWOmPmM2OWO2PWPdCEzZHfDDUCYqneCxAB2ZESwPV2N+MOOGPWXDy4TTkh1jmonbma1RPdQxOc1xOS3xPROJOxMJOpNJNpMpPpNZOZM5MvZ7CZna3u38n2VrzpizLDHJOVMZPxMtgIFA4Z7nEjnbk+3o2tNa3tMtMdOZHdNtOdN9M9NdO9MDP9NDOjODPjO/EDUZm9GUB5gjnaDPFoj4Krx90TPDPrPClTMnhpRzMCnKDS0HOVHa2HPHNHMnPnNnOXOnPXMXM3NHMBG2mXg3U1UESHTlHYSynwl3PfPS0PO0DmmbqbR0grBKDU1gtpQQsy3gtQuQvQtwuwsIswtIvwvItpQlDXijnnDbColDglP0NiSIsotgvovRE7S2SKX3HIlRAUAjnSJQWBzx2UtW6PmpAePlFWzmlflctUs8twBgQuEQhvEYDOgpSwliu8sSs5BB0WgfG4DgauW1UGFMuMH4NhOJVPl9HoS8JQQ6sSs+FkRJhCYDkNnoDhHhEdQWt6s8ttT/PxnLCAhxSZCekM3KtZ44E0GkEwX0ELBWu17usNmevoH2Cust7+v1mBsEG/1RvoOJ1m0xvRtxuJuxvJsJspvxvptJuptZsxuEoACmYAnSQscsgdFGAd7wCBrKjTP5pAGglwTQC4S5hBGb0wRbWh1Y/tmI5btIDKVb/Ytb99ZAjb2b5YrbhVpbnbaIFbPbgcfbj19IDbhhw7AYo73Q7bQ8eAXb8Q07YTNbc79bg7i7GbhJBQJkXt3gcDFwqkP5ew/YNs8QRIJAPb452ARAQkM9m2sEzUm0tJgsQhXo21trlOUmegqdoIXoLTfE4J8jeTKUxq97+QBAPbSZv5ZCgxT+9uKV9dqAzR8RhetJWxlObpl714JyxDqQuwQrew9pCQAdu4CS+9FKuEN6GIjGEAAx3d09qQy6zpt+NAwJqCfBcGx9QwBIQW3QGgOYZuQNm11JpBbAply2rK+T7z6Ml642AGF49RZHfEnhKCOydWf2CsQuQmq0QGYGCQzIw1DoKpL1B4ezNKPWaU5puDVGmwndN9hAoEj9BIQJ4ITbVysz14wIiV9OhF7x9hJ4u4TnjAF675rK3UTx7L0rtrDRCQ24EG3QcUQJEhMpcG1NkH5HhA1RouYwTxiGa63wqJDMtK+QlxGJ0CzUqw5oqzCRBwF6pEih/7ey+eihvXxHYIRVywCBEXNpyAtLpFaJclaJ+4ZQFLSlKlUFKYJA6wNIs30haIAd19ewSR+VmQW986fXgYnYqAnRoIXR9Ir+5TmIkXTxQO9XUmizWQQVUj4TwJ4d6JNAaJ+TgEm6AmzQNl8Hh4JWH3aJWQLghdOIImHgyoWHx3cPp3eoq7Y7SPKP17tTdrEdx9bUrBbLKpz7FoD6Wc1o97gwoRlXOPH5b+gr5ohPpiT+plZPr15RtrG7mzs99Yu50PXPY7iPHcfP3dmGMk0hAdQEfhEnVXgP35CHcYThcYclCx9hX5FALkEv4TUvE7EPVx8v2tbAz3jTHQJkk7GAwDbPpLKx/PFCuVwYSisktv0h2v0tuvyvrIxi5ptXJvuAwGNR16QvNHKHq070xqBQRvpr3wThXv59iovvXgcnYvo5dJVPw10vBTkYdv3CHQeorPWfBArPRPjIJPjAjPUFzPVl4YwG7c0P95eTsJNszQxdxf9hpfpvFfR5aPLkNfGAdfJTFPfhePtpLgD62fE7rPeoEIY/ffRIN1Xo735wVlsxFoEPpLNYMPeY4dl3Ej13alBhKIgc1hAxUPQ69dq4XwVHG/JbtiiqX34Rwf7L/3Rv4/RveocVcVy3UFDAa3jlm3BUKxnrWHtoyWoTNrkNws46kEijIL/pGB/67dvAURKDlq2AGkARuCRMbu40rIphn+XYXJA4Fq7olvufQNls1zOK4Z2uJ9AoFEX2Lzs52u7H8o00ZDJ8q0iCanBIVgj5URChMYrn1FK61VeSrYKrnXiwFKAEuBhJLks375xh0uG2LLhcBy6LtPASIYDJfkTIxdHK9A8rIwLO7rRAuexeynkSShhdSEGpKLk12UGIYxu3eAQdEELDGCe6p4NzgkBAgt16Q3na8L5x4pIAKB+7HEIoLCa0CjerPBgTz2O5CxeItGVPCZwIrmdEBm/COqtD16QImmP9B4NSz8K7hVO0hP4Bp0IBacdB14XTsZkLAeCvmXghIEoN8EQh/BagwIcwM9oXBRORaCToZjaDSd3irnWIO/2pw0hzBNSKsvyT7Ssd2O/6M+t0G47XheOFwFBGMFfqFCFBJQnwftD8G8ZCY6gk7vOiI5DAfipHHIY43gGn92gCBWjmiHo78DuhTgZDqQQHBockieYcDnoRw6HtbQhcVaLdQPaeDLg1A5APMPKGLCNsTA+dMB28CgdUA4HZ0nAKaAr1o8cHcJoh0SHkhu8+PV9qyHfY+dvAX7GASSQKB/tWAWsPjtMKoGlDPhqgpYVUJsTHsPauQM9lQAvbrCVwaPW9hgHvZTcuhxIbvDO1mHFDPBfdZ4fBHcEvCihbw/ESoInYBCkeKwxXCO1Ihttx2rPCEFuxhFTInArI3duyKKGcieR3I3EcUPeHKC6BQoyoSKKCFEZagK7Etg7jLZG9ZRaDOYCyJ3b9tKBcgw9txB5H2jXh3gmgQSN1FEj9R1Q6uhKOR4oYzRMo44cyOgqKjbRHIoduqN5EzCtRZQwkT8I0Fijl2volHv6InaBimRSQkMTaL3YqiIxjojUfyLmGCiKhnoktqKIqRJiNBKYjttKKnZyi7g1o6tmGNzEOjZwTo1ZnyNdEfDix3w59GWINH8hjRa7V0LWO7b1iekWYpsTmIXZcj8xUYvEUWJ1Elj4x5Yw0dAWTEmjUxo4i0arUzEKjsxyomcWqLnHOjOxswt0T2IaTLCBxPoqsZuJrGbsgxe4xGPCLfaDCX0m1KgKiKoA/sMRZArEZQ2eGnjoxAopcb2I7j9jvR4ou8cOI6DbinxsI6CmcKlAeBLhXWG4aCDuFciHhBHdsfIIXEXiwJV44kYmJJBDipRj4jMYhO3K9CRo/Q+1u+IebDD7KPHUEHxwmGsAph84zUaBIWHESvRNiSsSsOrHrtKJ44q0VWRSFog0hySTIXUXpDacCqQI/IbII7EgTFxfE4UZBMElkSNxsEgMXWMtFVBqWVg/QDYNaEIjn6HnbQF510buFykesAsV2O1GaS9R2k0idCHImmi0xhk3cdROUBCC0WqwZLsaHEGnYIJUgvKtKVUn4SeJGkr4fxPckVjdJMEiieaIQnyjlAOAtDGjgxaU9CB2DHYRmFQCdcYpdowsYRNcmljfhHk3UF5K3FiSjJ1QDAVNxW7v8CI63Z7kaySg7drwe3froAMo4fkohFBMAVVJXE3jAOTw3ok1AErggUEGEooisTcAPpnuO40euSAf4P9J+ZQafpiTfI78F++/Dnn0FX4XdFQV3c/lYKIlaSapFSN2pkELx8cdit+U6fJAbDRFC6LgLINCKan+Ah+Q/PPocOCmF8SmTPRvkKMmbs8GwhRNvkAwx5d82oN0tyXdNKk/jxhYHFwRyDBB7wLwqEjamaNtblEGOB9B4Db12Bp8rJOjR3krxMGKcQMEIUPrKyhlm8feQ8GPqL2MFkRkZ1UhMfnhxFsTchejaWkAO27LA2gkzOEn3xAxaNxJVQZ9Bb2fS1EOgHM2IHHwNayhE+xvDXrL3sHfAFebQjbnTMvG3S+ZihQsD8WLpo4BehU0MIXVz4qkxI1/bAFRNuAo8TRHsyBDUXb4Iy0Q9fHvmr3x4D9jQdPAvnW2dAmyUZZstEdhxYkKTPOK8PuoT2kRu9XuOPezn5KhDw8ExcsRcCf3eibUrpt3K/i/F+7z9nuO0oHjPzfI8yJp3om6kf38Hoc1AY4FwBXIqqDFr0aJEFnLKIKHceuA0wbjiGG6gDZZaUBbvelpCv8ZuHUyObzNXEojGaTE6mlZNS76AqMb/VErNwrx7J8uUMoJtoA4F0cbS3AzFilD4G/Ra5fY1GWVJdHnjux0VSrrJAOK3dmA6Qd+coM6RaDOmIXPQRvx+CGC/Zxg/XrlEtwwwr5EEm+UBLUkETuxThPFvyXNIgMdSP5VBbZAM4xIQhxnCThEOEwgCS2MQmzqDKY4IwIF1470XhPKnOTGmuUy4M91WgR0S2UQ3diwusLTpHEwnZchq1XAmdGhwA9Rnazk7tDhQsshEGQpIlfonJ985QXoRBlsBSC1JARcPL3Z1tVFuXDhWsNFDcLOoiVA+ZR3ej5MY+x87sCTNeDjTr50c6BbFIqndjBoT+aWouG+6B9y04dVxZQMLb/CqAgI2jNoIK4DdzpaWXqJCLfy/TAY4igSYrkoV3yYxk8t/CxzXQikAlgA1ZikrzCfJSRhcYTltCpHJY85NROkVnAfakLzFkCyxVErPExLyed7PWTe3pBxR4iuHQ9mqOPFL56pD49KZfJKXkKPYUiypeEqSlrjE6bS0SR0vAVdKJFQJXpbxISmmyF5Y9YZSOMalhLxlESyRdxJsUuSZlUcuZa1QWVwSllSwfpVAvKXqTKpWy+eZNOqSEoAAdqfl9Y8sAk9ynwo8pDa14XlTy5Eu8teUt4vlHyrPL8u+UioAVfyt3MCsBWCowVIKgVJCvBUcon+HqKedN1W6zyUBE8ybgipakYqsVmKnFdirxW4rR+ffbaYDze77TUSd3b7g91v5GytpRKulff3pW0qGVzKplaysZXsqWVeWckADJz7rBQ5IM8OeTwxKU8++KXKyk3x5XD9eVUqmVZKrlXSr5VsqhVcqqVUTtEeafcmXrOpmK8jZ+vR+TEC1mh9WemvXsRqrNUUyLV6fS1ZqptXmqrV9q21dartWOr7VvPG2QrMF7syReasrmUHwZnu8w+pvb3pb3dWKyw1oaiNSGqjUero14a2NZGpjWJqLeiPT2cjxNFwy9hvsrHuDNtL+CWZLfHctz3dlFrU1xatNSWorXlqq1ZamtaWrrWVra13PI7gj2znH91+Aioudv3n7g9jpMMt6aKOzkDqW1w6nOSOqHWjqJ146qdYOpnVjrZ1CY6CYrgHnUj/Fos4aUgOOhdStuUAvqTHOXX7r+5h6g7seqXVHrT1J6g9RerPWXrz1gYZpY5MPbcLGMtrdkZM1WkogCp0MyjsVOgQ91m2BWZ0akpeGHFaKe7c4PbNClpdwpiCSKS0XdqZt8sngoochoo4ccXsdbVDBLPt7WSseGyHRvZN6zesl2nGdkWopUWoSKN5GqjcvSyHxywQOhPIVxAwXEbUUrC2YUqKhloZ/gdbNyLhkBA/gRhfEMYUMA4l0BBOLG9FGgrCY/lqMWZJoThnpBrEFwGE2OdSOwn4cKG/6+rB/MaaNMe6RrGYbiXsobDF5Xivdb+3/F0BsREmvvI2NnaHiD2s4tNghvqD7ipxDm+0U5ps1Zs7NbIuti2K81abM2vmpUf5qPH+dnNkW6oCFubHhbvN/6mLdOMc0tL4tZtRLR5tVERbUtKbdLWFuS1ZagtUWuEbaQRHtAkRWMr8QCPM1/jcg/7azYVs4zd5kJqHbulcPcqw8sJaonCZppc22aehciuSoRQGHaBOOzEsEKxNQDsS2M4mhraimSGLMe6LgNThkMVCac6NLlHTpjKY3ZbD0JkxLs5zgR2CrJOIRwU0GcEEaiwRG2beCiiCBTHuIUjAGFPIR9jYNMg67Q5iiDZSaiB4aIvlIX5ECipHXSzb1s4yYrp5yK3EJ/0xDbrepfEfqbepvWI7r1yOq9ajoR0o70daO5KQ8DZUvcp+woU6AdO7V79xZJ03ddOrnWU7J186indTqp206GdNOwdcGEVVAz6epPMGQ31zVl9bZy/SUY2urX1rBdDaoXQLrF2i6JdIuptdb2dUqyHeOqvXir0N6MyPeLM4NUmoTVxqNd8anXdrr11a6Ddmum2W6t13Kzhe/vdWV+U1mOztZxq3WS6od2y6nVzuh1U7td0u7HdHuu1Smql11Lq+Wa/2cKt75G8xV0O1VYqoj0qrI94eqPbHpj1qrywTO87mCIuln8buLREuT90e539cduejlXns5WF6C9xerlVCCR2Dydh660eWdXG5oD8V9e3FY3ob3N64qX81gYV0PnmdOBJ8+vjtHPkaAoVGUrjASGC66DNWAigBTd2Po+BYuPWQfa7K4xGdsZ4Q8feBss6d8fVcQuzvPt7ltVX6dQnhQ0KK78KZOrQ+Th0NEU77mNjUQuDdS0WbD6NHe/RdRyMXAyTFV+zORgnYogdahW2iDlDMAH5zo0wShDh/o2k5IMlp7EWFoPy65Lw6+SvWYUsZFgGB8eygyWONhWkytMaBnyRgY/024cD8EzA+AfkyEGDlO+0kISgAD2BbfxGQdGU0pe2fmgdp5pS3vaAg9B9MYyiYOhaWDmWnbYEE4O+SKUPB2LfloEOhAhDeBkQ6GKS2sGCt0+SAzUKiQwHX6V7BA6vIZGVcn2JWt8SNoiSfjyiZm9Ga0Rq1/qAO7C6FN/qq0ic/9II+ytB0CWtgQDaJJDqIPOGoTWt6E8nfkzU1daNNdiI9LfqwnaKyO2w0WQYv2GFMjhDKJjn0KG0MT9DTQATXHKE2CyRN02oI/vpI71C90UnR8i0P97CK1Al+xjlJMW0vt0hiI1bbRshI5DNtyk7bdpiX1hCcFq+qotEOs66r4hGcxjqZIO22CBqx25LLhvO2fjLtChl5N/NH17oXCE+kbuMGn00BZ9ZgxlHdpEGagUuT2ibKkFe3RTtM7e8I2bnODd7lyveirtujm40ovt9XfAX9vB4A7RZP6tGXQYx0ACh5Ve0aWPNr2LcW9fxl/kivamQ7wBYeyAbDr/77dMdzaunTSPbWFz09l/JKKXOz00r89aJovfSsrmkrCdqJQ6T2tJ19qfD9O63pLr91OGO+mPQPb4eD3U8CeEquPdHuj1s6w5RfCqizx53Qy+dwunntb0N1R8vVFu31ar0NXJ8TV7u8U57olOUz5dhsxXS72V0BrmZEfMWfrssPkhJTVMg2U72NkKntZSpgk+byN266+Tqp/k66FVkB9xeCfG3Uapl4FQ3dmfOPcyYFWsnFm7J5vhz352knxdvusXRmvybUlKT3fIPYHP77ir49hKwvVib2k4m5+YPEnZDzJ1w6YTjO+nUnqrF5y4T96BEwRCRNZ7qVz3XHfCowHg6gTilEE91Mj60FkzJh8vVCbrN1n3jlekeV8Zr2oDfjBKiwXABuN4C8pcfB47bO/VA7atR6PeWwOP14LTjS5Epn3sq4D6F9E4wQZVWEECYHtqXJYhlxFmqI4N6i6FNMa2Ghd/5CxowTPpnOrG/prmywftukmHahjDghOWdrsnjG/Oo5lo0bDaNmc8FUQghV0a30kKFzEk7cuUZknqcaj8kuo4/oaM+Kzk1+q5JwoP0bgj9ne5RRPrP3FHFOAF4yf1uY6DbwqiR0TExP8HUk0jk2jGVEhmnI5NFJm1PLooo7FV4Zr+mAit0wvRakJ7hlCfhba0E0azvh0UP4ZPY9ahOniu/XoWBGR0HDAShnC4dCUkHFzL43Q9UaSMftTNzzX8bkExFWbAJsKJQ+SOgM5L1D/JzQy90fa77LzqgWQxlrzFRa2qektKVwYvN2BctfBqyxIaMBSH1pWBzKeZYPF5b5Drljg7Ze8lEHTLjlycfZt8v8H2DghwKw1IYOf65L3l9zRFZctRXPcMV9pfZfiuAXEYFl5K62P8tSB3LQ+hK2dVyvOX8rqVty+lZGWZXZL2VxK+FfKuBaQd0V1KUFfIOwWsLTgV8YpdEzKXKtxhh4RZpHOaW6AapzFDpayWF59LNIjQ9UqKUsX/ATW9iy1tqP8IVNvFxpbWYI7I5hL3isS34sAPgiglI0EJcVfqvwA4jdEhI1YUYkpHxtow9I/x0mFBGqLORmi97Doup7M1jFmIyFeDaSSFtIFlbTRvAsR1ILSk6C/pyyO/6+IYnXhROeaGCKgI6Fzof9eMB7bhBAxiye5xO0Pm8NyIwjZMYmRYLl9H5uY2vs6Ob7bO/59GwwSXMLMVzIMzY5Bo3OSDKsO50cyPoPN/z5jupE88sbPNgKHLAN0FlBRyk/bGu+gAc1+pIElTgdeXQ4wfOONTljF058ri70uPVc6rVQMHYCZHLAmjZlZlU7/3h0NmMd5tk9U2bXUtmZSbZtFegKxWRmmV0ZgnXVzjO78U+S/aHv2vTOpmUz6Zttd9fhNb9ET93G/n91ROF7HTqq50wz051smm+nvXnZX25M+m073p9Nd7PhmBnEZYkEM1TyDnhnFV6qr3dhu1WynneBvYPirsDXJ3EzKpk003aNN66zdfvWPkKetPDRbTKfCMA6d5Mt227Fpy3cKZtOin7dbuyU1PbtWamdetMvVa7xD6q7lThpnXT7rTv+mKTed+ZkC0Lthmw9jJhk0fYnZx2OdbUHNe6frutcuT6d6E7TqDu7CQ7F/XM+HZAwFnoq6JkvRibx27S3bIPPEwme9uH89CxJoSTeuttDTbbo3ebnS0nlN74HWK0swbfLNG2Ydh5Gsw8Ix3+IxzHelWyVx70zmLjF8xlD2doVS3P1rXIc6QJGveZubj+s7HMZk7HmgFp50wcLdpTrHVzogrY1Bue0RSObb27zG+b3jk2KZHRn89TeIXFNYj/Rm84Mcsn3mbJTgp864N4rI5sjcN3I2dnyP/y0LAqjC4ymU6pCZWVRsrWBfQ7g2NtkNvTh0kos2H792M2izsMiPt3jFzFwx7RJY43W0Oo2oixNsZvPXOJQRva7DZ8X/7QRQBiEaddANuHNQHhzi94Z4uda8OAlwIzikmsUjVD/XPJYZfmvIHGDPVsx0pcJtGHVL6I9S8Dvq27LqriyuKzIZ8tNW2DLVyQzU/2V1PKUohuQ5FeacttWn6Bjy4zE6eWWKrPTgK21diu1WOnZVu0d093yEoAAtncuIMQquzKBuFas+WfrOThaz3lIGB006adCmJFltI52fB5eQUmqTba01A3ojDF4Rlqc/Ou622F7Gl9lZSAiMgP1ZXTZ0zER5kbSNK2+MP5hvO1FejDzxa8ECQ1uLPBomfspsGWwF9cI3zlmNbyA2AafwvVBiQqFIJCwkX0ycsPeqaXOk94M9MiAiMA6gvcX4LvwI2ZMRZ0+qoBB5m/gQfMv/jrLllxgLvvzrnRhRPBnW3rouUfyX9oV5/ZFff3hXYrjlevb9P0Zu6hmhZsnfWKH349SrlV8fdVfKu49Ju/XYktBuqKJB7QDttPbLtSnjXRrk1+a7NeWvvdMu01/K+401Ukgx157qaZdfN3jTLdt16649fev3XfIRVRCU41hjnXL6jMunbDeZ3fTEbjO5G5jfRu43Io4MLjp/Lqs5G6EAogowDtpms3mbnN/7bzd+2C32b0UcGExVv4HmnUOtuNULDejLb9Zi2/W6x0Nu63jblt82+BUflbWpWnaH1cJsEuuRfbgdw+v7dDvB3hLsd8O/HejuJ307qd7O5HfzuRnXls6s1ouFeGMOaSl4ai63cbu0Xm7nd9u73eHvd3x7g9ye/3fnuj3p7oDcCquteO8Lt1pIyhrtFPvIXz7qFy+4/fvuv3b7n96+7/efvf3AH/99+9fc3vgLJj2SdRr+fQfKN/zqD7B5g/wekPcHlD4h9Q8IeMPyHsjTe9kfmSUOlk552xqI+EeSPLzsj8R/I+keKP1Hqj7R8o/0fgVnD5mw6CUEXP0F0m9j2x44/ceuPvHzj/x548Ce+PgnkTzQI2cjk6uvZ37WUH2efzZPum+T4p7k/KeFPKnpT6p40/qetPKnkt4g/1sf9KXreXkLjtdvA9Z+YLoz8SFZ38r4759iz/HhtfinZ7NM3VSr0M8OfeQLroe96stOjl3P2eEk76c3sB6Sm/nneSSEDuZng72Z0O/Z4C9gOz1EDyUFA+QFxeqXAQOd+9efVhi31B2zT2p4K/5eiv2n4r4V5K/leyvfIM98BvDqgb2R4GiKqJ6E/NemvrX4T+15a8de2vAnxHkB6KEvrRM+wDDdiCw30eaPY3uj+N6m+TeZvE3ubxR9+eYf0PWHpb2h7W+reNvK3rb8t52/rftve3uD0/zo/12uN9LwJaJhDcge+vV3m74B9u/Ae7vj3h789+u9PevmeoYT7JvM7siCLSmy9xe+q+A+r3AP4H/97B9A+QfkP8H9e/LBKf9NsyQzS+rcIasZ3C71H5O7R+Zf0f2PrH7j8x/4+Mfi7hsabR1JRCUL36nYm7Sbe1uaf1Pun629p8M/Du4ngwuMBNGbVdhJ/BZIW9zc8/83Rbvn4L4F+gPgx2jIBRHUUVOLy0BRWN+G9l9Ru5f8bhX8r9903v3+0iBDlKGtW1FPXuvn11699cG+jfevqNTe+d70KDZOjY7ZPZt+2u7fFr23w7/t9WvLVwKsnpcBvRP4MQWcdV777Vf++NXgf9V8CtmQ/aKAKISihK6j/iuY/or2P9/Zvfzc69l+Nl6n/Zdp+8Vezwr4c+WLokTnYXumxIha9XPaJtzyqqYrS98hxvCIuTh8+AXwKC/6XucAd+5kishyKIb7Y38L8KAXvq6RI2x2+DwuQZiLyvyLbnCg/7czc6wstwLj4Cu/Y/iwFj458+xRMpLlOR43n9ZWAEJy2BcoM3863kIO/uKReP3+eWMER/jZY01P+dXD/Uyosdf+5CEoAADks9H9v+H/H/9/1/8/8//v/f/3/wAH/+QAYzDckcqCyzvAilI/LhgtxuyRckcAbAGEOfJAkIywfwJVShC8AaAEYBWAV/imkQrDaD3sVgvkzmkwqkFJEg6IB/i4BJpEaSUBjzO/zpAVpIpQSQCRFTxAQCJDQHUBHAVQHakcZGOAsgfzJHZdqMxFkDjADzIsQIEsZBIExkUgbJxKC1zimQDEyghb7a0lkpIE8BqgeoGgEvZI2TFc35vYSCkuAvoFs+HRngq1KWga2RmBPZOYHmB/ZOKxtyu9qyyog7IMaq8YshF2RWBlgR4FuBPZHeT0g1YFmRgMGAO/xdyynDbCBErIMES+BF5FEE3kl5LEHRBaPI+TPksQBVR8cN5skTDGuGN0TRBPgTEHZBcQbkE4U+ZGvQPm66CDinQ6hCN4PmyRDxZoUtQVhS4UdQbAQdiuCgVQZkjgTIqX4TQhRxrEUMI0ENB9QX0GDBWFKJQwYR/KG7lEY4JRyHQQrPFC1EGZDWZKEElEsFCUywSMG8UcxvFCUcMQPJROULhKG4c+PUCXQvmKwScFrBZwZJRrByjCQxxyngtTS4AVlF+SlY/gbUYba0COxggoplBADmUdGJZSYgNlLgzvE1HEo7hGVkkMACyg1jQi5AMpKXpIQ/jAcRo4BasrLiBm/F26v49RB1BLkHpECh6833IYwUEpgQP4PopWpxrXovCN8FgglrJo4ZIXWqYRoI1TPSFm470Hq6gYNvEOCgQIVMxiziM2p+h8c+VDL7OOJVPDLParXCC4RBYNgcQmI1OK+CCwXXOghrMbTDtDJYciHcGAYHcC+oHy6xHxDNEZdEE7fIf6kYbyuA4LKxMS6HFjz7AtRK1yoY24O2qUcZYkpJwa41khC3M5whLIaUD5gBD+CUQgVyoA8RO0QSEOoDCELUIsGqJnoK1PZRHAqGnkyZEKUOGa4Ar+FnShEtwgUBawuiESyBw+0LWx5E4JPIR6wmQM1AmQgsCZBjAjoV0iXUSuCMDNEd1BnRHGNFANRCsqIAfJfBPwdsJmU2xAcgBSkNPtQC0cEKM5cAFtK0zS01NNbRQ0BtIMp8gS5tjQjh3Fj2HWWTwP2Fa0g4VjSjUXYaOHthfLJ2H80q4ZVZsMRjJrQtMi4bLRTheNGuHwAw4SuHThY4Vprzh+4VbQbh+tBeEnh5LJOHnhx4duGsMu4ZbQ60d4bjT1UaCBOHLhm4Q+Fvh14VTRLhtNPeGvhf4R2HPhgEZBGzh0wCBHa0Q4d+Hy0HlFBHrhx9BUIOkoRNcG1mgsNlg8UFFpiiu0+xpkqZO6dOEb7AkzIy5PhAERBG/huiEoDv8RoH5p5EaxDoSCgnhJvSWIjwiWFZIydPY5p0KeMdrJEyiAGbr+CRGeGwRDEeghKANANsyYglxE0LYR62jOIQcb9NCHYhFYf3S7qngI3SSW2IPtC2E26DQC0R4ET+E+IjEVlLCgmjMtwZhQoXMa9ERRNz5+huoXBYT0ukYYwmhjxjJzLc9hGlB5Eh4S+EyRUUNSAHwKINKC2ETfC1wXgRwE6Sw2AHCCjCc8sJAxVmAZjny2EGeDAZ5+KEbbQzhskdEBPysih75fkmUV7YScBxNPwykN/gpj/070qv4m84wFiZgQnYAywwR9EZZEFR25DA4TcIGAXSkhqQFDBu0xNovDVhJ/AkTrEvLjSCboyDusi5R3YZeHBgRLM7y1UhCF6CssspF24WE4JFDA7ESjPtHCMh0QIwp4okctIaM+ENYRoBdlB7458hFJhjQ8PxK+C7m7sLczTM26MEgmCUCEgra0XlJQ5/ecIfYxWMQMYDG4OzjKEw/kVPLLAEBa8J8wQCA/qYH4h+Gr4Z68dISMwdMAQckTsgKMU/I2U45AsRy8OGg6S5MDIcTHZMVTOjz2yDTMUwLM7zMsyLEa6DaF7wBsNW41adIWTHKILclRi4M7/NuCVcCRPQo58I8kopoxIsRszyh4sZLLGgCkYFwGqJTNhBlMG/D96AU9lJKHpGRhuYa6IAMWJjoQ89AkA58RggswWw/JO8C4Mw1H5E/MVzM6FXMfzACxpywLB4yykZ4Bz4yxJ/E/Tgc1ODsSF4tITEhXB6iGCAScFMgQBku8gV9xaEt3MmSoskcUSyEsQUlwqYs5LLZxfMLXI4aqi4Ic8yQh8GoGF0G0DINFPw4hMHz7gM0ZDqxGPUZWQNhgoeBaahuxNPieEoRBYTQkBTIK47MoMsljpEVxmSgss0Fo9zvAVlDdbvQTEilRNOSNPER5gSRA6SpECQPjEWgMzAkgHwHDprIf2yQcKyD+vwQjEXo+VNpFT4rkcJIbgPRK/gUyCBFZQUBIQgkKMwUrKIJLaThPKx7A9GEWoKgGSKZTT4m0DsSmRHgocSE4J+syAOgiqJcaMcaUKyLqsSQF9bhG+GpDbghM2LGwAkliG9ygk4lvQ6mcw0uaCBcpRtzAGsCxDCQ0EofOkhNhqmi0SlOUmM9GxsGSsSSmGJhv8CJUNYPkzSiENIxwngL7F3RkmnIi4RUA4IG7QaW7GFnHwRBgNQwO0mVJShhsaBJGxvhGDEPR70tKAInoOQbMInIwoibQwgB0oNQQBs+BIRFcJ0iQVa9hGiaomaJ6iVom6JOifolqJhidolGJkWoSgAAhrQZ6JhVn064GAzv6QrKAygYlpwRVp0rnKdcjpImJg4jYnBWYig4lQKxiXQguJYym4kWKOyiRgZOeljEQqW37OU65U5hlU4RJKhjNbH8c1vSLGWCMGJDVKx2nMH1KxHDj4jRI7CE62GjRuE7taSYX4YpOZIk8LWGxhsuRhO9hquqROJ1hiBnWv0BH50SCSi9iuxJyFD6Fsb1po4fWHeoRaCaA/qRYZG5FlKS1J1FjoqfWAoQxYHCTFvc63amUBjSOKrBBJwuKj3oWwaO2ig/R5GNRGtoQWVjoxowWyhlwrw2SFjo6oWRRvo5o2CILIrMcCxJsDeM/Cnt5fywjrnEHAuCuBqKOoxio4OSIsOgEiOOse0b4KVnJI7+ap8YDC0K26Mti1cMXswp0eX8nQ6/y4+kw6PavDjsaZcAjvsb7m8CbzbopgCksYmCoCj3Lx4uAoMCIKQCuMAUEwnm3pwJytkfLAy0ttYSPGVDvLYjWODkcZMp9BGVw8C/eu3GlEqJKgE7QOxCfLqei6uA6gikDiAKtmRymUp3+J/qXEdmrLm1Jby7Dgv5GAkXmvzRem/M/bypcyhf7UK6QJnpUqkdoWZx+RClkDqxOEKAZkpW/tUBhuwXrnZAKSMn4kKp6ysak72uPCHo089JkH7mgVzsHpA0ylE36mAXntHw+eI9gak3iRqdIp6a1ut3bj29ps74aqVxEDjrANuvWSMgjzo6lu6zngrpV2nUnGKhJsaYqndiupkzLh8Bphlwm+KpqSySythNLJ0sYafIDWeTuCyac6MaRQrlpygonaQy5fJ6ZK+IunjK2yb6rgxlyFfs7aYmJKjGbu2c8u4mRKvaY0wAOXtgfyvYsPML4Jijch/GJmX0puiTyraQoB62aqR/zdpPSp6nxpnwnDE9S6DhCZM+J6raCNyaIflCrS63EemAEYtpJ5kOBAv9qDmctr+rkCl6X0rupYSSlLCS94jVbCGZ/iVYJxqQRsYseGKWzYvaOKVCG3yFStMolppSmBmeS3iR1bjhVZLh4uc+HrjYjGtkvowXaxwXGkgZISdhmXK4GcWz6StibmlLWgNipwQeoFqDYWOikicnQ2VilQpXpC6aWlQSQkoxl2W0GTVFmWl1p464WcYfha+OIycJqBOYmuhmnK3Yuem1SZenhntOkmaFanCK1qu5rW1wj4bJOe6rhLLp7osuLCZHiXVLaZkzrpmi28lp256GPbhVqlOMSaQlxJdWoBLUZmGR6KLp2OrZnjOGVhJkEZbmo1YzOKVvi4WZQmXRkiZDGfzoTOoWe27TO4YkT7QgvmfFJYZ3SppmP4dmclks+qWQFpDxJIJllnK2WRMpeJwWVBnSGMGRda2KEWWlnNWAYGVnqZoGfRm4Z1WbU72ZYWTlYNOkWelm6grWZsoVZqyotHUu+WbVkOZGNmFbMGA2c1mlZMWRpmBZWmV1ltOPWSln9ZTWSVkZZS2e1nxZnWRBlMZPiQ6msZ4WXNnbZBSX4DDZsYv5nWZuWUaKTZdiZtlJWjTldkZee2bRk5ZFSIknZKUSVFKni1YBTIvs6wG4yVeL2Y1nFZ72ZYA3ZlmeBLfZihEUl1JB1lDJk+PLphiyUmzAK6fALXhDkXZUObf7AZfmVZlxZqwvY7TJYRnopQQImFmBt0rILMjAQ9kQt6FZW2QTmRiwErv63ZJOQjlnJCFnsnaO8mvt6bey3njm8G82TtlDZn2aNmOJUSECmfJpnBTb9glxGuiZh5jhRx0ub3imGi+fWa9ni50OYv5S5d2aTmK4eKaimfm6KQ8zqsFMgNFGazkY6xg+ouWIZ+W7OTArH+bWV9mVZVAErbsCXesfJluU5LxiyukQawZcS2Piz7GonQfwoU+eSYz63qSXggIbqUOsbY7qGDrAISWNtrKl22FZmg7Vm96W24s+yCuz70WKekuD8+MJg/YFyMXs/arpi/Oukr8sJrqmdqd3PGZrpSZpukpm4nm1DH0EvhfRdJ/IYr41qzqbXyupF9knb5qQ6U0DZ2mai6nZqXOpfbj5MMl6aVqavsYKrQ5wtr4iY+vlrreegpoHyL2tdvqYN2KxDvkd2e+ZWnL2Nab65m+igctiW+wENiCppLugWmV2xsl3bq8dus6gym2pgvZv5SfDrIpp4pm754sYkNuimIPvgH6AyNnmfYRyAcnvah6tPB2kumnOrAWiqfqRGbieoftAjh+4TGQGWpRvKZ7Vy5KqakR25cgDyvcc6SDwUq1/G/bmpi8UyqJ+48sn6suSDgZ7KpcDpVynpKKmwXoqmKln5FeOfhLA5RFLpX4fexfuaSl+hAU5QP+R3vR41+7zsC6pB3hH/6LeyHq34rxbch34Yk0hdbyveSRrC4rxLSfELaFnnhP4r+DCVi6z+GLMYWLZhPvZKT+a6OkQSRwhQX6dIsOUAGuFMWdYX0IbhV4V0IPhcoWGghKAAAuliVxiyJfpNTQiynTJrT4a9DAEmJ0PCSgwRF9TG0wxFijE4nzUiRXDTJF2tO0xpF7DPEUL4WRcLT8kKRXkUXo6RZ4k24xRSbSRFEskQx2ScRVYlxsNRd/R1FqRRUUFFzRaomtFYie0XlFjRZwkZFo5uEWqk/RdEWdFHDIUX14vRY7TjFDRRRlNFwxfVizFORVEULFsRUMVVFTwIbR20exbsW7F5CSpGZq1CVzpMSUMkqBikDNPsUHoNxdcUHFtxQ8X3FjxS8X3FaltJiER3IfICK0XlL8WWsPxf8V/FB5jVSHxFoMgk2kzmUKGOkjNECUAlMJYCUIl8JUiVwlKJbCVoliJdxaTMsFNxEeUvEZWAAQBJbqzeUhJUxQklH0o+RfxsQD/Hkqu4FLEp82ZKSVElZJcyVMlrJYyXslxJWyWclHJSyWqRjmupFPRglj36KsAxKKUKsYpUlQilDFkfE6kJ8YFFxKKRYAIc+UpZKUSlKpeqVqlmpeKXalqpTqUalOpY5EnkLkf9lERCgC5Tml4rBaWDkVpS5S580iGlCzxW8FLZfkrjPh6Wl7pdaUelNpV6U+lnpX6XelfpTFEpExQZ4C5hAEsYBJgkZdyxRlbCDGWRlzca1CjkHgOLYmIygm/hkB0ZZmWxlWZXGU5leZdmUFluZQWXVsw2pYSahrSO8EKADLNWX0stZQyxW6rBTSzKUsDnWWtlNZe2VtlnZR2XB0/US9gPoPoSomKAwATDC0Ym0UJDbR9lLtFHRH5IAGlE30Q4puhXycZogxs5Y0C4xhssaq/JRMZUyrlUQHbYCxmIELEc+oscOW/QRsaaimxy8bcy7l0FKHGssLRBHEos3ZV2WbyRcXNxNlPxs+VflL5d+XflDZVwVyR+ZUWXAVCZR0KkuilGRQ5AFFC9zAVQFXBWFl8FbBUIVsZaBUE6bcdrb+lvpQGW2l6MDPGHgc8T1h+ELpWEwKKWFWRWYVFFdhXkVVFSfb2lL3HIgyg25PqW6lLFcxWGKMpRQRylo5AqXKB/VKxVal/FXqUCVzFSJXCVYla5TsVikbKUKwUKRrncl8lbyXyVNYNJyUlM0pcZpkdJRDwMlClVyWKVelbpUGVPJYZU6V9YCpVSValREzRA6JciXWVKJSFwgl54puh+qxqK85Ql3sOaw2VGJbZXeVXlb5WeV/lXZVsRCAkglB83Vq8V3FEVdtAzGDYFQnvAENMTIEyfZVcWRV4VU8UpVzxRlXpVWVUcX1gsVeL7d+tQKsVjFZRRMWDFBVkVUs002SInIM2RcVW5FpVYsVbFCGhVX3OCmKMVlxJVRsWVFxiS1UkybVTVUlFMtOsXxMmxeVXtVrVaRjjVpRfVVdVXRQIa9VBVTsVTVQ1fUUjV3Vd0XcJy1Zqlswy1fMVrVc1VFYLV21YVUGw5IYBhNhQTGmD9gNVPaBxQU2lPhCEUmAWHnspmlwpxRVZoXIOldyXVk5UwVHoz4htRISHWENVCJhJEfQK+BfFI+BqCbQr9Lfg/EC4AUROM4QS4xhMkMcdXQEvIULIo8z+p8TLAhmEkTSUFiCYaKG0CfIRrEEYehAY5DFikVFMslRwodUgsp4DdUQwhY76R2CWGW5AWuT3ih5EYF5EOkWZNGFbMVJZ+Sayi1bMCLULGNoqrUZAKZEPwsNu/TjZmmL6G8it6Z3AIiNsWiCAsHjMdxi1EwGWELom8c0r3V+XA8JU+4ZTXGkC9DuhwhMBcGJAksWdDlEYV2xSijEE6bmQSIEn+NaTjyLZTWXO12IbAlLSyIfiH3suAigjdxmtchV+1eoQHWFETLhQExA/LIvFCsGZJegBlUdXBYx18BOQSf458ZqCXxrgNfH6l6dUlGZ17tfHUcIACYkHj6lHLyXF1TyK7VHkcdTqRsgbCEaw1kWCfFDWVddfBil1tZB7U4QdCXawPu17EwnOsexdMW7Wz+FnX91TJBQSoEkiUIkT1rSr3VN1wdTgHz11ZlIlL1/WA3WB12dZQRz1uBJvWL1G1d3Xb1Z9afXn1V9ZfU31yxdfV31t9RfWuWhKAADGoRfQhBJjBkVlxaUdZ/W0oQznlYLZhiX/X1OuuZdkP160GJntWOmWSgANb2cOy/Z01v9lwGZJhMF5O2htwaFO3bui5uZ34kNZmG3mWNbBOyYYJF2GcCUdYwc+stE6uG3Biu6eGRmWUmYSeSfxZVJTVS8jBGeSaEZbCeisXmGKCyX9YOcMmSvFyZD7gRb3WxFqMkBOomqaVWGOyRcn7JJ+oUZCKtySgkgB4HktqmOO0HcHcZ9RtY4qSzRpjKtGIKZ+aU2EjrEI02+fuIlEZt5go44a5GaAmqOV2n9gopY+ubnhc/Niw6C2bDvakUoTHp76IZ65vq78O52JzYHGDKT7mTmatnylnyc5oKmUopDpLa/pMtpQ4AZLxt1xvG0qcl6Z50Dt7UTcjtun64qLBbPLZ53/OCZm2WDgGDapklpdI5mVBcibv20fngUu2s6X/bmeNeb2rL8vtiL5ky3pkPkb6s+SgW+pdJkH4QFTplAXEKEcv2l5qg6YvlxuWrtvmRpu+VaaJp7+Xaap8j+U77muz+d/lK6NdoqbVpR+bWmRqpdk55f589rs3+qepgc2syhvnWmeuJ+ZzJ75v+bbprNfdsa4x2kqqfYTNlXFM0cm19qnYD5KvvG59NQZtjwF2qBcM0l2ibhyoEFZKh7ZHSBJp01EmvPlun+2FeTU2xedTfma0FCfrp4lm+nsU2oOpTXenlND6W261u8ecoojSdtqiotl+TQirAqCTQ1xJNrKf+n2Uw5hrEJY3uROYnGUTafKzmWtixlSZcGYlxcOLNkhlBNMGqhnwaeXC42zG+gpPpqUxKSApxcH6c4iEZ15nh4KKpGadoE2FWhMavmhje+bGNiuWCkb65jVI501VVT6xAWQNhxkg22jdkIQ2vGbY5CccjVo6Scykbo43JCnN9UH+Z2dEBCN9EqI0KZqRpI3G1L1oRzk571jMlP6vDVEbS0iyVOks+dDQk4YcG1qZnbWQpVYZI5olkFzkNjhlJbUNMlj9WsW3VgpZFOrmQRruZ1WhU40OVTuEkCUUBkknINBlrUpGWC1rrUsATlnrkQNiuFA1JZU2b1kNW+OT/X31/bYlkhZQ7Y7ldOUWY/VpWa2f05CtemTrmQ5Y7fO0TZi7cxlqtmBLNli54Db/VPZy7Y5kjt+7WznjtIDaW0Btp7U7mzOyxZe3WtQ5edlnt67fe1HtO7QIA9tB7Re3vtXbWwBft57Ru1jOR2eJnTtLOWA2Adb7Vu0nZ/rcK19pa7eIaHt0HfhkztwzkA3TFD7cO2lWrOa+1VFmHah2ANEuUB1cA+HeHmk+XrU8aU+86McFkMbkWw1vIOyDqB8EQie7T6hi0rHWZEOfOaTvpf7ao1PEbPnxX9x53GMmAQy5Mwnv0gjvR1dID0tAbPS0gtQ47pplf2BRR8/CW2Ptn6dEDbothIUaZqgSteyMYCyFiXHceCRIR8EkNXqELSZFmE7G47WIUTKViVazxEy5LB+3dtVZOr4+q6+UUjrpWCSaKF0kSHglFAXNV8i5UIYaZHkkP4FnQSwIEKN5Syj/C2m8da5TfkblU5PfnI1ewHxohlfncdzMJlZVYYWyj1vQ4bIHcK1zppJ9lmnOyx7TNlKA7viAXAy3vnJSPkSUFnTLCWJcuRONZmNPxrETrVjwxAScoGmpyzzBiTCFIfrgKkQh4OmVUUj6M4T4U7mD9yEJQKA3L3WzctIS1c3HfPw2p/wHamVd9NoVGMFvxmTzjAiVKdA1gJdEISK1X8nFD2gmQqvKfOG8oXHIO4XtCDqeAhfVzksFbB7ljZ6tDFmPyIqS/ItEb8oV7BgwniX4gyZfgsxw5iUv4ns0MWfAqtIVKcfQ0prpVx4yFFHnIVO4nzrVT9g+2TZkoobhTClGyDCgimzszOZ54t+wEG34aFizIYrY9D2VchuFDySeBPJQ9cqUOuSHr173eMLrMhwup1vELLZ53f4huFdiqskHx31pRyveiPKYUYut1hYWiCn0jT0rZQKG4XtJ8SkUhN06eaD53qBPnYUr+DhXWGvgsWTznYobhZklpJ2SewS5JFSbYUC9hudzme5UKG4V89X3UTlZZRuYb329NvfDl290Pc73lZrvV73m0HvZD2WK7vT73u50uVD0B9ofSNl+9n3dEiEoAAK6v+4KnA29tOeN84p937Xvjp939Yh0h42fTh259WfSgYdurlZW04N1bXg3vF7CQ22PhFBqm2iNXFphzlJfFpUmPCUneJ7fKt7rJnwxPjkMJ+Oj1mMnKZMjehEf6RjjeYaNkHlxlOtxyVtqnJsSN86Oc1gsRnatNSmRnKOFGc+aDlrMN85+Na5tsabmexmhnz9KBky13G/Zqy2y27LdQ6ctrMAU0Z+d/SembyZ6US1gmJLXuoVNxIPH5f9TTT/1RmLTWZ5E6LebXlt5IDh3m8gfviM2QDEA0q5fNgqqPkDpKdmeSq+jni76bNqA+gOO+Zrts3nN8pns1XNQalWZ8m8zVvkkDtzaQPG+5Ax3APNPqk80rNf+R/nrNgBYF7DpLA4C3y+7A6wOlqILdvaDNtJsHLoFlTai1C+KLSINl5Yg62pRej9lXlWCWLWamkFuLQl5ktsecoP0+5LU26UtnxjS3cF9La3rjt2Dty3IWvLW/rq2/KbE0YV6nXoPIwcrQw4KtzDsq0rGGqVe2WDhWB8nicJrWI5mthCt0bb6Lnc4OCG7rYfoKNKFqfo+tF+tt3EdgSf0lcN9Djw3fWfDdEaHgybREMu1ubWQ2HWhbcAbFt4Q320GgiDS9Ve52TvAa5OaSZ23o1yQ0Ea/tZQzkPsNlQ6dl+DwXbUOwd5Q/VikdzQxPitD1Q6QaNDTg20ND4HQ0/WU43QxYO9D+oHkOUiyDRm5NAQOfTnqUqNTJ6A9Iwz3UkNtSXm2+KqOW7W25LYILXY5rXgMPOJUQw/pOOxJTTlgWQNPK710txEin1DMSPBYxt/OZ61C5jw4d7XDi+ka3ApS5SY1K5rgCrn8K2jerlMU4vS8Mtw1g4eZ82luY+TW5L2OqG0u0PosMBcBg3g7d6/ubMMGuhAOHQ9J8nfklVZag0oOqDKg7iOtuGgyl6bqN6VWam27/WjqJ6Qg9SOiDwg+IPZu6LWnqxe7TYi0+2yLQzrMDbA5wMcDXI7yO9NU+QGbD5s+b80emszbfYD2ZA5KMUDUo3c3kD1A755kQ5+XXZq6hA0aYnNGAxs0ajaA5gP5pZza54u8zzT3Zimkph82jNUA2aPQDx9rANF8vA0XYH2mrtC2NNTo9/3OjorrC2xmL9pSokFT3HQX0qxZvf0Bjd/UU3Fx2g/Xowqp5Ql03lHntrlRjkYxGPIu2zrGNVDrnUmNxjqY8mP/t8Y+7gd9WYxmN8dqY+GM3llBsAAAAZu/W9hHeCphbcNmLFidDnmJWMXQBmNmgaYew2FiN4zWFWPWYQWL9hwjS+A2NCgTYw2CnIfEb2PyY/Y/pjVj3Y7WOtjCWO2POYnY25il5040CPeYc4/tgLj0WEuMjjdY39hrjEWC5hAui48OM7jQ+OOOuYm48eNBaeeCQnK432FOifYP2N2gSwvaOrjTBqWOYhvY943eMPjX4zRDWASeB7HCR0OHDiI4sOI2jFo6eGWjg4laOVhQ4YE6BMgT8E5pCWAYeE0HewuGIFjk4ZOFmg4TDOMsxM4rWKXCq9WEyRM4TJOEFAoT0GEhgZc/wJzg84gaNzguodkDjieoJCKzh0wDE/RN0TnEw1AWAduCv6ChfAbLjCT5qAagu48iOLjDQ3viJNWoMuBNC24xuBhBUY/GHriqTuuBdDm4CqEdCywoENrhqT+uPpO3Qx8E+NPwfaGXi5jjQCAgQTvUBngj+6Y7XB4TCaEzj2TroXVBMT2OIHguT+qCDiGo8iF5OPQmk8YgWTLMJrjKoek+pMGTBiPURGIMoEqi6TZ0IZMRTiUxhWSTZqLJPpT0uGJP4V+4KlN9oGU3JP5TLgEoCsTbWDlBcT3ODxO+o7kwHiO2ocGxNlTlUxVPcTzUyW2EThSB1ikT5E2ROZojk0HAnQ8aERMdT3U51PYTXUzoA0Sw0GVhI1KiAhMI4SE7PDWTpsP1BSQEOLBPvSc04hObTG014Dbkz2IEr7wmQL+NHTP4+xAmTJeGZNvjZiAMhE1P2LdPHT3404CHjF4y2OzYZ409OYTW42rSPTUWB9OXjr03uNJYA45OMxY243NjfTg4zWOgzq401jzjjY8DOfTy+ODPwzf032MAzzeOeO/TL0zlqIw7082PBY/WG9M/TeMz2Pz4SM12MgzA+ITMQzU41DNz4u0yND9I6WIdMnTqVAPQ2IsmNVWp4Sk6vDYQO6KdjQQtxavgTTiiGtMzT8080hVRGiLVj4wdUZP6CTyk7jV9ikRGxjYzcAG1P44OrmNP0Y5GOkiOcwiGRJUTmcDRO7oz6GkjdYkIULPKAJU0khs45U9BqQYU2K0gQJeWaehewv6DmB4Yjs0Ig49pM8oC5TI0LJPrYSs5yFvojwABOS1QuBLMsYNWN7H741IMdBhTCU6qh8zz2gLOdRdQNeNXU2lJlhszYohzNps10IFOMV2eLjNDjWMyePEgC0FlNyI+4PHilzkMxXOI8zCPUjMTnkyXNEzZc/jMzjmCDgjRo+E7Hjtz1MxTPdz6plZPdQIuH1BGFg88jPlzI89MDGTxeGrjjU1uPXM0zjc6Rhozw2HXMdzDc3PPIQ449vNDzCMyuOYKm8zXjTz5M8fOjje8zfMnz689fN3zt8w/PPz986/NPzb84/OfzL8+/M/zX8x/Pfzf82ECEoAAM7ljRgP4V8wOfc7kniruZf4Q9syh1mA0nhe7hQLd7Zr1R9XOZ72x9IfRzlu5e/igsF90C22KB9CCwdlILGCxX4AduHdFkULBvf73eFWvcv4kujhbaQzl7uFg3laFfTYb4NdbfEk+ZMWSb1ZwZvYwkNKthUR2OpkvbUYgYMvTi7TI9fWhLptJmcw2t95mbQvK92vENPdJsI1V66FnPXhaXohhZnhMEQbd45oayRlxxhtSmdI1cSuC3AtQUocML0ORGyZrlVeZPZjhAuPdCC5kwY/RUYrxnGY63raDGrP18Z9PTZGM9+Hi8koWbySW50eaPdaAY9DfkwTWN8jjq342Yxo40Pqti16n499CvCmb8iKQx5A9YhaII3OkhUskNAu/dw6s2krbsbStnsbQuw9lKdYLIKtKbjmw+2fhiy5+WLFa0NAp/X2bGCyTcQJX9HKX+puFP3S7yipr8uDmd5Sfvt3MFBLYbYfdMubFRXdNRjd3GCd3dNEPd2Qxp1wAmBWN2WwkfvH7uj86Y73GGjcvjUecrcmt3WpgsLandyOy+q3VdwBczZgFXMeaNpJxPEgV2eZy7aC4h3XQLWTxYelaADdQLMpyPLu7duTm+t+coGpdWo+aZ6jcpirLy95spw1Wy6/cV0bUdpg7LDQ2aZZV5jjQO51r5Wvl50yjCavKPRpKKzVqhdWNYEyRdVZg2kpQTaXF1+tPQye2XWWnRvqS+rBNL7cj1atwMj5dC7H1sdVneBw2duMqZUOdE6YsxJDMY2dSF5gnYCDCddIxIM6pUg3qnXSVK6Na36T0hogtEDXMXjKVynWCWHpaYy1TkdUeRehUdOI1CZEj2TWNJLL/iYx1uRLHfNIxyz6R9VcdRss9ngdCHUQv8gDvVquLqA7VO0+riY9h0Qd1Cy1kkL2yogurZIHdA0bZvq6O2F9AazGsXKZC/GshrNWWGtyrDWSmv+r6C1kuCZZy8GuTtOaxCufte7be1ztNhcWs0Z4fcH2iZ5a91kFZ4a/msvtqa0WuwLXqaWvNrfoqGuVrKY6u0FraCzQv1rxOVgsy5ZawOsVrvg3x0Z9kHd2vWKva0Gv9rIkq2tgd7a/B2jrta7tm0Lfawlmzrm67mvPiN7bO2DZUIIGuOrTa0esbr62W2t5rO652uFr46z2slra63euQZJ60OuZjz7TWuXr9wNeuNrOGUFkJrg7aev+S562h3iLtQMBsx906+uvfrD61utPri61Gt1r76w2sIbEfYdnZrP6/Ot14qC3uuS5B65+t4bLayhuQbS7h2sAb6HVevprAWfz1VWyHTA0Ed8DS7krrH6zeugbWa5RtLthG1Qtdrb61xvYbtvdgtIbx2Sh3JrL62OvRrZGzxtxrLs+BuDrgm9WsXr9G0BuMb92Qr2PZrG0mvbr6G8JvybE6y73ibiG1+tSbbGzJt0bsG3OHabxubpvri+m4+tnrrNBavk+VqzHmKENHSUDkMaTpwDXrpIybbQCtZniOwQ7HS+mhgb6ahtubVggJ2KxQnbN1QwHNeJ0gU+xk8JK9xOq3mEmPFjSPJmoCKhLGr30qasEr1LJys95DkbyvaxpeUZ2w1/2cJwzSgvW6Zj5MzTfZAt7sqOnQy46baTEyv63x1kQ+gMSt+8SaN53ewJyPlRRESDKNahLlzVWkEDjdpQOYY0XVjnMrIyKyvDDVa1CtJd8iil01KyxBl1iMZAAjw5dBQrQuGjyaYwPoDpXTis2gFXWpvPLrSLV1e+1SuqxNdlNTzytdRYapmc51MbvYQt/A7779d+BWCuhpZq3sujdIoO0maMJ2JAIzdpeXN0/beC7prEFNBfIMx+NlB3J0kVCY4Obbw62rOzLk8gd1TkzjA2CndF6aZtKpuTXXrp+aqW+WPduoM92dLghd0vvdIGzeJcpjKb7nGD0TQK3EO2BMKkTLf3XwTTL5zsUvXOdtWVxOUvyyCMEp7jUSnRcKrXPp8wFKWmXfRiPbsMxLshW87o99fuiS/LrgyvqfDng7+YWNPS2LbQIsKT6qMKkeeN4qFO3moWXolPV4tnLtwwMmIWQQ0jaycKNio0IwDPRuXPJisUDTRLnnrosNxcmQYsIu8C7Gs1uBw446zJERi/r8NiQwjBC9P0SL27CYvbd4S9UPpP7mFM/rL1Y9imzW6pDJSQ0kUNThrBxZDbSeEwq9mi8XQYj1XugvY+TC++Jr+rC2zs4bwfWMNZOK6jk7tt6DSZYIggi/KBsyk+e5gt9VvXsjwb5m7htgb+G1RvFKxez7PfIM+1Otz7fG8euL7riezuZrivQ5tu9km6B12JxU+RvkLlO2H1d7vG8psL7Am8Em77K+9rCEoAAOZgLggLvWx1QdZ7WUoUkR1F20MdLwl1Vw1akyjVvFCQTT15devVH1EbFv3QEK9V/uygvjfNFbhC1XtUgHlRR/sQHzddMGKJ4bMolqOZevAf715k4zC/7Fkf/s70gBx1UzV+1RwyYHZddgdQHHrPgftd7+xcE6ESIGFSTBYEEgeXgjGGyAMgm0HoCE1ostsHRUuwesh8VhwTAyjBnB4ZbjkLUdKAsEZpvMFYciwScH9BBW6JE9dJ2P1AUo7/OsC5QoxIppHuWCYw7EUQ0AD1z1XQcY0IiWh/zXmcWEPEIrTj6GhhY81QbDx1BuQVMMlBAQYy5dyFKGXJCszMkkBo45vTQQasHxPWFvkBhPpoIEIEJkHB5PXX4dBB9XJH7luQRPjYAtV5O4FmmpjXoFU91xh4yMyL7I+Q1UtbBgkCuqcpTwOBuDNKpeUoQsrLiOBR4DXokzPEcxk+OUg+SdkPAQhyhBalHBB3cIhg4HRUrIkSFyUCZGExyB95cCx38u20MZ9HgQQMdAkaJEIFzESx2IFSBHARWiT8hAe4yMcuAufFPcLlbQHz8dbJkSMBP2jzHUpy2DsfQxtVO4yPETNmQEngFAXqSYBRzuiQQB5g9zA4Cb8C/Ia28qMXw166FYTCssYAV8d8CUAbgK5SHx59pQU/xzObYBHxyifRT33MyBQnuJjCeYkSRGgHnyxc38cnQAJzwIZQljUKk04oMsce2knAewFcBupHceLMDx6iRPHpAa8QOg0VAFE2kuEFoCHHlJ7tS2sVznQHEKFxz8eqAIxxfHMg9CVIFqB0p7GSLH/AWcd3cax2pSiB8oLCRWUhaSYKX8tGAKxjHUpzIFTHEcT4owwQLCUd7UxrIMS5HFgV4E2n2gZEJHMTURLJtHBRw4rFcpgbnTSq7IB2AogxR6t3mn5R/362B1R2DtLAQR+8ROEoR2SY5B0Z/kExnSR88FRC/h2kcvcGR2l24a9GIOlWSyRKMtby9hOGeuAkZ+PtFn9ZJEcvkC2jDAGHy8XKzj6HdXoRDBhQQMGNn9hyUG6HzhxUHfe7hxweTlxjS3JICM3IYcF1NZ+EQ7uZh4RQWH7QQiDNAlRvzOCH3gMNGrBFwYucLnsh8HkTBChwfXKHpgaodcEfsYxg9Qm1G0FzRfB5COiyAiOJ0iHWwbhYKUk58gdARGdVPUMHa9RInH1bghyGpMN4V+HtR5B4bQAHSRadTLJX56hH5RSw7ASf7xBzgeaBeB3QR6wb53uGgRQUdJEK0lB3+eVVDgGQdAXzG4FREHM9RBcb1MB7xSIRB4ehd5R29I1Tf0N54BckX/tQ+d91kB8+f4XMBIRe3hlFwtGqgv57VWoX/4eZEYX1F6BdYHT5womQXgia+d6McF0hFgRetN+ekXhNOReAwxF6xfR1NF6vXIEgl3hcsHMF6JefhyESxcoHW1XJe3ncEfXXYXdF6pfQH6lzuGGMYl0RcGXX1ANUV0+lzpd3nJdUpcIHs9bgfCXBF7BdaXElzbQKXR1Q5d0RUl7xfgHj5ypek+Zl9BcWXFNB+faXgVzxcNUMl2IkUXcV1ReKXfF6FcH17lwvUiXH4QOHMXKV35d6XSwPJdbh95+le0XjB/RfmX74ZZfeXCF3/s/nyFxxflLGEQVelXzl+VfKXmV0JfZXnl5pd5Xn521dAR/l8Vc2X6c5+jGXlV6ZfMHkVzVfRX8FyVfDXRVxUtAKWEfWCvB2c6lVbXmVQcULsRZyBjUkSPkwdKJs10xeDX3F6lcjXDQMxEL8quR8OJUPlQFWPXqJWjg1kA5KtK4Yx11BdesGl7lcLh+VxdeFXdl7JehnoMhORKR/CjWD6VRlTDcmVERoRTOgtXJHa5y4VzNc/XUV/EwxXPl0eG2X7F4NUIgZwC9wUEPQEqLfcolUJUU3glc9oFUcJOIWgyuFxFfo3c15jcLXY1xQdkXSV9nijklsJFEE8QcdRUC3/pZIdLxEIBsHi201yddM3Z17FeA3ul8Dec3QqbySigYkKVHIVSFerfRlm6JoVA00AdfyH1aN1InS32N8FFIXHN3Inn43Bb+U/lr5bNGXWEt99eG3XlwNcy3kl/FdXXPNHCwrRYccJC47TMHNFoYBIDaTvMSQe0DdQMxhykX8Tt/9cy0qR4UTOxY8ZyGqMH1edGsrr0UiSeLXoOWgbbPzsCw0m6/pbkVxKxKlwh54ZUbdbySNyjWh3w8AfLK2YMa6Vo1lgmLGbU35uOTvAWsBg2Mw1/MgnGRA1Cd5shJhxv1AZKmczfvn8F/MM6ADirWGBKFMTTVNLoLiTHDwnMROzycvMRSjj35sVpU8rH2yAngc2oT4iv0Ud1jfzM97Mag93xIYRQxhy8TMy7MVZAEwHE3QYVLXEibXc6BH4TMm5/A48x3pehRncrUFDmSEwx/XR9woEiqEdSlyfAJx08xgrl/E4C+xZhAHGgYwcayz6HL3HHdRdxQf515h+Q9hBki9BHxyH38F/7cO1v2u/z6BccWSzi20FGcFdnPh+23rn5kx+U+1L5Z2CHdi5Vz7aU+Lo/SXLncA+hpgWy6wVe1n5a2UNnzZ8CGlBUE53Fh17LD3Fq3WZYd1T3fVunTkWJm15TLyXPX8ER1qIKU7gnAmPMwFEbLAJjSPRZd4ehuyRyAJJn+TInUh6gcG340VNpf+RVmA8cBTKGb0DoTM1ERhLLTn0zM0B+EC4LWUGqSddY8rxAZdafunzRwMdOnudZ7bMyhdeJWsVM9ExKgJHkVUkBgCnCchFqANX8CZE1FEOT0BDLdKz511Z8KFalvR2VTGoAgRSr/xarFXWfmNdcZVklJ/E0hFBIJDYYytBs4eyM2BVEYyxD5uYjeo1ZFJU/Ju1T45Has7Jdse4r9x6/hVc3LG3WYJZrE9deVdURylid7pObXLs7SANb6rOhGDCvXERwhycsmLNM8YJJrHM+olHUOyQs7GJwPo2sUp8PX25UlDtfbXUSMJyZKMpDX0wgeeLSRCEegCMB7X17AdfSgj9CUyduDCUWej1GVVjBVXs172H0HFVwJeo3kt1vU2t3i/bceXrB1powvXV25c9XL5wQdPtyL/C8O3J9fFoYvrlwzcG3RL7/MALVL//M0vlL7S+ALDL9S90vzL3ciEoAAJZv7LLwAi5U8rniFnEQZBHRg8/W/S9l6UMM4IHA/Lwy78kDLIRtcvHBmK//Vkr2hCCvMrwl1yvKEwq9GMlJAK/Sv5S6cGSUtHaNYUWAYVpZMvnuJq98vywDq/dqdeGdAKw9rxcCFgcnYNa0kMnWo7t918zy/iv2r1K82v5W8FwBvNweuAGwpEJjXqarMeZ1AjXr4q9Wvvr0K/Us0NyXmiRpWpyKfi1WFJh+btL9G9avSr+mF+vVZE6KFvIENeixRASp6E/EQJJsSutb89m+WvQxHG+qvzTBLLNvg57gA1UETfiFNIUMO0SCw83QMO1vuGLm8b68bw4BWxYejRhJA9ROCRbPsNjf2PzA7+hBDvKr+UuFm0VGu/uG0hJKCEwopBzZm1N8wu8Svsb8q+6vFfrbwTLKZIaxHPcxvp3U4ihLTN9tB7z6/Hv+b79DQVXzJL7dQ5IffG6aaVb++PPf7w8+AfWVQB9ZV+vAODK2QkIUZfMZbmTDMA0oPQI99vCAUQeVBGp+JoffQBh8Va6H1h+YfqH7h/YfeHzh9EfhHyR8EfZH/h8lkokby6XEGaT6o8i+Yw4A7IiSO8TlQdbHuBg170puBcf10yPDcfnHzx98fvHwJ/Cf/H6J9CfYn4J+SfPH8hiwebgOsSY8HAPismnYSwHvM9WTchbsxmn6THafVTFp+6fOnwveGfmnxR0hDyjb63OF2AnZy0lNJOo9W+fwFmQuBLIaELOfjn+hhOfrny5/ufXn258+fnn758efAX959+fwX7xgcW1MstjSPcwebu3lxnaGYMKCHJaVBxSX7MPrEqX8l9pfKX+l9ZfmXzl8ZfeX9l/5fuX+l8Jf2srELBpwD94tFRt3CrdAKXvhHm0nDXzSdNfdJ81+NfBpF+SMgqFXTRPylX3PxuH95Y1zAkHOkWDDfo3y3FjfI3+N9Tfk3zN8Tfc39N8TfYdaSyGYkJ/ObBT6315ObfG39t9bfu3zt/7fN5TtCfXR3wc+nfJ3+d/Hfl32d9XfF39d93ft3w983fT32d+PEyKytyfcoZ4hVffMjz98a3v3999/fgPzmV+ETskDze3END8cCQUPwsQw/mILD/Q/cP4j8I/yP/D+o/SP2j8o/6P1j+Y/OPxj94/2P0z2h8IPbZQ4QNLCZIbUFP98NU/uAJT80/1P0fwM/tP4z/0/TP6z8s/7P3T+c/zP1z9s/PPxz/c/Av7z+C/g56Ew9AVoF9UMVvtyE9WnMv54HS/cv7L+2niv/L9K/Cv2r9gaUoEHHrI6xyjA9LqxAPdYJhvzs/6/Jv0b8G/xv2b+m/Fv9b/m/tv1b92/lv4782/9vy79O/Dv8b/6KvGFk+kIXzFkpKfas53UnPgf97jB/5kKH/h/Qf5H8h/Uf2H8x/Ef9H8J/sf4n/x/Sf6n8p/XkReAyQT1P7zIAuDHXiwPBfwdHHRxf4X/TlRf6X8l/5f1X9l/Nf8X+8va1HkxTk0iGJAGOwMCa8Bb7f9NKd/3fz1o9/Hf738D//f0P9d/g/yP/D/ff2P+T/E/9P/KGcsKVovqYAuA8vvdQ2a/sNFr4O9HvebyO8Er6r+a+M1db7QJb/jbyv8ivgVOv+Lvm/8O/H/TQ6f9tU5/4e/1vz79v8n/u/6K/7/G/4/9H/er4y/119/0+9f/sq1f+Z/3f+F/0/+V/2/+q/yRQj7yXeJ72FeQAMKsf/xgBy/xv+8AIxqIAIf+h/3ABgAJ/+hbEQBl/2Xe2AMgBeoTwBYAIIBcAJwBFAKIBlANv+1ANQBVAPoBNAIYBdAMYBLANf+hKAAATkn1n1rZt9ckwCR+tBtCOrwDWATZsNNnZs+AQ8ghNq+txAYChitJCUy+gYZJlGIstenj4lAaoCsRuoCVARoCteim0DMvQ1wLPwhc9hP4jAYYCTAdosIfGYDjAdosb3CYt73L31e/C4t7AY4DdCs4D7vC4CHAW4CwPHa0J+pxkDvL4Dhcn4CnhgEDdvP4CQgWz1O8skscbPN5ZvNN4ogbECYgfEDogaR5GPMuZSAmuZOvOkDuvJkCuvNkCMgTkDuPIy1xbN9pmWvQwKvKV4ygaUCKgeDlKgWUC8WgipgxnE0u/NOlmVCcsQeL4VbgO2kvlrZ4I5G0CQwLqMqGi54kVqKc4vMQNo1BSshTD0DAEPyN/dDPl6+BMCngFU0S8pXkNVk8Q5gb040dHatqWtA5T/M3sp3K3skjO3tyXIpQX2ELs8WCLtygVUCLgecCrgdUCdNCi5c9mYVMXAXtZFo0s1dtSkRuHkCPgbkCvgVkDvgez0nvHosI9kP5AMNTFcnrksN9EwpieokC4gVCCEgdCC5vPbs0PI7sPFpoV8mP7t5FIHslFMHtQgcEDAgdiCggfiDQgSj1SPHEs6/D4B4FGnsHFBntnFO4DXAbSCaQfSCnAXSDQPEUsRPMT9JdrVQnKOosqGvXt1eqYDzAfyDLAQKC+QYKCYfAGAmdqSwLnsCcR9jUockhPstrJoCFQcoClQWoDFQWoCZlnt0idkC8SdmmdQiIKAzusICurMoB9llDscCpN0nYklB4dtz4CEgaCy2soAauq8sA5g11v+M11PtiPFYDtIDYMi7w9NDCtpaFb5DIoqBDtqJEsuu0QtYHjsf/gm9V8pr4Rtq5Axtsjw/Ov0AAuqs8bQVV1NOuL4dOlL4yTAZ14agmITOs49I3h6C4Oqz519EooktgjsUtvLUx6s89NIswDdlu5trDpasJLGpp88L5tzagIRkwfVluAaIChATWDCwcRtANj2DDNn2DNNgOC0NkOCxAe2DpwJIC5NhOCuoiOtZNiRsCwRID1NjBtuwbQCyOvWDPNo2DRQM2DCIpm9h7tNJFwWhsFVolslVslsdIsUk0tsoZM4jOCUwWrMKtumCt7kWcsweJZRRLmDdLPuDDwZ6DBthr4UOI4oswLGCUePGCptj4ggup+C4Ohnw5jnfl9tj4xt7kGCTtqGCbwTt04APaDPfG8tzTu9tbcnaE3Qbi8RwQ8RIdqKBodmaDOOgGCB7laCMtmBDDQQTsNQWiRidntRjurqD0jE5sKIQYBxQewRXusCdD1iODgenTdSllLsETmftmIcYBq/Drt4lnrtwNAJDEIam4HduT11CgdoXdhJDmAY4CAQQP5I9sP5o9hmtH9oJCxAPyCHgdL0ngfgJOIWuDrsowtiXG3sWFocDDIVpDlHqJtJ1kH1r9iOCYcgft6FkZC01gpsH9rT0rIVps3IVfslNnQDCUAAAjLgF7fYKEHfUKEhQ8KFhQyKERQ6KHu4SKZxQwyZFzVMihTeKYyVJKZRTTEiPYJKEJzFKFqwQqYyTESbVzMHD+zaSYFTPVCFQ13DFQyXATQRqZ2zGqG2oaqaFwWqbEIUqZkIFqa1Qq4gtzDyZNQ0bDeoDiYlQLWYjTQaERoXqbxoONAlwdqYE4IaEDQyvZcIPqZjQzhDtYSaERobaazTVaHzTRaaloZaalYX3jKIJpBrQraYiET+42TKCYuHKabV3YCYaQb8ZXQu6YszM6ZLzVkg7wPsqDIa6H3TLtCLzF8bLzFLBXTJmZ3wWFCZzJXDaUUIR7nNdCSnZmyw7L+CVYYC7YORSZe/HmZcOITBuHe+7BLdiCwocOYZIc9DLlbyg50O9AH2MJAbYZWZKPEmyyzASa41FkDUYFyBJQejDBcfNCDDV2be4SPDviQDBzGQYjOfa+KpIKDAsYZ2aFsQ2Zo4Y2bfeUISWnCyhJGSuCU4HmEOzX3D8wjDDj6VUIYTLrBlIQjSYXW8QC4N2b24STgAYIBKJGVmGJwAxqiMEmHcPSY40YSmFMUAzqKParDrPXLpZINGGC4RxwUca9B/AHGHJyeSbeYGGErwLCDwwoSAiYJGGNGHOYwYUZDZtLJD/QgvCWIIGF9+PBQ8PDoR3QaGZ7YfcYbjTGZdzFopnzTvAv/bByJw2OHEzZcY9FVOEkwZOG7yLOFAzS+YozbNgHzHOGOIKmYzzeOGZwmGbrjbOEoAlOFVwmOFwzAuGzzBOH1wwGZqvdvB5wicZNwiuHRsYuG1w3OGtw5vBfQxmavYDLCSYX2E5YALafIQOGbQQGHvQiODLzHf4dwweHDYU6E7QirDnYFpA7Ec2FhgskBWwg2DGcI6FLTKeb9w0uGdw9WaLQnVyezXWbezDyFf6VRw04dCazGPuZOTAeanwhTCdw62ZjYTJ4UIM2bQYTJDsNMWE+4FDB+4VhCNQ2rLaYTuGVQ1w7hID8TSNKYzEw9uDyzJ3AkUGuasrSBErwyzDJQnE4fwE2ZpzNCJTGF2HkIN2HrwGKaODbTBEI03BxQDKEW4VMqPQ/abPQm6EvQlXA9oBeHSwbBHvwJWBCOE6JII0mF08VBFg4NeENIOCYHQ8WaHQ4JibQ+ITQIhaCiwv2JGzCjCgIwajuoDhB44S+EvYaaHTQkaGxoEODNQm2Z9QoqC0w5WH0w2WEzQmPBGIOqYtQ22Z1QuiYNQ5RG44NrBlwc7zVwPnDBhQCaiMI2BHwyRGu4aBAfRNKb5Ql2DlQ+RBCIyHDrTceDy4DpD54WeHBw+eGl4HIAcIlVDxQ9KGnQTKF0I98bXTT8YowtNg3YE3AKzM3BonFJEdOeJGygFOYQw87BQwnoqIIijBA4fhGg4V3CMwaBFBzCCQEw0ObpsL3DUTBRGY4MBF2Is+KZQeqbJIDLh/wzmEevBfCoTR+HuzKPC9QfuZ0gEAIDTCaFXwnWbdYW+FMQw+j7woCb1RCea2TShbGLSabrwkRFRzakI7wiTQzw6AyDIVXAfQw6DyJBmaDoUeGrkJ54ERWaRTw5Yp9w7mAYzdOH3vAYbPIrGCvIzuYkzG+afIn5yrzYeYuQhyHAo0FGeQkFHgosFGSQ6FEQomFFQo2FEIo+FFIoyFFUvQlCYATl4tWf5FkzI8bNwlFHcJTuGHzcuG/I5FFUMAlEXzHFE9w2+bHIlQynI1hGxIleY7zNeYsvVZHuInj5gIUXAnw216MooFGfg0ZEqwhmGmIqZGdgQlHdw4lFMAtpHyIiWG2InHAioilFiot+b8TXhH6wlBG1Ivybko56aUowBbZI7mYkIxKE+NaCiAoq+Z31alG3jO6HnIl+BFIjkgbwLSbfI3eZ6DFlEYwtPDHQsXA/aXxF9oQJH7gW1FMon9p0wiPAmIrRFM4L+G9QzpFKInHBeonlH3tIBHo4ROSdQmqY6TcaEazF7ABowhDhoo1FVFRVFVIrag+TcSZQIbaHCIsT7soyeZh+blFpo8+rao2GG6o/JG0IwiBpIn6EqgM5FsIvSZHzQuEZsE1Fzw96T3Qi1HZQnBElIrxCQw2CCdw1NEtoxNgOow+ESIjlHeIwaCrYOBB4w4Ob0URzCowauH5wuVEZw6Nh8o4xHPw6PBConRE9Q9ib2zH3DmzK6iDow1HDo1RISo3mEdI6VGB4C+GOI4pBywv/CXaAdGYIg8Ylo09G9wypEO4apEqo3ya5onZH5olRCmw7eFsYZqDHo19G4o3uGUI3JHUI5JHVo4eHXIg6ZDIXOZ+wtJxlw0VGrorzBto6JEdo81Ea4btHvwXtF7oVRDlImoCoYldHvI35Cjo5fSeIidFBIqdES4GBH4wkObdg0jEao+VGGI79B+ozdGTI1+HmI3RHfw/dGDI6bDDIniCgY5tHgYzzDno8WEgIkNGtzByCzIxNGBKa+GLIwjDzYZ9Fpwn5HoYrFAZoz9FZo3FY5ogaB/okJEAYzkJmw4DGqY6OFtwodHiYrTGQYuGGkIoE5PYK5FPQm6bjw9ODIYg8FswUTFEozTEfBTiBmoxtEkHSyZOYhhE3TV6H3TfzH0ouDHOYjJHMI2LFvgBabUYotF2TRoB5oozF7QsRHrQxLGbI6CZnQ3aEXQ/aErQrSBNwZNHTI8/DyYtRFOIqaHYTErHzQ1RG3o3dIaI0ab1wZuY+/LqFDtOABBovdHWIpqZxgWNHgI1vR8Y4NHdY9qGxwKubZo7KbZ3OADSI/xHOwD1E0gabGlQxbEBTKtFaTclJ4YhJHJTNVB6o7SZHYcKaJImVAxQw7FRQ47FHY07EfKNKH7YzbEXY2VArYoKZxTHBHXYpKZ5QxbHPY17GBpcbFoIoPg+I01B5TGbEiTYbEA4tqGA4nrEyYtrEDY3dENTIHFQ4+OCNYqrFw44aYI4gKA1YhQILQ+rHw42HGdzURFY4wrHY4grGqQDaE0YrO4izaabpY3HEZYhGZMIynFhYlmZU48iARYi6Y1o76E3ImnHU49tCPzFjFxwtjEko6EAc4t5Fwo67BeYtDHkYvFGIokXHc48XFi4yXH846XGi4mXES4uXFS42XFK4+XHK4nkCEoPACv+KzGaopgFYo6ZAno6zE64slGkwLXFc4ogG64lmD647XHqJTDEeUenGvjDpyW403ESGSjFhCLLFQTQZyO4nzEFWddGcYhhwvwuaH6ow5BiYq3FvhSTHAIjHBXolMAe4sDEh4nqofowHC6Y53ATYhj58wT3HC4+LTlo12EqTbbHR44PFO4qfA24ovDYYgLFxI9bF7YzbHYo1jFe4rfAu4jxHjopLG/omBBSTKqHPYyvGc46vEb4H3G04f1H+40aE7olnCQ4kHEJwNvF849F5RovmGR4+NGo44iaI41NAj4jTHp4mYrx45BFzYgeCrTEnH5Y8nE7THGYx4/PET4TPHEI7PG3YxzH0Ij8YZYVnFvgefF2o9fCF42lHPjEvE7YrXBYkcGF9ospGKwqTIm4jvEkYWvFsojZFQTBpGzoppFMY2cGeEXfFf4qAEPw/lE94rdE8YoE4WIvRECYjmFCYkAldwsjGoGcfGXovrF2Im9Ez4pTHywx9EoEz/GL4gLjL4vhHfo/TFr4mCYb4yrBbwqWaxzCsBX471F9jWzGVomhFaTKLEhYt7CuYj4oPIjzEMEnfF548AkIQW/EsI+/H0o+7H4Yl/GEYwWbvoRgkRooMJRIZPCso9ZGQTF1HfY6dGhIRWZAE+dFzaAQneY4glCSDjHd4rjGtgbdHM4PpHjYAZFIEp2bCY/gGoEqvEGEtp4ZwC9FSorAk44HAlDTPAkPo/Wa6E1QBp4p5DaYhPHA4PTHJ4nLG7I9aaAYugnVvUFByE0tG7yFglH4tglBTDgln425FZYdmb+whFCxEt9FBAEQn1oulEM4iQnHYVw6v4ojHv4j7R6EoXEUgH/EqE51FSI11E/YmdFaExBDNI1cGyEyoloEw7JGEp+F+4mAkB48wmWIn+GmzawkWzVWZnUfwmeSDAmuE1rFxolREOI3AkLI/Ak+Ey2Z+EsAmOEqJBtwTNHBEpPGfYsIn/oppCRE3rDSzRGYdEhwn4wBIn3YY/EdSPaapExDETw2xy2EiokB/YLG3E2LF245eZFE4pFSEs7BlE/yzCzdfHnQ8nEE4hvEGYpvFmoRpEtE4AnbhJioJoirHJoUibI4gYkIEvhyTYXWajEnbSn7eAn8YmqGT4uYmDTJaFeEmCgEE6El+zBokaElvFlQj7GCI1LGizA4kmYoDHkWXeFxzRGCWo1KGqwbbEpE9JFjwiUj3IjhJ/E7gysk3BH8zbxAEIiuYMoAAnNEgwzwIsUmMoTrENTLFKCYmwmvzWIzlYtHFnYfhBLEzSEQNWIw0k6gmbwyWZHE+gkvDWIw3ErklpEpDGTwvgnGk7gwTEklE9sW0l4o+0lrEhXEuk1XGuklXEekxXGek90lek30k+k/0lukwMnekoMl+k5FCEodAAYolJ5G487EOkgmbRk5VhEEymbxk+5SJkm5B5E94kXIkFSckutE+wtzGWkx4kdIFqBuIx1HAk7LGd9XUmAk/UnRzQ5FdE6nBQEkwkBwWAmB4q1geEgkmLE7wlakyiZyIlwnSY3EmD6OUn9I3+EjEmDAYMUgnKo1fGD6CUlPobQlbYHnEXEvJFJE4uYhsT4nP4konSE8a7CABebF48QmCkx7EvQbbErktklbYq4mpIpnEIYltAJY+vHZYhbFvYiaATkm8mUkkIm7E4JG0kzfHRwpHG947RFIk7EnQ4u2Z9kgclWImxFuE69GqkmfFNwFrH+4frH2I/EmazJrFDQxEmtk2CkIkz8mBo3pGDExOBjYp8nUkwzGvkrfH7Q0sknQisl5YoElu4tQl0Y5vGLQZbGLk64kvEs0ks4+in5EsQkM47MnM4t4kxIwom7k66DxzeNGSEtck/EmQmPAdMnLoUOHroTdDbob4n4I4jGBAA/FUI+zEFI+5Jkk+jEQkqUkqzMOauIiOY2wpijYw0AiD8QAmQknQmjknhFbEmpE/oybHwAAClDE9mGOzdEl6bIxG+4tWHNhZmHjlfmFWE6ykjksvRTE3snAUqPFlY2Elqkwkl6zTsme4Tyk4kLjRSwz8wywvdAakjsl3wlCaQEjdG9E7jH9E7AhEUjeH7I0zGMkmWZGUnTFkw6wgUw5sIMYBcCHEmObRE2EA1Ep1HHwoxalEU0k5k7gm8k/OY7VbGQ6olSaCYD2HviEuiHUC0kPEikDpk9in242VFnE65C84hfFJktTE1wrlGCE9YkYMQXGdE/6ZjUoYGgEyakBEmamDUuakWY5vADU9vFTU6mDzU+wlbU0anrUrebqo/alDUlaknUtamLohuELUvamj47pDDU6/Fxk3anYEGqmsU3Mk8Evkk848+EvU88lvU+qmZEvWoRIm8btohtH0olKk4UvUnpUhknHE6am7Ul8kQ04qk1kg0DlUgil6HXynT4zwntkoknLEnamHUvTCIUqEaY0wKmxUhdp2U4wmJU0wlNksZRYkobEKk4ckAIzzG7UiymIEtyn00o0QhUmNEzEqCkKU9QlKUvSkqUwmGFVKBGKUiinKUuBGqUwqpjkx3ATktbE8U4omeIdcmikwWm7Uw8lCk1OYikqSmhAGSlQYuSnVo76YaTE8mM4keE/UuqkZElDHzk6DHWo5InfUxhHhYvqkfEzimdjcaATkuGmVkyGlREh5GBElfFUkydHg012n4U0in1EnmkUUhaAJwPsn40xTGE0pZEkJRDCSorymc07AmgUoaaaIlCmEIJmnJwYrEp03jEQ4wcnDElmk8E7onjIyhpmIuAmDYrrFtQsOmJ0paFNwMeZXk//HC08El80sWmZUxQnFksdFiRLxG0Y8br0Y2SbO01Kl7IsJFbkkGkcUsvGrk+Wn8UnxC9U7cnD02Wnl4pJGW0k/G1o16mcQPibm0wyYEY8emK0papNUitGJEmDGrYrm4j0lSZj0ySnlEkWCbEnKkUkl2Ci0zbDSkiWnZUoIkmUigkVneulrYRuk308WnQEdmnU3IfG00vOkFk9OAx0nskR47yntY8yloU5Em/0tEnuU5TYF01WEfTLqYBUqOngZWBkCoxEnYESunzI+9FY0oKmJ4dSnowyOYFYhGlmYmEDI0gOlVUlLG+04ilVkg5HEMg0B5EynEm0vOb/U3ImA0rOZYYoen9U8/DW0lzE8k02lWkj0Hm48YnOkpXGCMxan6EgMmiMm6kjUkMkBk4MlyM0MnyM2RkKM5RlKM1RkyM9RmKMjRkqMrRmQgQlAAAG01xsZIRRkjNTJmjJMZRjODJkjJYpP1IvxtjIYptOLixdjMYppk04ZpRD7poSLwpnjLJx3jJxxvjPER7dMJxI5QwZ6iLgps+PRxoTIxxkTN7mfRL7xVNNLpg+JGxiTOBxSTN/JyTL7J3NPIpfiJexf2OyZuTNvJ0tIPpM9KTml2L3JV2JKZBkxzxJ2KqZZ2JqZ1TLqZyfXKZZTKaZpTJaZFTINpgghyZt5K6ZnTJ6Zok29paqLVmqTKGZQ+OGZKTJGZ4zJ5w6TOiAUTPCZszLCZ8zJmZCzOuRFNOSpVlTxxXjL8ZGzPWZPjO2ZukBRpnKJAx9jKcZDjJOZxzLOZt0LtpmZPfhmjM1pyZJ0Zn1KepJcPuZnAH+RzzO0ZNzPeZnzLUZHzO+ZXzLeZvzIBZ/zKBZPzOBZfzJBZ4LLBZkLMBZELOhZULNBZsLIRZ8LKRZMLORZcLJRZ6LLRZmLMRZGLOxZWLNRZuLIJZ+LKJZOLOJZM6EJQAAEFIyctTHmS4Uo4ZdS24Y0C6WbTAl0W/5+YKwyAYewyCia4zhgX/BSGbXTUabSzuXvFT7KRMiVmbEzGWdy8v6b10QGSfsdnC3BJaV+iCmYKz95qvTKmcqzpAJPSOGfbTD6c0z9yQbSVaa0y1Jv+M8GdbDXcfyzA6ZkzfsXkzZoPeSX6QHNemXLgSaSgzoCUlTYmWnTRmfVCZWd+ShsR6zfyV2TnCVJjgGfHT3CcEzKsUsz00AhTQ2fCTw2eGzbcAqzE8QIifacTi/aVsyZ4PszMSO4yxZjsyMsQpNt6VnjLidRTTyUbSbaUczPsBmSD6ovSbGaWzHGXfBy2bhiimUfS8EerTT6Q8zcaS+ilqaihLyQEyQSVOS5YDOTb6XXC22epiHqaChhoZnSS6dnTLCUOS/6dSyh2Y3DZqe+hQ6V6zw6XeiMOJqTiaQLjlaRYyEUJhSdidhTk2VQy3aYaTSqQPC52cujVqXBhC5gbTrGYwjGGe5j/6TDSz2VIyR2e8gg8eIzqimdTbqe0SLccIyLqcyyrqc+ymCYig32VUSP2Vuzf2d+zYoRBzHqU+zTGZBzU8dByVip+zpGTdo9cYhytMPdSgOdCgr2YWzDafBjb2bwymGY8iv5MhyX2TuybWf0zf0Qey0qUQzm6XdTSOVhz3kEuzg2SBS/KQsSsGUTTlkS3AGOfISmORnSYmV+S06ZAzD0azTB2fSz0ZtuzAUF2zC0deS7WZoTpyfpTZyfRzwOR2zoZifA62aXiG2arTSkb8TTqSpz32a9NVWdezuGTFjTmbWzLmRWyzySWya2TZy+JvGztiYmzO6dRz+6amzpOX/itoZQy0qbszvORwYpWYojZMVPi6sWBSImaEzI2Wxyk6SFzZmXFTfUWTT6cOOz+8RYT9EWMzE4P+TwGT+SJmckyrAHyzu2bJyg6VkzumdPFKOfNi5OZfSCuTIjrAJqyuWdqytOYaz9abhyDWY0yNUCZQjObhyJWfvN7OY/TQiW1y2qH5zQcbMTWWc4lhWbFzRWY2TVmeqyQYNlyZOe7iRCn/BKuUxTuWf54MEU+zuubuMaWTyy8uMmTDPKSzCWSSzduXiy9uTtz9uUdzDuSdztuWdyDuedzSaISgAAEJBQ+pn3c2pmPch7nPcp7mvcl7mioBrm6sm7H1ch2m1ctpmtcwGAPk61mFcrCkVQkrnA8/JlFclPHessukZcoCksc7qED41qFw8lHkpcr1noM8LlV0yLkI4sLno0rHlzMxZlRoATnOTc/CZs0nGbMptDps8oKeclznZsunkbgMhnJY6lgmc8/HVsttAacvDnRY1nk2csznqcizmBY7vCScj+H6c0Dl/sxbBHUiVBC8jeYi8hdkwc8TkS8iakGcqYw8cuIljjTbmnE86nK8mXkXsuXn/shlnHUr9kk2FXk5ErTHq81YmqcrXmwcqXltjNbmC89Dmns+XmRYC3m688XnnzSXn28s+Ha8zXku8pvAK8u3nO8kjle8w3lIc23kGoj3nC8q3nh803mh87IkG4rjDG8uPlLcx3lJw93kB8sTl68iTlR8m3nLcrhm0U2qmEc+9k9aQWBA0zlnzcz6Es880n3E3gkPsubkuMxeGk8mnkRE+knu09jCTc9zltnRvnGYqrBQ0o0ni1E1kHwqjHms8hnUsKNmdYNdkxU5dTOshsmzQ2JkrssfnRU7Bkbs0PBDcnolxc4nlvwhoBCc1ylQMtzG9c1LnU0rrHCc/+Fcwz+ndkwNkc0yCndIwHng86+mtEs+k6zB+nkE0Im9s2BHv0gWk7FDrlP83Yky03bGj0ptn9oti6dQZqkFsvel3YwUnr0k+nnEvNmH4kAXz08hE4c0AUL0qzlE1Dnkq0jkkV8himoC37n5wp2lQ8vYlpY3/GqEi1ld0iim90zvnk8hCZU8xvFuo+1nVQiCldIkNmY8nVyIkpmkV0pgUhM5Cnr8rOlI8wCnlQfjmuswTlpc4NFsCvHnMC+Lkw8hJmcTEQVBciLnBQGuk5cuul5c91F4Cl2lUMqgWgkmgUlQ7VBkC5zkeM7SDtoLAU6s9AV581imGCmrkyoYwWn4uils4o3DQC2SkHk8AUSU5tmACsfn2C9pmFM3/mNs4UkACnnGf821lKCpokKc/mlbQPwV4CjJkkChumSkpuktI0/kBs8PEX8hgWB4LfnTsnfkjIPfno85ZQH8+Unb8kTkn8tYGk01fkjcmflfkuflRU/DCL8yfl1khKlr8gQUk80oij8soVezFTEkM/vlrIiqkd0onEAkw9m0c6Glt8ogXD8/rS6Crvm0E49m8EskC1886b24m9k8Mu5F8Mzv7F8thm24/nmys6hFWC/PmzCojn8Mz3mR8tPkO8jPl+8sPm7CtXlB8lDmW85PkYwA3mnCn3kdjedk68wPk581PlK807kXcl4XHcy7nPCt4WvCj4XfC94W/Cr4V/Cz4XwoQlAAALUMZWfPKqZvP/q1vIhFMfJtJ4IrfCkjNzxTwtbR7LKDhSwqnpC3MrY0IprxrQuUJ7QsCZPKDg52bC7xhQqLpZhMJF2Is7x6QoR5oDJEMlIqyRoQtB5AzM5QRIvTYWtLsxarJZF9IrRQEws7R9bM8FCUPcFjwtF56+D6FdRJ9pYJKtZ2grCFlwrI5XQxi5pIsFRlNPdZIOKmZwotl5LQ2pFl/MYFogo4FOPPEFm1OD5GHMZFe7KTZXQq85mWKH5TPMOFyIow5LXMQFNFLWFS9IuZGIvr56oruFAcNRFUSPRFWrPYROrIgFzgtbZ5wvGp/vNtFlyDFFlVM7pkosCFfbMU5A7PnmkIrEZIoomQJIsLpSov6JyQtzpqQv/p5jPhFziS1FiQrkx7AojpHHKQZQYv2FbvMV5yYveS99K9pTIqo55or2RPQt75JGMTFgHN458RLsF2tMsFlbII5GwsL55Ytd5KfKrFGothAvIpwxmnIFFAYp8FynIeFI4o9FffJbpGlLNZCgrIpEQtfpUQrf5MQr2FQ4ouF7ou95tlKn55NNG5brKEFh/JyFx/IfZONODF11NZFsQsAZ5/PIQ0gvmJGNNLFzQtnFN4oZRRwukpJosc5DYqoJrtObFJ7O2Fn4sNFVwsKq9orgFRbPw5MwvSJmwqvFDNLnFzPJMFVbKuhZgqnFTgpnFqM1hFaszJ5b5PAmjPOoFjRPk5sYuCFbRKN5OEsusDQvmZLArPF2QpSFuQoQl9wtAlmQviZyPL/Jy7OoliDPfF2EqQliIHB5PdJUFeEpoJBpJKpYwuuFsM1vF2AuPJuHOmFXBIL5+ZIOpLErhUjgr4pkAq00iIrJQL/MYxBlKsSmktJgmYqsp2YpY0+ktQSXEsjpPEqLhbYpACwkuoZGVOhpekuslZKDkl3JP7Fiko0lTkuNx3IsOqnkpeR3korGvkq+R/ksfqrzP+FYUsBFPwvClkUoilAIuilcUtilCUqiliUpilSUtSlKUvSl8UrSlmUoJQwAAAAUlSzmXrmLvxSriipWGKZcaVLqxZYzIJWQjoJVzzmZifBucZ7SyCToLGxXoLLodziw8dGinxZxLixdGyKcB1KV+WmLaJVkL2JaVAewRGKOhRoLiJaVztqevNxxQ/jPuXdAz4Hez3JbQD2RawSHRfqi54EBLxJT/MmpeOSZRWrMm4NxKFYawDOpRPiMhYMz44EfyhkWdLBpXAyyRZTSOmRNBb+VCS1wRNKCRTviLoNOK38cID5paDTZRYxyCwf9KGcWBK5RbfMPpSCSwZUDKs3vdLUGQaLAZR2Ks3gWLQ0W3N9xUaKBGb+LVUbXNEZary/kdVKHMb7dniU6LUJbzyyZecyeeX5jlhY/jE5keSQxfgLcKfTyfOUzLXOfIKpuWuLoxVoLzQDCTdRWGzCedjz+ZQTzombULU6XRLRpXlBMSWxLeBclzkmbLLfWbHBnxTBS9Rd5AmIgJKHWerKIeZlMhJeQL8JU7VpJX9yvuQbKqKZtLOeZwTueZfiIxirSfpbpykIUAFtJXOilOUi9P/IZLUSYxL2Vg/5SheqTyhZxyxwoAFVBTRzm+aMKLYZCthyi5LK+XmTuqbeD3CsFLbQZ/47xZODLZTHLkpdlKU5cnK05VlL05RlLM5anKM5bnKs5XnKc5fnKi5YXKS5dnKy5QXLy5cXLK5aXKK5bXLkhoSgAANJ3ct7kty97mty9uVtyzuUdy/yaNc3uU60/ekSofWV9y67FlcjWVKs665qyzWVTyuWWo8qQWXSzfliy6WUzymWVRwQWUxsrqZoMtGkyC/HnrygWWhMinkHy7ZnqCsGlDCigWsy5mXzwSmVs822muiq5lBYkmXWc8mXXy36EkYEGWYi+mYPy2CVdU6vk5DSGVlkhvmnypeDd8lvlMk1pFwyl1lisr8kY83mWrshfk+yh94oygLkrCiQU50oyVuyqOr7SqWmHSieUBCkiWv8u/kYKgmXyUjwVP4rwVq0rCXDsN+XVcgUW64HsXIC+SVuSyOU7YP+WKCy1m0C6UX1igzGAKkSXVk2hmtKcBXT84ukJc9Ck4knqUwK+fneyssWzYc6WYEmkV4kuZHKy6rHiCl2Xiw9BWvTLGWmUygm5Yi0WbTdQX2y/tkf008ZEK2DEYCtim3yrtFac62UCU0sJeik5GiEuvl+iyxWYS36VzkrsUci4zkoSvsVwSgcVI03EUlkwiVTS8kkMYh2XxikjEaKp+n+ypsWBysSXByvuQKioaXKKxeWWU12WXipwkPi+IXdSuRXQUhRUli8fkVCltkyK6Ynai1jniKxoU3wyyWHiqoUisx6UZipJXM04yW+C2sXNS7WXcKuyU984CVBAFhUcyzQUKzIIXRC5jHGK9gmmK36lzCnqm2KmlH2KyYXUK0hXac0onWKyQCD0qrmOKjCVqSwMWGctxUbSqCWmy14lMQNzn9CqMU9K4JUGK9/mnjcJWhEyJVtS1SD8CyBWoUkaVTsrMVqK1pSIKsHHZKhTF9S3yD0C1GVFi0pVeypoWnSggwCK48XFC25VSypLkxw3AWcKrRXhE4YWiSxGmiivxVt09mXECzmUzStWB0K4tlfyqvkfUnbBUK5ZUzKx6DcUlZXH0tZXXzdaW70rZXhClFVHKuMWGKgxKYKxVnYKsxR3K5JWqK1JW/1Z5X9c6BXbyzBl5K+BVIdAoUJKrgXCogBWtSmFW8KujkPzLpUHMqsjDKlaVMKh+a4qxA64yk3mK4iqWji0MlqqhcXlSu5l1ymuVVy3VXVyw1UGq41X6q01V6q81VGqs1VMAQlAAAJWblXcodV3csdVzqqdVrqpdVWY0Wlfcs5F3eCHlhssuxqstwVqKsh5kKufpgaqnlo8vsSzKpXljE3nlTKtBV0aoTVnEx5l3KsUVQsvrAm8vqFvUoaxe8rTVDcH+JAEsPZF8trQx8pFVBap0Vh8vPl08A/lvYtCxz8oMF1MuepnitrVV8pbVl8Fj5seM3ZfEvbVe+L605vLKlEfOUl84oPFo+G7VQhOXhXao15GMt9mfasqlO4t95lYtDFs6unVQjOKlp80olSYvVVy6o3VWqoHVFYuHFi6s3VafUnV4EvT5u4vpl1avoVrku8Vq0vg57Yrxl0vInVuEp1lPCpoZEquA5x6vBlD6sHVI/KzVZSuUx/ytQ5M6sPVX6r3Ve4oXlUapRJrKtulvhJXV/apA1Z6uup+ippVJypkBH6phlu6oQ11uFUlxKooVMRLQ1SMow186oOwRgo8Vn8oYV16vlVcSHw196rXVT7OgRLUrLVUSuAVQctAVTy1g1S6sI1NwvW4UasVlOStgVkioqViEFHVs0qVpT7M9lw0vjVkGoPRbKvdgwmtnZn4ouV4n1XFyKsOVr0t0lVGqA1O6vg1RGoJ0pivQlMyqsVG5Kw6YcrrV7POplqZLJVsApql2yusFT8vzV2itp5Far2V4oqwKwjPpVCbOxlXCtFVZ8rJxyapfFO8rXlH5KFVt+GEZhSrjpxSu+VKar5lOasllk7LBV8sudQXrNTJqYoel6YtPFEGoS1AarYVXMqnlE5NMZUqolFhytvJhKvxVw8t8eJstMZiqv5FpWr9VumoB5xuOw1//JcVnMyAFO9Ks1hMubJxVwo5IavqRN/LfpBCsMpusKVRWCp613i0+VSCspQKiuk10GrqkHKq5p3i2uVJ4qgVzkvMlb4oA18ayPFNQpuVG/N+gzmsjFWyN21tkqPZMSrDBBWutF8eEWVZfLvlEL1lVCkso1Gc3GVpqIbVeLifAgUptFHGuj5j6pYypkoPVWmuz536ss8KEDe1cmrA5X2tleJqotVEOstVkOqtVUOrh1sOoR1MOqR10OrnmhKAAAovaq3VVjr3VdjrcdTjr8dXjqrcJ6ratQ4KdWUbL/uSbLKVUVqNZVaA8BUDyI1RwrTRcyK41XFrE1VVMvWSqK2dbPKOoVkquVf5qkKbvKHJuILPZYFqc1Q2AM1RQzWlU5qCJVaLOhYxrLlZWrvGSWrqqU2rTORTKaIBzyTNa2r1dXLVfRUqr0ZSeq51Vxq71SqrRzG2L45SBLQNbcLh1aeNzdUnLdsJ+KLdfWM7dXmLO1Y7r7db5j11SbrE+SZQE+R2rZxl7qnddprjdUHr/tVbrbxR7rzMe7rXdQHqwdd7r/dQ3gThZ+qw9ZhroZQRrg9ZJL49T2qFui7rV1fHyk9ehrPtQDqQdR+Lw9Vnqx1WZhc9XBraNdHq89Unyy9WnqaNfnqdhdXqzdYHrI9YOKdNdbqp1c7r29THrE9S3qPtSnqu9RHr+9eOra9a3r69anrlVT7q3dWXrQ9W3q49QvruOQXr09cPrjdY3rTdaNEuZm1reZs4qbZbxLi9dRqt9SZRP+WprHZRJKWWZvrZ9YFReuVJrFSTZSMOVXqh9ffD4lalqTpcSSxeSPqvxZPreWQirsZMdq4VZfqAOdfqE9SDB6GXKqf5aDqj9Zpqbddqq+9XXrGpc/rgNaqqdVYjqUdfDrkdZgaMDegbsDXgbcDQQasDYQacDUQbSDSQbyDfgayDeIhCUAAARTHUE6hg2E6xg3MGpg2sGlg2FIsnVla2rXk6ppneq/iVhqhnU06oQ25M8eUs6ngXxa7nWSGrnXSGueW86reX861NWC6pQ2i63NUbyhGVuM59UsyrQ3S6otVeM5XX3ymtVq60zU664w2mGr7Ac80A3Z69V6aquA0OQmw096kqXIGv7Uwo+w2G6+A1L6jvVrSpw22Gxw0IG3/Ui41w3J6lw3eGhw2oGvw0v6msGBGwvVhGuPVa6kZXwSnIZVa5BWKauknMak7W/y//UripFUDCvzVKy3JVwKqRWevQFVbapbV1C8DWSam6XIE9lVn8jJXSsuQ1LAJDVkSvtruahzmea6HlWy/fXzKxYaWahcmU6r6XigUjWGG82UmG7XVmGt6HmK6rW0y3KHdapnX/ihzUK67Q26GxY21E/bWBK7umzQZjkRawLkKG6LWqGsXUqG8XWJKjLUw44WXba7gWJcmQ0Ja5eWbGwsXbGvI3vKvGZ6QPRWTywQ3hqgqEtK7zW6y8zkTGycU1ang3/G9kmDGy9X1Sv8a2CnfX5s3o0UqkFQdG1ZW4aj/lNKg6WjakNiNG/pVpK1HCPiuo1bG5BVn4KbUP66BmVK8PDDcmpXisrMmra3lWFGtSlLi/BmD85TU5GlslHanaWxKlhkPIyJF2K5xlTK67X3KOI2QG7FVnChvXQmzw18m6fXLkwU0USuPVn4ZfWUGig3EGqU2ymmU3ymqg0Km6U2KmlU3KmwfCEoAABy9BrYNOpvYNupv1NepsNNMUONlUJoa1nBu4NXBsNZu7L/FZlLPKLxuENrxuexNxq+VtIriZrOuuNVxs9NQ+MW1wKp21ft2olBxsDN+xuwmbMvb5dJrUImhp0NiuqjNoiPrVPxv4SwypGNT8tGNV0JXpGyvJV1msbVZGuGND4x5NDVLZFZyu/5pavmNWbO2mjJtY1fQzm1V/MzVPyumhH+uxpxIuKNRQqEVbpvENSTMqNSpKC0Z2oO1axuDp0uHP1oSvQYSRqw15puTmnRqM1hiR6NoBNVQfBovVGKvI138t5NRcM/5gkqRNkus+NL6vslLYvmUd+vLpsaoLev6t+V5SvW1jZrf1AqOTpwWtbNFxvv1dNLyFCbHKpOOP0NUQBRNW4vIlDWHoZN8r11AvNvK/ovHNm9IEZq9NoVQJvnNOZu+weZuYZrVBaNQapmNNpqhV+xK+N20uiVQBtaRu5tVFYiqi1Dxpwm9ZpwZB+BS155tC5Rxsk1QOI7Nj+q0SD5v9psut7N+XL1QA5tpVQ5se12c0/NSyosVNCplQhmv/NpKLGNSZu4tp02e1pMDiNrEGWNQlpjNMutpN52u8WR2sngQZr2NMlpCgEuoheAZuaxUho9Nylr3N9Ru5gnOtKgjpodNOTNENTMHp1L6IBNFps2xs5umQvqoNNFlqNNVlsstNlustoULVNcptVNjloctSpuctbltctHlqctnlpctFQEJQAAFVtTcMDRTbWDpCsFa2NXHKwrSHLP/Nya7tVAbbZR7KGTUha+FXi9orWSaCjYJqorUAFcTbeahioAEXzQNqnZe4VGtd4LmtVqljLUZaKrRTqtlQJa2INpa3jfVaCuQxqSzT5rFwF6bLjapaOrclzeNW8rs1bJbpLcobgzXMyJNe6ao4CJaljWNbozczLnjQIbZoCmbkzfNaeLTZz9NVMauEXiypzf3KgpkvDwUVBav+WDgtrcmCwtUGysTe3DwUXhaIFaUa/Tc8zuzSdb2wcOb9rYGTQpegbHranLnrb8LXrRXL3rVarPrd8y7rU8yPSddb7rcCizrYIryRX9bFcYdaEhS6aPLPcydrXpaYbYMrNrS+JFrQtauLajbzDeZrfVcJbxrdjbJrSRTKLQZa+rYNaBrYTb4KYRaRrZ1aVLe1aqbWkz0LTsbMLd+QdLQ1bGbc9imrdCqWrZaaObeVbGmeiqYJUYaqIIAEYTThrSrSla7ZX1rNxQVaRbQ/5srTOyo5R7K0rQJqTzSFa//CkagFSML0jbLblbbdrGFXFbCraFax9ZRDo5frbY5YbbEDd5b3LV5aLbT5arbebbrbWba7bZbabbfDrCUAABlAqU/a97UoGxfUT6iI18TYHXH6m/V7mP3VWGl5l+22A2hGr23z67EWXahxX661BJa2ijU62sU0KaxM1sQPbWTSmyWRm8s3yasvUq2meA+mls0zIw83YWpfkD6hTWKW4KDjal5U9IiDUkW/E2nq7/WaWvKDWmto2UofK1vSoU3f6gm0mmzM2wNYq3kK4W3MS+fXmWlkmjmr1X6syK0kYhG1LknBXZa6C0iGvAWSm67CFmva2sS8m3U2nnXHWxe236mo1dSzE23G5I3l24m1yW8QVb2myxnm862+m0rEaGqXU42p40BK0+0TczI114sS09mmq1zWyiCoCie3Mm2xCsmiZXsmvkXIKh+2DYIO0V6nPXhGz20r6wfUQOplnCmodXh2yB3e26B0bc8B3OGhB2R2o23fIKI1r65vWIO1B0wO7/WWG0B2BgTDnYOqfUEOmfVgG4B2r6pvVkOjfUUO4O1Rk6h0n65B0eGjB0O69B2m22PUwG9jVIO/eYgOkTX12uh0G6oI1oOzDVAOsB2sOzh2l2jh3+Grh38m4R3RGnB0yOn20sO7h3bqnw0165R28OwO0oOjR1KOsR1f2jPVX6+h1EO9h0GOth2e6yR2yO6R3mOqR2rcqx0qOvh1MOgO32OtR02a9YUJ2pc2ia5O2q60C0o2sxVfm5I2JWtI3IWnYrnwyS242pXUBKvnX3GiRV/Kz/XXinO2H2/q0XmkWVX28o3um2u2ichMWM0upWU2mm3qW581i2vpWvmqPVl6gm11WiFWzG2000ynKHsWjWl+AM8a+qyq11avo2rEurkVajvXrW0y2MGX1XN2zRXl69Ymw2xlWsoAm3OmibXiOkjpVmmVG8oRu18C040XW4Fgd64G1Aqgu28oEXX1wUM37Ksbp2OiQAA29Z0RO/QXR2jk1No6x0yAX60coN+2gm/FHOOyh2FYUO1Qc3Z2cWqB14OufWwOllCTOkO23Ohh1lO951Yiix0O2+2222wF0gu4F1gux21AuiF2guqF2tjQlAAAGUCttlqRddluRdqLpRd6Lu+ULTqxdnNsNZfBsqdzNoJd9Vr0t+TratJLoptpLo3t+9qrIKTqJtNLpJtShvktkTomtWNqZdt9qfNaNv8dnLuRtIxosNYNsRZ31rO5ArozlQrqrlIrp+FYrqJZErqSlUrqzlMrtO5crqRZCrv+FSrpilKrsJZarqBZGrou5WrreFOrv5daBpetBrretRro+tJrq+tZrvilerphtFrsFdNruFddrtFdDrvFdTrvBdkLrdd0Lvddrro9d3rq9dvrphd/rs9dAbp9dQbr9dgbqshhKAAAkmCKnndYaQjW4a7DXG6RHUgbdHfA7k3Q47tHfCisHTQ603W47PnYJCs3cw6bwQW6XHdta2xVc7uXRy6K3Uta+Leub5daWbb7cy7G3Q27/GdkbxLWrNknbS7O3fS7+rYy7YtW2ayXevbyXUO6+ufNqGjfaambRO78XXeSRnSVqVrTi753Vza0VUKKMXSu60XWu7V3SPbzBYu7sXdu6BjfVqZ7euL2FYS6p3XVa9LX27rzRS7h3QO7KbWqLGgB27u3V26j7Qcbe3YG1Izc27WXR+6tDey65zbza/HVW6uXZW7MBTW7ftXo7IjYm7FHWB6U3fG7fDem7XnUW7wPaQ6c3fI64HdB6Yjbm7DHYbioPUm6AjQh7s3Th7Q+aG7g3WG6iPSR7CPWR6Q3RR7iPeR6qPZR7SPbR7qPXR6aPUx7GPSx6GPWx76PXihCUAAAVaN1nOiKUl6xHUCelOVCe94UieguVies1USeuKVSe7bkyerKVye4uUKe74VKe/FkqeqKVqejKUaek7k/uuqWAe9+16egD1Xy+zVs2hC1Nuz91mell11oXI18a3q1Pux910uuz2zM890iKy92Dutz3Xu38lZaw905ak93Huvz1yTWd05Qnd3Behd1JTdd3hejd0Re1uXE6kL27uuL1he0kkzWyd3+e3z25M5z3Ik1z0eeq92Zezz3RAe92Oegr0Oeor1k4Yz3wW8z3vuyz0WezZk6es2Ugm/931egz0Ne/m3+2u53/MrT3ws9r1fCzr38elr0/OnRndeglkDetr29e0x3Hcob0Hc8b1jekb0COqFmTehFlze/r3TekuULejj3Me9j1re1b2sezb3rerb0bevb27ew7ku2xF0QqDD0BAd22UsPN2/O8h24uS72d6oR0vI5p2XYg8mne3NngmmAWQmnu1jupL0RqvLUveuzkImkbXVO6HlzOqm19k272zane0XSwp0Hm2s32e3yCIk8H0baqpVEmtLXLa6+0bmyr0tusM2uamN33gfZ0q67M11etG2f2gF3vPBi2l8mO3fmlb2JO2x18eiR3oe0n2Ps3B2ge/B33ekD2put53f6xH1J25D3s+1D36Orn1/ezn1s+j21wemx2C+xn0d2kX3U+xCXM+jn1yOv50y+7x1aOsX2uO3n2i+ln3C+zPXc+we2K+pb16cl52a+hX3XelD3Yepx2G++X06O2D1G+8X0h6oX3m+hn24+xh0W+/n20OzPWEOmb2ti752je7O16+sO2u+33Xe+z32ca930mO4P23MoP1KS9X1K+sJ2R+6A3R+/X2l62n2OOq32O+un3EO/h1R+v3123Xx3hy96n5m2P1ialO36e6t3xmk+UY+wA3JW5X2Ya3O2Y+vG0v2oJlF2iyWK2wv1l2w83FezgVpO4VWHKPJ1ZOu83SUz+F5OnL0TM291FOsNW0WlDUD+3akVO/z1nuzd1EqprUH62X1D20e3xehAWmmoRkdOrZW3e7p3Luj519OmC0t2nf3L2upG8oMZ2V2/rm3eiG2ZK4608oEH2LjILVd+kLVO+j2DI+xUUvuhzj5eozB32yi3g+/H2coWv2Xy450AOwZ1jKlk0l8n0XMWqn2GOYv3XOoHVx+pP0m+j51dOzP0G+tx1IilP0LK1AOIB6X1wil/07eggPbeogP7ewgMkB4gMHe0gMUB8gOUBmgPUBugNkB1f6EoAABqx3o990KKdJ+AbvmHAfT9f8xNJufsa9dxIjliduHwOpLfd5nqztJxM/97frh99YGLtXHPiwDKHv9pLr79TEtfZjKBn9uTIn924q3VHBq3dBsvqdLbKhQoXvK1G/pu1/Abix4FuI5iEFS9c/ojNN9vFmEgfdgWXrR50PryQX/szQcgcMD3xQ79x9svN1dqItP9IvFM2rxgdfrTtn0tJgGgfGgWgbfNWAYEDfPLL9vdtX9GsAMDJksAtXBp6dOfsJ9Zhu4RQ2uMpE7tsD0mTED2bNkRcQt3txEIHdo/ph9GFts9sOPYxb/rTFDno/9YDOONCapcRVJtNZnUCq9WPu2doatntwPPCR4AcWFmWCrdvLsHlSQcim7OIedXyMmDXup7YMwfFN3BnmD6AcWDZuKmDPziWDCfq2cPIvJ9qVBGDwHp/NegcSRqMKftpnqWN37sS9fQdvJdQcJNiosaD6hoyd/boS1JQfSVZQfc9lLqhtjfth9UXJyD59Mf5rxoKDbEPsDxQedh6ZrXgPBoyDqwqGNRPpL9hnvGNgTt0DrFtUmKQaigoQa2dLmp7NVOumlck2iDcoR8Dj/rON3fo0tQ/sCDDEpk1IQeH9Lgdv9K2ukDpE08D6CBsDM7oktRQbLNSVrfV8EGMDG1untZgayDFgditXjqE1ApPGDX3ORDKxNpQkQf8ROIckDtKCUDFNpUDX00Mc7gdzVdIalDjHEOdVXscDYxMY4sAeRtlga2FR6sYM9vs8S3AcwD0gONDGboYDVAYtDtAatD9ActDdoetD9odtDDoaRghKAAAsqwHIvZ6GovV6GfQ96G/Q+3Mt/Z9668I961/aGGnsYf6BnZiGglal6YwzkzxnVXbV7Y8HsvcmG3gxVN87aDaazdUGH3dmHCvSGbJ4OcGn1UCGug+V6Sw0c6qZQkGCfVCG4g7CGmvcfA0zW963BbJLtQxy7dQ6oHTlQD6GVSGrAAxV71wBqHiRdM6SlVmHcw7IHm/Qk7TzQKrUtcNakw+565Q12aTgysbJpeKHFsZKGXNMOaYvY0yRQ6Sq1g2wGMFduGw/c0a9wwo7EPcR1zvWhzOA45LZg7A1DQ/vjDw6b6IPdvg1wyGHrsZuHh2Ndalw/lMVw1YkVnSUbL7ROzpw9e7Zwwhpr/XvaPgxs76XcqHmqif6nORX6ew0VTWQw5Ki4VPbHRVWGYQ4xBWw1XRgAxOKRys2HUI9WHaw43g9mdE7izSZ7Sw8WHUQ1JaFnb+HOtVRKaQ8OG6I3iGlLW5N9zel70uamG2I84GtLRGGn6VGH1jcl6+I68bu7R1qRzYcGwwxyHrsf6GJI76GpI5JGZI56HnQ06GFIzaGlI46HlI/JHVI4pGVIyK9CUAAAJD0OyR/SPSRwyMGR4yPHY2L0zm/VlPhsSPxQ2MN9MkNXvhlL3/YikPLy/fkBB9iNOR/qEyBgr248ocMMRnMPf+siNOa9QXdh0iOwR5CY1hsw2a6nCPhR3CMNSrJHYB2V3xR+V2JRxV3JR5V2pR1V3pR9V2ZRzV3ZR7V25R3V35R/V0IBhKPFRpKOlRlKPlRtKOVRjKPVRrKO1RnKP1RzFH4R6tmRR8wPRR9qOCWgKNnBgJXBR8iMhRvyNE27yN02moOeR3yMcRhLUuRte3jRlMOcR/iPvGuyPjumyNXBqyOqTUnUiRsyP+qoyNbRkyM7R7aN7R7HVqRzSOHR46MaRk6PqR86NHR06NXR2fCEoAADiBUqZ9mwYlYOvsEdofpFNkvp592fueU14YkAFzo+UMVu1t/IcXFRZOXFz9tbdGIeRIgAb7DBJrQmgqqf9g+k9lEEY8pkPtkVVIZDY0toaVg2t+DdYqB9k5OKdpEtRNriobD3Yr39KZL7tOnK6NnFviD8IfXDokcXdPNt09F5LRDqxvsjc0dy1Hxrrd7NqF1l5plDbkZmjF/qgpYEZCgAsYTptEbGj4seWZizr/DF7tGxXEfOVaodCjfUcp5ASq7t6/us15brwjmsepjUAd+Nc7puggXp7Rf5oadY1VBDH3qEjPEZFp/WvbtTyKgjOMp79NdqCDVRovaA4Z8pmYeGjf6vXZ8geI634ebNGYdrdzVtVtsKqr9V9X/9yEp5D8Rp8VCqp2DRePhDO4bMZuHsLd8AOLdrXuBRycb69Xhqw994fw91vst9mboTjJbrBQEBr5DBfqN1b0bvDx4bRQD5uhjr0eMdR4bw9EBPPte6CRjn0aQDGvtzjLtTv1gEal9Zcb59Zvr3MZ+qtj6mt19rcZj9nYuJjdmJfDw8dwDxMpQjEcZvVLceN1GsZL9owf9jJEbaVICt993+t6jFnoLDNEZ+VzcanjmeqFjPbvuDYhuvNXcYXjmet5jzkeYjFwe89vSoJjpTrQD5TsWjvTIBDtTsNjsJoHtNcYA5tMdKZfBsEjBSJejOToWDZpvWjQLiqdsFtADz8a+jrdtfjlIapdwCa99oCaJDLQYqg6YcppSCan9KCYUtYsd8gzMcmlWCYj9OCb9uCseHmGuvM1P0eedywf4tUUdBmJDvrjtvp7j/zvwDDCcTj4+qejdItJ9bCYLjGfsvDXko+jZ0cujF0aEToieujwiYkTYiZET4iaAWwAAAAGsd6iE9ZZTwz+zzw1ZL+E35LBEy3CSE70g2o+hGPcH9GWUFDH4I9ubcUKHGlOPLb4nQ2aWhk2biTWj7OUBjHHlTvUXY66beteP7B4xfqVirbGanYM5yY3MqJzTZjTYxbSgwwhzrsQzHavYIH8/RBbwgI+GhQ7rhg1bjHjEyE7g48DG9YK3SaTeDGqLVKL/ETfGslYjHRw9YnnNhOH4ZTzHiQ4mq15VOHz447HOzRD7Sg1D7jrcfGxdTGbprX0HPw2zBvE3BaCBZWqUzcta6nUbGW2bv6mw21GKZc1ygk5yHkI8CagPfGbBbYv7KY/WMOkwzKIaRRaG/W3ah49gYXE/IqeraTbSkw7HSQ8EGd6rYnUfSCqpo/DyGk5YnjzWOGGsG+H4E/06IlcE61baE7x8LEnwE0u6hk+HH9E81Vbw73Gs4/NUvk23GA/SeG/k6PHe4UCnE/VuGNE0FKtE5XCdE2eGeA0jRnk4iHzI28nZ4x8n4Ve0GB+VkbsfURLow1rKuw/cmg42yHsDIcnKky560LXknzk/+rLk+smUY0UqqXY0mI2WTb+3RfGvEx2GPNQM7t45QKVY/jH8FdbGVikhHapREmAnTrGP47xShbUv7E9S2rek5/GxU3MnNafyn3Hc6Kr5V+6uU+4nxbbyn4TbkGL6btazRZzHTg/NMKk4ymqk3smnY8jG6k6jG6U4qH5mRNHabbE6PYxPyClcSnDU6SmE1QkmoE0kmHkykmJgNcnvvf4j/48Bbf3Xn6/qVYHZgAim/jfFCXEH4mFacbGKEWMmIQ3AnVUyU6JbSynNU4/z34/4HMndUnSLaQYNk4Kh8k2tqqU30NHU34GDnZnaTEx0qzE/OH8RVDL1nfHbFzSXHNMIYmWE3CmTJaCn/fX3GApRCmAUVCmQU52mpE5ImZEwOnpE0On+08Om+02OnB04/5gAAABhB6M0+keNWsJRMC+6ePPRqhN8JmFNAqVdM8ARtOUsAGOeO+tOdKytO7x/Vj4p8VUIRmGNjIycOnxrk0Upz2MFKnNPfKRxNkh9pOsp1o2RhkFSrJzxNb08eObKkJNkx381fx8VOxB7WNXali1hpumNGW8JM7KzqP5hlVOXBhyNsx1m1le2eAYJ2pVoJ9yP8xmNXkpvBPi80qDdWuEkjRgaOEZw407J1yOzRyBMt2jlP9RpWOER/G3wJwBMmK4ZNaxjqPfGmmPD2sU7/pmVMBJ5oaDJtp0HuqlVtJ9NELJ3xK7Jh5VPpvDr3p+Q22po82UpwpOLDH2N2Jso3UsE9Ovqs9Mhxw9NERysOTJ1mZYq/dMT1bdNgp10lpxn32FS/OMpx/N2mZ9OOfgozPh+zD05xgFPwezOMVxpOMWZ4zMZxuzPtp0t2OZxhN5xrzPsJzzPuZn5POZr3W7putPRJ63HRxu/GU+oJ2lp5JOEpuEbmJ6z1bJ6TO3ph95Fp+GPCZio2Zpuu1yZiTNfe1pMeJwc3TFYZ1rmn1UcZ2ZNcZk2PfpjM3mx/o2tO6q21pnTNhZgYM/2iAMxx4VO0x25PyxmLMepuLOaYb1NwZugUKym1M2eu1P5K1AxpZgkPCKjL0nG4KAkpiBlZZ7J3ZpmlPhai1PYZzHE0ZlZPcpnSWfp9sMppnGNupshMU4j+0Y2srMlWwDNGK2NP+pxmN1h17W+Z3hMBcFzNDOx7NZ++dNtpwLOxBgLNOZtX2wJxdPjp0dMTpv7MjpoHOA5kHMA5sHMI6wlAAAeVnTy/tgTEps3TzvpoTjBF+zgfvXTH3IRzRfPnQ3orazIGegDUxBCzjWeDTXqfUzlFvLJ3WYJTqmfyFm2t9jT0tJNTfvzTsmaIIuWY+Uj6f2Td9L2zzSpKz9yg/ThWcad8qcxdkaY3p0acwjC0ssj4Ge5tV2cFTuyoITgTNZjS0f8RiGa6TyGcojLZuvj6Gb5jiWqwzXweFjQ2a1zPkdGjBufhxc2dYjZGfexeKeZDisa6jsOBaT98copasaEjS8eYzMUbM10ybYzIJycVAGdlT3Gf5z1/ITTj8aTTZaKEziYaNTombZz59WAj/nITDbsakzB8fDzE2alj1EcBDFfurj8WZJzDfqzNKKeLjTWYCS+mbezX2f8zafpNDyYOszEjOezIjLLz8cbuzZmdYBVjIazQgaBjTiVzzhQal1KeacSCWby99OfJNGVoMS8maOTfppYjNNIWz/fow6zObH9+WbVTaye6NQebGDHuc4zHFsnNPufade7pNljueajzufLDrGaFDnWefJh2atz1GfxxsGdtzIdJFjOov1zRGYlj6aqdT02fqgKGfS1pGfVz00YQToEctTMuZ7ZNyfgzP3o5jAcYXgIuZ3JcSZWjBssgztmuXpYJta1EJuCTNWeXJgufUlWMYf5+2Zbt3yh5zdFskMo+fuUrOZNTMDPqDl6eLTIbDzTXeZb9qSdPQGKbBjWKYRjyma3N5aZiTEWcmVIAc76deaiTROZD9tcZjJ3aaYLIBoFNrBaMd7BfejaidBz/2f4LwOfBzghYELfBeELYhdIDhKAAA6npH9o7IXdo/IW5C4oXVyhtHxc4KL93aVmXk/Lm2YyzbGQ1Nj4E4/mDC+rnKgwPnYeTfnDc/RHzC+Ggmg00I1s/5HLc/YWqM0enFkymyyw0xm184Z6V42HHZ4yAXjKB+a9PVKnRU+Vn58wDRyLZ+6bc/xmCs8gXrLL3m7gyRmM08amak1+HULW568M/5SCkzhbJ8Dtb/g1/m145X7es2PR1reCHJczsrUU+om0cwhzeC9omkc5CnKi9Cnqi12naiz2nyiz/qi87NoVE487m0x5LO0yBzzQxni0g8ZagCx47Qs4wXILSubhDYrnGZXkXKc2ujkixUHhs0lnY82ejDk7EX4Y+gXEi6+HK02RHwi6prIi5P6AaH4WYowEW5aUEXhc+4Wzi8T79gzV6oM6na987cWHC1Wn/5ej7dU3nbLC68Xz85LGqI58Gz8zrmNc4YWUw8YWrZmUnTc9oWP8/NHcYxbHqLcNgVC9CW9WeoWDg4imhQAoWkS0oWUS8iW0SxZ5RC5iWhC1iWRC9iW8S7iWCS+IWnbcAAAAAoyF9EsUl1EtUlyks0liFRi5pKZrRhEuqF0pleeqlXZFhaM+pkEtTykwuSC1z2TR/8MP59XOJZ/DM5hoaNSZi/MWFwYUwRsIs9R3fP3F4sNXF4Av+F6mWr5twuo24FPYJuX32Z+Ngal4hNaljzNRsXUuNOwqMJaAzOHxllko5umZmln+OWYjHMwa9R3tx+52NRjapGls70ml4LTWl0uMWlu0uAanh2q+qh0u+g0vnUV0u24d0t6JEMu+250vEaCMu3ZwMvvZrhIxlm51xl/POGlz0uW65P29F4Mtpltgu2lzgtF9PPPeZgMv6l+Muplgst+Zp0vJlwsullv0s2+jhMZl/0vVlyENaZ6KMk+xov6h5vPSlyz3qCy0sFYYUtqklYuTZ6BPaJHkviy4d1g+n0u3quXO4p3GM9l/LAGxzhHpB8e15lgfD254hVgJhf1nZr3PEabfMr2iINbZkJVRF4jTxhzlVkoNYtZphrRjsnAtmSzvPpWggveaMIPVp/i3kF9pW7SjtPAZqLMJmvRNZ5kYvcZtYOzljtPNF/8shSv8sTlokuElnEtgVyCsQV6Cv4lqCuwV0N2EoAABi5JepLqFdpL6FbQrmFf+U9Jaqt1mr/jABfDTd8bZL4xbp17+a5LreMBLaGbHLHOqBLgpYwzVQfdjkpb7z/U1sLbxclLpXqVzWxdlLFuaozCpasqjGcOLKpboTapf09iZfgDlZfLLWZbLL92cRzKvtrLCZezLXBdzLbZbz6ilc0d9ZfkrjZaHL3ce9Ly5bBmalaXT2vtAreGukr1ebu9Rlb0rCgYMrojol9KlfzLNZcdLa6eLLKZakrDle1LdZdsrnRdFDDpfcrRZbkrjlYCoYlY+zzlarLrlZ8rQZbMdnldaLgVesrqOZCrklZirplcszsOairmZcSrblYirslY0rAVaK0sVa19ulbsr/eCCrm5LDLPmjyrKrLGTk8dGcxVaoYA8YnzO2e80NVamdy2dCpQ+bbDOgaAr7+0OTixcar5VYQgVcbLTr5dvqTVa3T1Be0z9ed0zLpb6rXXumrPXqSrrmaxZI1alxS1fYDs1cG9a1eG981Zsz/pJWrMFfAr8FYOr+1aOrcFeOre1ZOr51dCw+jN490VfMzVeeSre0orz2jNrzAladzr1fOL/9qwj5fueL++d4r8pYPzpOckzI2aYrEpYlL1hZQVS8rorvxaMLt8b0LnJa0L8NenLUCZ/5YGZhLzJYsFpMYwrmNawr2NYETqNbxrC7rxdoJfIrRNfIzb6aulUNforfxdB9+5uBrbFZBrnkcZdP1aZrdxcV17LvXzIlberypYrDbKwqjfEoSlVrpJZAtdOrh1YurItbOr4tbFrkteFr0tdFrMtYlrctalrstaVr8teVritZVr6tbVrmtYVr2tdVrOtY1reta1rFyHR1KFaxrptZxr5tbNryJfwrvBosj/+dDDcaanLtkdxjjtc/zXOZHLENc6t/JZljFNafzE2pidQNYHLCedeVIpdprnfsHLX1e/zoQaCjcpd+rRaA0zBhubLewfjNqpfZrcZtjj+4ZgTqVYbLmDserl8YKrXlZ0r3BfLjoVcirdvssr+VaLr3yZcrpdYsrhVZsry6fCrJZacr/ld8r9Ps4T2lbzrv8eMrrfvbrnVZExUZbd9zBarrJdayrWdc0rOdburC1ZSrZdbrrcVd7rdpZ4TZlZwDzCd2ri9furNpY2pGdeXr+dZurm8YbrHdfNLXdfLrDvvnrx9fEr8VZkre9ZXrG1ZrrO9bSrljsLz99au9M9YLrndf15dcYSro9Zfru9czr+9b7rXzokrl9d/r19a2rARNXpVVdt1k9e2rcbJfTD8Z5Tk+eOFn2ZHraJu9wrwZvNMtq/1f9btLveZ6rveqQbn9eqJmxdbzeDcfr2dfvARccBjk1YjtP2e7r3RtzrxjPobljJddhtf1rutbYbrDY4bLDa4bBtZ4b7De4bfDd4bnDaBFwAAx1ltYtr4jbEbkjYkbwYbtrYSdtrLyZ3dDtbIrOhY5LA2a0L78bVzUhq9rzqaprx5dHdd7tYruarFLAdbprSiqvLSmZ4rQlujrljZZrP/vTzufPDjSdfhDKdc5rtEE8L/ycyrz9drrr9cPr79eLrBDfMrd9bIbD9dPrs9djLF9aXrhdb8bw9YCbj0eyrrdYnr+DaAbcTbHrOVavrQ9Y8bTddvrR9bCbJ9ZobZ9eCrLdc8bwDYybq9dKrqftCbPjZ7r8TeKb29crrmTerrX9e8bP9bqb0TYabyDcCbOTaqbXpfqbZTYHrrPpAbGVaybTTaCb49YezUDfSbXTZabUTc3rH9eSbc6e/rT9ZKbvTZvrIzambSzdabszf8b8zenrzTY2bMzYOFfTcAbkTbfrWzZibOzYgllVf6TL2awbBTc3JdVcTT6qcgbSTZObbNJarp2GZTT+omb8GG6r6RZLt32dezQzcabhDfRTbQqmLpifX1gzcbrwLbJ9gwY5Z+xWGLeoaL1lTembt/xLz5ee+bleb5r/DaEbAjbxbuLYJbOLaJbgjeJb+LdJbhLZJblLfEAhKEoAbtvKbAFYibfXrXrU9bZF9LZKr/TcBTA9d/zhRNobiDZ8djjZuLMGd/9vLZIbOdpjrl5fhj/9cyK58MtTJ+cDwUrZubV8dorRUB3LruAVb8fsw1qse+5nTrubRRUHRbubG4p2f7t52bpVi+b4zOxfqrvOfKq0+YeDIebQVYmfDzqBb7L7HPwLBaZ7z8ec+LEddyLxDYnq7eZnjzZdKL2xSbz0LY6bdDLGrc8fu1XzZeb69cILAuGILgcdPTELeobgLZDbsTaR9NwbTFuDeRb+TdybhVk7jbVcVbpTdWbWVI5zyqIEzUbdIbYzZSe4DeubGrZTbB9Y3rUJZFbepZRb+zd2bozbSbyzbabRzcZbLLcbbC6vababfbb6zeCbkze7bxbc6byle6b6Zfrb6reZb0DbnrsCYJzE1dH+CwvhbOOY/Ly7YYLSLaoLcLbRFG7ZOdeOY7L31fBbtjmut7qYpzSbay5aecyT/tYWLfzcqFGbewL8MbwLt5bdbrVmKTF9rWd9scyzCRYziOabPL2WaZz7zZv9VLohLG4sebOhOKzztf3Lxyu0DP4tgb2qeZ18JYM1tbZ4z2/ugLJKsapVWfa1a5c39y+fqz5gaOL9JEI7ArbQlJ2c0LcsZ3zmhu2LWIYmLSyctFm2bhrW3DygqRZnxxueEF8xZDrqTsHL18dvzggp41XHbVJHHdMLshrOThjYfLuXL6D9HcrJtHZxTTtYOzNjZbGFCddzJGuRTWmeI7xTJklK+eErr3rAL73ogLQCcw7PgvQ7v6fnLxxc3LFWZgbpbcB9UCaQLKhhtbY+dtz5bZbYAHd79BbYAZ6JtqNkeZPLP7fiLoeYwL56frJqzrMJr7YVtxJN7zYNbC7ViYyLMgHPbz5Y3jHtLSToMcIF6IZHKCXZY1YAZazQwcizh7cumIFsDToyoC2a7f3buXdoLDjczzlDezzFdanbqLer9s7ebbxpY5beTYa7urebrNTeGbXjaLboDYpbZLapbvXYG75LaG7/XeG7fXfYAhKAgAMOd8bZzabTdXaqL7dYwDbbdZb3RdhTc3aeTY1fcbfAfeT35Z3bH6D9b4iQy76tukVHre/bAAZvT9qfQJIHZAjftdmd7nb/bQHfmTiHbTTWktg7yGvg7gSZw7Zsbw7+/qNbFMas7s3I27FHaZLsXsGLr1MDbZVJvbpBZdrY8pyLSGdPbQ1biVn7ZBtyouVbPtdwzQnZdbb7cZzghhzT9KdDrErd47d3YC76xfZz2Mc5ziSfFbtjYZ5tGb9z8DYar0lPlTLjfermnbIVf3eCL0IbhD7WeM738Yuzn3cM7DGbI78WNfzUnec7uxfe7YWAWTlGffJ8Pqvz2JM+blZqu7PncFjsrd1z4nf3jD7a8DKYpO7ZhN5jqregjJ7Z9bcWH6zR+dmtq5YF7lXb3T1Xe2De7exzZXawjtMZ6Lo7a6LzRbjj4KZd7W9bd79Rcd7VbZbTK3dUT07YKLraaBbobYvDJCfozQyq/LVXZ/LH6FDTescbhpNbuT5OcTblBb27kPZ6D5/tV7q2fV7DOdi7LtW17KPaorl83xDQdcA7i2YkxuPZfzQraY74+cg79Pa0xkvZjrada57v3f8T7PZGKl2fU7BXZflm1Q77OnZer71ZU7m+dnzJxYGTDfaU7sdZ4Uh+YiLlrcPL/rJeD9Saz73xfprl+biLTKY87YG2pzCmdFlhfd0brHYx7r4tdb2PcmAxveIrxNZB5FPaT7KmavbFXMB7qnYUbHIdB7xtJ277VYZ7vfdMDlbG57Jrce7Nnc7D4JbP9r3aaNBBidbspKJ79rbDzhacbjIXdpzlzvO7Y2Y9w+3dVDl/YoLCPYwxt/fTrlzvoLQad27m+HaLFRYD7kFqD7qbYub83bhzV4ba7o3cG7I3aoHY3coHNA4oH9A+lrhKCIAU3eqbqTYSb2TfHbPXcwbezad7KTdububY8rizd4HCzahbDbcuQw5q3bWA/mFWObZNm3f4r23aj72A+NZoLbxF1jZbzg1db5afbS7Xrbh7hveA6m/eYrtWMYryoci7V6edbB/ax7ufff2bnZEzYA6qNEeZHd1ZttbIivl7YSqe7pFdp722dE00HaRrvuZr7/uaebk9rf7eFc/7rxT574ycTzIqYs7xra3LTfdxzusZyhj/eehLPbULffcF7n4Ek7rCttzMnbUFU/ep1CnYoz4rf47xybbNbHaGmInd5LmGbV7S/Y+Vmfefzh5oqHEcDKHAWrMbqxdR74KrNzF/daVcnfoxOQ/LVnKZp7ajfNA4fatpRHaB7MyqSHzasfG4w7j7iJfn9qHc9zSF1cFJMZ+5LfajTAybNbTnen7tfe8HCyfs74vbO9jncjVv7eJ7/7cV7jg5YmoA5SV4A+A7ZqdpTHwbvbIdZMH+ff6J0XYuTR/c3aSPagHY3NXjug40HJQHi7SA5fLTJuP7Wg9WNGeYDbz/cxzS6lt7NBawjkg6K7YbZt7sg8uLE7b4HPA597XbZm7PbaKbnXaxHhzbRHIg47b7A5CbObfwHTXeObMbZnb/A/JHbpea7FTbJHa3eQTvbYXbNXexH8g4t7iLekHMI5RHydcwHiI/GFaA+FTOg84rjgcBH6g9iz0xYPTKg/8VANejzQNeeHkA5/DLZreHMmasHJHReHJJr87a/fu7u/POH2jfmzuo+Hz1LmAHsNf8HdPd2H7g9UbovZn7excadRw/M7XxMWHFB2WH7itWHw/cs7bfb07ro5/TkBfw7dWfVjempmHiQ+KLSpfI7d/eB7ECc6Hine6HeQ7o7sPc4ryycyTGfaYjeucYrjQ4VAzQ4F1ahtX73tfQTKuZ17dSqzHSaNl7PrLJT1Q8Yr1dKr7yY/B5fQ5ERPQ77NBQ/ZTjfe5b9uLQFoY7rRKQ6AtnfYDT3fZQg8qZmTno8auPo+qz33ZQ7Uxogbbg5/7bKafp+w69iVo7/7eWZtHOw9n7wVP1HNFdsH1w/sHpo+aDJw7sHJPaKTBg+Mb97Zz7ceSwLJSfSzgNZPHh/fVHPAHFHyef+HhZOS71JsxTPQZFHkxb0HVgAkH/I4SNxXZkHf9rkH/ra7741e3bL/ZbbHXZhb6I+67wfaHb03abb5A+Zm0bb7bPTdq7S3dYHNI6ZHtA6wnDA7oH1A+wneE5wn+E+ylhKBQALA5ATLI4PDBHsXbbA9qbofYB19dYxHnbc+TVE/MAa4ca7ybZF917ZlHiKtIL6re4HGTei5Xw+VHZhL4nh+vV9c/a87rwfHLCE8Lb9Tes7ZPcRNM5fYng9bkn9Yf07jYZ1bAg4SKdzNbHbooTrwE9cbhk+Oz3NdySdjdvbxEbh7f1Yn7G2fMnR0oLH0A4Mb2ueX7+PcZrcrddjzg+vzu/cpre/eh9evbtj5raxDCNfyDIzpGHXIfHHQXoIrcXrjTUjZin0jdkj+NbRrdMcJrZ/aCnNkeJdkNa8naPdGZlQfx7zk7ynBFvMb1k6snzNe6jco7OoRk45rA/dZx7jf5rzDZKj2LaetdU7KjDU8NdLE9anLU+NdbU86nHU9NdXU8In/U4Ing09wnw06Ino04GnI0/GnY06GnU04mn008mn807mnG7UJQpADInzI9bbwg7RbjDY1VW0/pewbYVTT/cUHNfPDbr0PB7sbaUJso/sbTxcjr8PZBH4QFCLW00/HTrPPHX7b9jP6uz7N4/+bwgBiLoTKzbJo/XHrgcore463HB49c75w7qhrg4Q7049fT3Eb8Hy44CHCDchnCk8dwgczF7AyuCHfo40LG5ZiH/3dALI47BDbFtrbkZffLeXaiHs9NhLaQ85HhOaeEpnYdzwlcyH3SsCniNcKHQI8S7Pg+ZnRYauV9k9Qz9+aqHi/eMHGvZgw8/fNT9Q6cntQ9THFY/FLBU7aHm46g19g81HAnZ5n64wT7XWY5n1ubjHQSpXDJ/fyH40FCnEyYMnTFviHpM7/5Q46KAsfYin+sfmHE48JnMiXRnQCa6dmw/4N5o68Hq46fACyeP9C498H2o7tbwM/PLKBf+nm9uWdO45sL708sHn066rSo5pz/RKv98s8UzUpYN7j45aF3E4yTvE88NCA/2nXiq5HWXZK7sI4+rC0s8Ne09Enw7dQnG0/q7GE7QnKE8z5Wk+oT608xHmzfgnVc/7rSE9ZHLXaEHtc6JHKza4HYk4gnIfaLn7I87nwBuLnbc97nBI6AnvY5AnUg6zn/49NRwlLb2oMM981s8EpQo8Nn74/hpCc98VSc5ostsObCudHvQVlFRnILZBjL45ILb46vHTw4FntZKfb55vVh4+hZhvGDZhPs4e7LTgjnW/fSdZ8ZcH6/dNTQs4lhJgQFhmGCFhF3nPntSa/nK2YeHsM+2H8M7r79o8Q75MJZCgGEKpm5uBHeOzZnZNZkbHo+xnXo7UneM5ioy3DapSRg6pkSYnnRMfUnKw94z05oI7gY/77ZbKErlC+XjwY4ex10D8nXmpPbSY9ILUveZdDY8hLg4x8nEs5MbYdaDrePefdpY9E7HkdmzQi8qHkzI3His5vd+/ZaHjxpsnUPeUb0Y5bt0PYCRCY8mLA9I3zzffv72rYw7sjfihkw75t1eJpnY44u9oQ5xn3CQdHVrDnHKDfaR9w5u76MauHss5BniPaPHZg5bJsA75V688PnHQdS74I6zJh3ceTANORHAE9RH+OZ/HkcdObI85XTMk8nbfc+iXDc44HcS++jMS4Wns07SXM04yXqS8yXi0/SXJ80JQtABNreAc6L87ZQJ8Oe4TbLeNtZS9YTFS+vaDyhQDsNPCX88aVtbynqXYmoCXnqfx2dS/KXsNI8XFJuaXyOdaXn4tL7xo5TJgy5fjng4PLdo9GX3S9g5Zi7b7jo607uLqXLrCcZ7wldZL2s5h7IavdnUM8651HdVnS4HdrEhukN0k/wDDg+LHuxtrA5g9kXXkZPtyzpjn2/akXbgA4r6i5lLwrcZ9Ws8ZnE0EVLOZKcb7WfznS84/LDvbRHQlMxhq/jnn4lOdH0adGT4Q7jTf/srTz6jthoGDzoe89tHBw/lZHs4QLHvcwLl85MRg3g1hD7i1h6DcxjgCP9nYHaxXbzbuH0mJ/n4VLmMkVOSzF3Z+bz88MHkQ+2XSM6/RMC58+cC+phCC8S7KyDTnO/tXprVI7OXsOgsp078QBc7GX3c9gnFbZrnnbZKXzvcrbcq5qXleHRbUE5HbQ85D5Tc6676q6YnXc9a71S/pHN4cxb7c7bhCI9/HKyAlXMy4U17S/yLYiH5Xkq63jvS+7zH9XuXr88HbQDfHGwy7Anf08pXR1rJXczbMr442sXQ1MsX/c9Ln2vrmXUK+uwDs4W9xi/N7ida5rQ/cjH7q8DXY/f2X7C/VnvEfGgC3rOXMi+zHDNbEXo5fygOa9dX0sZ0bfJbzXihvGmaI4+X8nddrXQ87LGkBW9Zs/oXAxY7HiqY11N0EnH/VRhXGNbMtaw6FzY4QWgLndLhoa792AA8Jj4aSjgEM8CSQc6vN786NHQxQjQv09f1Qk8jnWo+vLIc/C7Hw4LQj09EQac5XngErXnt2dPgYq6cQe04hHBk7PXRWZArKS7onC3fJXOANwHYg9yXOS+yXr64/X766/XWS5/X4buAASAFWnmpdxHkE/vXfzoYnxI9onZRfon1E9bnuq6g34k5v7wS6e10yeUnAPaQ3wNOFHdQ2uthc4UJ3i/jbC4fCDV7VMHl5pw3rxiZXjLoknqDYX7HwdI33XFQL8k7gL5PagTtG9HXGK5QXNUTjXNqNQ30a9tnutKRtvFojHCw7nzUa+t72XfXbdvYfxvSGrHCi4mXcHZiD4YrBH6doW1XM7vz/nf3Hvs5CwxG8vHwBDcndxoVHgC6eVpK9AXAMEYXnSY/Hx64JmY67t5gYdpnkfct70fZjTva7hLEaYHXMBZvxAK5Jn7Y+c3RFYtbK46mXbQbw3bQo4XygrdrgM7U3D87L7WKC03hPcE7AM/bdN5e3Xt46SiFfYaHbi8LDD48lH1/by4aa4x9ThbNXES75TvG4j7PIcAnME+IH4g483IAcHH6C+GDxq+2wta95pqK91WWq4BV5G8LX9yvU3R6Lq3moqM3E2tVHKWaogLW/UVbG8T7Eo56zxxNVXzBKK3ow4UH9m+pnZbsaXkbZDTlW/t7ka4GTZbptXUo9BHG8+PnaXeDXaq84He8aHDK68Enri9zHC69OHj84pHbjq9XNi9jpfq5Fnx24M3w84Hb6y6xDI68RnjG8UnMY4y3426y3SZdzda26gFTm4pnkI8On2q7abus4FT1xfDHSa6E3I/bHbM3dM3zhcLVjHZrHsm7e78m7Wnfzr0bosdFnDKfO3ho8u3kW/UrrcYJ7JffaH7OrTHMeee3cE4Hb9M5U1ny8Z1P2/jnmW5T74G7knuk7xVsw+07pHcpnK7Yc3MG+YT3o9uwJC/f7Cy9Z7rfZE3DI9bjDG4Bw8BfY3js7hnFo5dnxvs4na499XkNvsXHk7l7H84HnM3dO3z0+R7Pw7enT29PHXsbV3wu+UHgW9UH8dYsbY28vb7O4GbAk8Q3Ym9K7cI8k3FXbB3c2+9XhlZd3bI6iXRA9ebMq7A3Qu+gnQe6pHordD3Ae9e3hI/13Bwu/Xb69/Xn6+T3ie5T3Se4z3WkeAAAABNANwQO/e2Vvg93Q2C9xHvkJ3Srb1wkv4UytvPd7Qm7N5nO5wztvfF0punyyzPMu+i9S15EPHh2kXzd5r2et5rvQO8ZvUE0DOnFxpuMI1Zveg8rvnZ/5uN8JxvEbeuX4dybOoatXu/89ou5Gz2Prsz4WYUA1vGx/WuWd9dOwkcjgO9+DWjl7kmeF0lmRYcjgUt/jubl4TuTc3lAdYWyuZxyrPG1xV7gt0e7iYCCGQd3zuE14JXBNzzvRQM7vf40DuhqQ7OVJ23D9twgiRt11y+XRzu24bdv4MPRvAD6aunV3eWXV21vCp2Aeh4Ztv/t/1XFN4RuKzRWX+W/zvQJ28hG05gf657SPyDwO2qD+2zKD0geDd/QeKD5hPs27LvGD07y6D6o6EN5wepV+Vu+W1wfLdxBu8R/xPVJ3lxBVzgvhV8uVvYdeuckCCuatmCuw9L61I4dlvoF3lTYF1TDMYTdOCD9KObd46iEV9vOHYQ7Bng5JO+YdSvEjLSuFNPSu4B5+hli9fPPzLfPvvLVBrg7DHUtXiub585Sf53rvuYWDOwqWYf/5wWp+pd/j4V1vOb4kivd59SrAB3dSz9aofOV+oeatpfK/oRt2Z5/sDwV7Mr1h2A2xk0KuTAqJh8F6nWWy9Qv0hxcW+RzQvFMFT2WFz0G2F2y7uK+mv/2flPuYy+3LUwanLzQIuT9xlOqd8dbNGwmqDR3fuVWyTWHYP4Khh+zHrR6f2dZ5FO56SEO9FyZb5G8mvYpzMe4p3MfZjxF6090sfU9ysfM98se1j6sf092LRCUAABrQpcLH+Y+HHg4/HH97kJTtfekL8Ketrlp2pT3S26F+AAqL/KaZT5wMAljrGU7ymu1Hm/fabxyc1DojOlH0sN5bynuhR3I/M90JeZB7wsiVh8PL70GVe7q9dQj9Oppzi9vJ9lAcYdI/dd7zHuJbsOezaXNdxb3cfhbkfdXb61tQHos1Lj8Bcq76fcnhmNeWzvpOQr3vcmYFtcLl1aPtrg6c+7kfDb7zhd9HtRerztnfInzTdH7jo/o96nf6bnveXd/vfXdl5XNHuo8xb4ffTawLvGiok/7sl/dqzwYeT7yZdorz/fELt0eg7/WcuiuHdWzmk+yTyzHAHlrVYL/nvFb8E+xRgQ8AciA/PpnZdIduY25Fg/fcHhu2OLmU/OLnHu9b8U+Khmg8E6FA/vtp+drrl+dlrzyf37tg8tYbA9O73BmN7gjdv55jscTo+OLb4QNjiqE9tj5p3qnk0+pHwdeUzUA8/Br7eO4D7f19+U+n+65k3DfNuLrkU/ALh7fa7rQ+LqAwcnbw/foHr4/VnssADV7k+3T1PtRnh4vTc4s+0IChssngxPJnvSdNn0vN9T810jny11NT9Y9bHyc/TnzY8znjY/znqc+znpc8Lnuc+KmwlAAAd32PaBYUhsmq/8lkNKXcXn3PoUT3PO57xgp/mlBwi1Beoi3UBOY0M8XIMMYS0K0W5gMLGOzgpB/YCpBzi3sBL5++caIKZ6iihZ6W3m/PJ/R+0Vu0J6+S0hBZHiAvyzheBNCnV27wLaW263884y2fkpwPFSCw2JAD/UDGAY3qB11OjGOOl/6Lo0Ivv/RaB5nkGcLOgtGFF4+Wlo1js4zTgGHThQGOo01GjF+1GTF/t82A31GHQDIvnnllGZK14v0o34vCzQFMp+XF4XF+JAfIx5GHW0kvEl6C8Aoy3sgq1Ev0IBVW+WyUvtI2Uvp3EZGHahzMCl7A2+IxtWul/0v4Wwr0GeU2BqXmNxO2BIiI1jiSpJG4WZ2y0BKoOVB2vWYWevW1qguxQv1WDQvRXhxVqTn/4esD+qBW1+KwoMCvZgN0h0i30heUlV2sF7eBKCgQv22ApEb3FMixdF9oQwjcBjIIZBykO56hixIUluwJ6eSwhB8IOYVdOPA45JDRwYd1OGeIPKv23iRB7fip645BU+6ILU+ryU28BBmfHHPi8i3dAGI2GlhBXV+JBIkNJBihXJYDi3T2Tix2EgI1aUL0mX0m+UTktXFByPwNmvlzh4h7ILucsSnHIGi0fPDeysB0iun4JAjXUwEBYip5muBlwPk8L3XROUoJTOo+xUOFvUn2YeX4VLm1cTrKCPP7QyGGgqAevQyievd/tPPIyLevt3eX2mJ6JTt1+xN914+v9eEw6715+vFu9a3KmznWLeBevn1/+vjBBhvwN62vV/R2vQK2+kgtgOvGN4OczO3YhxTAvPY+xHq156x80ivGvYQkmvT4umvc1++BXHjZBjJyWvoPBWv3ILWvvIIdy0ipavnRUfMwISXu3V7hBbGhJBChS+c9i3eAji1061IK/PBV7cbRV62E4NnQ4dwQJBuINUKMkKd2ckO+0v54iWQe1Z6IuR2wcV+n4CV5uC/giYkKV8NvTIPSvBhSj28zFBBcKXBBtuyuG7m7JEPl7ySvhiP4AV4sBQV50hUvVCvKHGeBEV/h6LSyR6PXnMv4ZT/UVl5jkzzFsvqoLsvLe1Mh+wPMh+vWQvFHFQvy5AlSigz0vhl5TvBIzTvceUyaCeWr02l6zkal9UvBd/pGhd9VW1TSZGz9lzvIYCkvfK3Ev1d6rvqPFkvIXjagFd8wQS2z4vPF4Evrd6VkizWEvfnlgaDF9YvLF8Hv8K2YvCK36BmpwXszd7mA1F+nvlF4gG1o050k96qARF9dGK9+XvJF7fIi9+akWF8wvQYwWWDQJe1T6yQvrl/jv7l8Tv6F7i2wwO9vzSzUorSxE8UF4/0OS0tvNuxAEdu1vPDzlVvCikiWWILCBiF4s8b5+jB6yRGv2ezfvuLnvPnST0661+fPID52ceN4uvcoLVBv98M8CN4FDm/mQfCctQfQN5Qfb/jQfk6YAAXlwCT3kGR63g/8kYkIRm555g5ECo8kgLlBckZyaaUIQ/NAvrwyynoQyHwIZKH/aBqHwOF8+LHaGUAw+K3KvQKMozYreI/V2H6ucaHzzM6H/PEweEQ+mH2YwxksI/4tKI+aHudVaHzw+1jN2oZHwI/SH6zF18M6sAtliFeCUIlaqJnBMMBtR70LAgj26QcNH4w+tHyw+dHw2mBKEIQdQn/ciwLsQGSEiAhwGug1TsvFcNLyg+H5KBbH4xDyH/eA3aIPQ9Vn5enbx1B2CAsUSurCQ2Am5A/H9Y/+H6ADtH3W1sDIXgdiEjf/L4/QE9tewseNJwcGD4/72MBhEn9I+bHyk+7H2k++hpvEz0F11f0Hk+AMOAwRfvegFdOiwlCiyh/H7G8SH5U+FHxJjVHJ0wPdg/8OwLRMUoO8sYhN9Exbmp0pH3m9kn90+gnzvUw3vvIoIMszgIAhx1kEBAFr7TeMSNDzSYJ0/iH8w/5ny0Nb8B1BQIIZhtwJfhauNug/CNNVgSN7dYSNF8rH2U/Znwc/5H8E/l2IKB0VhgCCYom0swPrs977hfuYHs/ZH3ZIhHwu288D4S4kpk5gIaeJVagGZjUNrcCINLsJloFFEMM4da2LSA8/hZ9lkk8+AnxU/Dn84lc5raBYDECRPCHQ4lRCLJNaAYQsXNIg4FJJB5AtSV9ABmUbzBXISHsHxEMKAYAX290Zn7i+5n68/XoFAkPKG9wxLKGUG6JjDpbz5FXKqHxTIIbZWkIdIkwPAUEOJ8AHQLAhdjp0syfqnsknzy+Xn6C/+X8sMQwn0B16MjwmJArlUJHdEuEI7wiKjOZgWJWcRAkDh0iLlAzXzHxh8ha1K3A8+Owji+un9q/WHwhBBSmpoj+IooqPoZgZmuBp8zkTwu+K6/47wKxM0t6gXIAMRHXGl1JYlfdKntEQsX+6/uX56+5Hzq+fX3TiwYJCSIjBcQ9YoGogmF8xZSBXJxQLsBu+CeB6jrxh78aLIihM65MerYFm0v799Lh6/9n5m/vX+AbTNLzVAQFmB/QV9IAXsNAK5PJECdHPwrBFlA4wDJBHwQxg6nxBYeoJ9IvVttQTwGTAgX4E++X8ISyLJ09tDsHBpCHSU5TPQw2ISdeIAuixHYuGBPVGdg7Dl4QOoOHRbD52AdGC0kZYCZvNXxm+QX52+JADsgP31pZO/qItPAKBBW6L8EPrr3frSBW+aWJfxmeHJQ/gNWAjgOBx6qNAD8AbACn322/gX4I/O3yYRUnHrxrqNKEyLLkoPH8Ew7TOY9ZuPMJvuOBxg+B74yziEdvrPp1fRCwkatLy8P/pgCyAYh/03+2/X36zF8ItAlfL+kZ+gJ08IeMhhJQAj4tqJ84OgEJA8WO/wC4MY4UuKKwg9hYRkPo5onZmwl0Af/8sASu/n3yx+UP2YYRgFEQsn07fH6Igg0cBeAAznT82wLAgnRPYQySdug8pnJR3z994nRD3QjkpPQwQr7CSAQx+EPxq+kP2u+s38EJjn9eBZ3z7B630lAHPljkWn4bItoBwUbIuscB+JfgnCFu8oRqc+VYmQApQoexMlM5/rXs/8bzu5+8X+u+Qun0BRwCIQZKAytHX1+jUuLrwfHiUx5hHppjQF+iaMJhhDkg09H6AyAqhRwwtBEHeUvw28WrmhdVP8h/Un5C/HXtWETRFtr7IoTx4X+M9VgPEQMSCJ/qaGvlnnFXc9gBYRoeMFwwwgRoAnDDVlhuxRWv0/9r/q2/mP11+en6+AFYEBQWahTIjIj4/Ujj4BC8DOZ7ny8w8eTURcMMFxX4kTVftGJ1KwXu8ZpHB/SAa5/X3p1+PP96+n0tyuPhmAI+VEbItGhMspyPFR5mJVRMIg1MmH4/R8DqZRnnhqATILSRaQnwRvX3R/QAS5/kAa2/KvyAJ2gNWBgUiRZbnCYhAQBLA/gNk9AOCrQC4DSAHICU/GbNKAg4mugHSOHQBaMuQlBy2x1vwADYPi1spuhrfTODDw9rhS+ziJu91HjXRTwhMsDltNUrYEBAg4tF/q6j+BnSOCFWf0QR2f8p+AYEx9FtM6BKgjU88v/SBDMLORfgnCR13qSxZYIMA5Xz+CvgL6CzH3uwLHKOBPCHoAUf8ADSLDm94P5j/QbmoBNGGEfNeCBBP3gysnCC+xA4NKAbKICBIAjqA5FKwgiQi+MRb4TBp+hxFzwT2Fg/W9+Mf2l/oUuKc86qDClSs8EfrM6ANTiLcabF0AHArbUCePKBcF/rxg3Lh/6HClQM+LppsHlNIcqMr/GP+7hhVJuh9nsnVpVKExqZMaBxyCqQ0oOKAvaruB7CFRhFEgdtt7mkgzwN/dBQL/cbqFbx4/3X+PvyOVZYLBB7tGwheiBiB2QIsZLX4mUFmOtEGZID+tKphg9KLKxMOENFzwT+8NQDKFTXoOIZ/y7/GgDSBUJA9jf7C4QjDCsdATgHQiCpcBO3BLIJYD0RQiL0FYbF1ppttg8vMiTBO/5FPyQBJP9dtUgCCADL+G1OCADquEhYJOJgMCj/VIBnSAyfUf5P3yIadACa/y/0S/8wAP/qDhFhdiDuPM46ISnyLRZh0Ea2PoZsAM2/GlARPwrKUb9mbGNQIfxmZElAKCAtCDBgMkgCTysMCgD2vysfHxRfETqODFJWeCVKVCRDMHtAZdBcPja6VpROAIhjLGA9YHn4EQJRTA8eVkAkgAk4dgh14gS/NWI3aFlCCTFJAPWdWzgeBXseUwI7P2vYZN48wEa/ehh36Cx3G/RtAMudOPgWeEZyNLpYFVEA/kpKnzMAiQgEIRaGKwCAA1SOJbR7PihGO78TMVvwF+J7hBMgF798wSgBDwCjE23QBYgIRj3Yb9R5YUywVhJfYUR/T4pz/y0AkADnfxwArUNgZCdiRFcaHkHiTQCWrAT/VL9KAPESbh9sgObCUNw8gIEMQoC2vykAv25SgIGYYEFFv2BIaF5wgKU4eoC2mEaA9yhmgMfqaoCNvwgBRc8Vz2XPAYDhgNXPPasFnC3PBMkrK22BKYCv/BtwM3sB5QoMeLBkd2gveLBcdxmdTAw5sHJ3T1t8DFWA4Xsuz0WA7CViZ3K7DYC5qXU5JI95D3DhRKczI12AyeA9DxCPNz5kVxSnImtNgKwQWw8nKSc+VyYnj1aPWOBNgOnXGSAaVz8Pd4sgQOGmObBh12iPRo5Yj2fBEqcip2QmWbBroEyPRGFJDyhsSqcUQItPOcsORx/3CqdgT0+wGYCk82YXGEDoQP0FXEDg637LUxtgQPImfStXjx37b4CspwMRYkCHj16PJbFiQOtrM49GuThAnRczO2hNJYCqO13LA4CANF03AG8piBeAlTd7E2T6G4CtICcLC71TgMH7TDcTgMOAjXVzgJBhBQ8I4VGPMSNxQL0gO4DtKUeAm482Y2FAiuA3gOAwdw80MBpAr4CfgNWAv4CWQkFhZsJRMA+PZftQQNmgDlcIQONhYqc/j0QmOYCboARAz2EkQJscbEDfQKYRYkCme1RA1xsAwMBPAkCWa0pAo7dKxzJA3Kc4KQjArHpqQO8nRMCecDjArJN39x1AgSNmQJwrK4C2QKXweYC59z5A/LBlgJ2AufA1gLRlAsCOMC2A07sxQJLAvYCBWXLAyBsjgM+rYsCD8EKLVUDwMxn3MYsngK5LTfAHB1NA2kDecE7xZYtowNtAyKBt8HunV0CJwKRwZzQDiyxA2cDKIGlAtCM4T11VRC1WzyHPWXFl11p3AuVk4BnXYuVh133nBKVroG7XeT049xkZXas7SRPAiFk7ozpbEvdB9B39QgculwNXd3seC0n1LndQM3/3NsCll3X3KXNoMwlAzNcd90ZA3fd2Z0VPaXsV+2lnR5ckwKprc5d6bSOXKCCCMxjAojMMxyOXZHcKjzDAxWM39x89Qy0TAwoXAo8/QJBPP/dzZwugCXcMzzc3J5FKTzNHFU85N2aNcfd4D2djD09fO2+PfmdhT35VM7dGzzjna6c912dxPA9Hy30nMecI20TPOEZLV0r3SichtyerHacE3W63JhsJIO2nKSD3DUVXEkdSD3DbaQ8/dw7nQvdI9ztXIhsLNzp3fdUU1zUgm4ZfmyYguudY9zDXalNRTxNmTrcSd2Ugw7dS9zefFwZoF33AwyDtILPAm2dwhyPA0nd963y3Jpd+2xawXTtkzVK3PED2IM0gryC/7GqPVms7dwYrGncDIIObPGkGj0GjNLdcTx1HYncRl1gPZvB+T2ynGGt7jwnXJ+MHIJEURRdFsXfjarc2e2l3QQcI1wmPBktSYyh3F9ccyySXBEMUayjHc/tmNwXre8CUxwFPAOcYl2fXDLMTk3mdURcSN0agm8C0T1kFEKBawPiEOdt7wJQguIdAV16gp8CeII33TJEAd2A3Hudw13D3B3ErV3mg6VdyJwfXARNHwIonfEcjIKhFO9cRgKGA0YDDoOOgwYDToIOgs6CjoIugk6DzoL1VQlAAAA8uASM2KQF3WzhvB7Y5wR4BVLNXoPB2CNY/VmnBYBonr3Y2VPofUUhvAjZvoMa4OQFsGgUBaJJa2kAAo14bIKCAHvZkkn72NBoShnycGA8/1kRgeRY13HWsJRZLeizaQXd2GlL2epIC2kksTIYWkhicMGC7OHiMWwEzFmGSSxYnrGsWV6xo2nd2SnJgEhccX6wU9jegtWZ1GmnOfxZavx4yZGEeT3rqAIZBnweGYIYlGh92X1oF1nCBTVpl+iO0X5J7Gl7cGjplD2UkIxoPhlNab8xwUhdfHoxhXmWSAJxF/3FaQJp90S3MbLhyIQSwWXY0Unl2KfRFdgcGZskCgW/SRJp7jAv6FJphlkAyUcwERh5SLgRzjE1sfnZ0YOOgfFpOCkWWYLYU8jzyIO8WwX3BQQhRACY6c2pXVg9gLO8qWkTyWlo8mjDGR0ZmmnIKVppABk9sYAZctlh4U2CjiT2/VJwAOH1qabZmEjqSBWBG8HzkDFpn7FkGb0Yc9Elcci8aL0QKLoEfmi5/aZpEBiKIdrBmkCXQMiwHhH/YUzoJhm3SVSBDiAbvGYFgzGpMOL40CihaTzw+gQrsHZpcBjm2C/JDmh2EEWRQEk6oJL8LL0GOSbZjtiNfY4oxgVoGA1Qx7H/yK7ZrXG4vQexu70eaZZoD4KTSI+CIwGvsQEAcnwH6bcEARznODMwtCDyIUx9kanYvQYF98n2aBbZV7G10KVxRdAFWAZpwWiGafgZVmBSQUCAL0AVgDzJGLgJAEQgZXDNMOT5auFovV0wS+AQGTkxsjmQGQQZy8kkGJYEm8k9Gagoy5B9GBfh23jWsFTRJ/2pwXL8B7hliFaRJunXvLE4gBg6aNkY8tjAGcDIpUnTyGVITL2+Mdsx2CmlsAmJQbAHiBmp+2kfof9kQmHHIckgwvxnkIODQTGcIMpoKRihMfQZwmh5aVWwedn5aIhwB9BL6Xu5IYI/ESt5ZrGKGJAwhVAdg4oFz+iBWS/ocZGv6fICzMAtgtxoDBGtg4BRbYIxYOJwOLAb6X9AK9iLacmCkVH1ghDIxBExSA/o6lkNaVWDjWnVgjwZNYPNaIhRIUlykHCxhGh76MxYcah+sZPZ39EX6MyQ5YLvMOxp1+gcaAFJKcBFg+4Y+FHFg5GwQvzCGHxZgbEUsL3Y9HClgobpjHG8BB1p+YN0aF1ohYPgwOPZBknCMeJD4hkTaI4RkkOxsEjITdghSHWCu+hiQ4bQxGgsWB6wSLCkaTIwgOGWGESw0hgAMDIYonE8QlbhvELFaRDIFdgcQoWx8qF0BNNocYKScZRYzMit7LpBEYNbafRCB9lRgoxDsThMQghxn/zMGB2JS+h0Q/qwa2jwiAhpzanhgsjcQYO32bgwxwQsA6pwvoK/qQhY/oJRPb5D/6g+Qz6DXkLv2H5DI1mM2F6CQUO3ad5DfkIXBb3Evry+RIFD+VVv2aFCwUN+guFDQ8QRQn5wkUMTYA5CXHzbaFGDDEPzsYxCz+guQ0wZBWi0QrtxOFkMMSvpYkmr6FIDguiJglHIInGOsZwwshkqWcVoVkNYcUlInEMkYQzJ9AWMybZC8YO60AmCUxSaQ2NoWkPjaVxw39AWQiIFukLCQrwY/zBBBAbQBkPkyPvpFMgZg8ZD1HFhsXZJ5cjyQspDQhhyg4pD7WlKQgowCkPP0I1CeYL8WGpDajEscIJZvYT4yHIM5cjcGEJD7TipsbWDt9H6Q4No7AVaQhNo3HEKBWWCbGlSWYEI9Wkoyd0EFuhsQxhwrYKVaG2C1kN5Q38E9AXQ4H2B3ELJgwHgFkPgyJZDfEOQyYJptzEEcRWxlEMMGVRDeUnUQn2DNEI4Wd8R+rBQaYs4ClC0MYlCzkNJQllIzEJdgixCRlisQ1dcOENXULhDE4NDGe9hWbBLeIYQJqDXbXl4xEPeICRDOdEDglBwt1GJaXPJSWkUQnBD77DwQquCZBlR2YhC7+HB4MhD9AQoQssIGSFq8EiFotnoQ//pCCnhafEwG7CRaVhCORk88KYFyTEbvfOxx4LgKNAoIEP7uI5IYEL3UDmp95EQQgkJ+bk+Wbh9m4PgGNuDMEKQGbkwRgUTUPeDL4Ml4egZXmkXKVJAH4JIsJ+DCyQ+fbeCjtk2GNdB9oERWItIf4PwGK+x1dCIGfu97VC/g9DClRkPyG5pRZBXggkA14K5EK3gx6haIQ2B+dCwSZsBz4JoGMDC1eAgw3uxTVBd0U0YZVHnvOzwRRivsAtRCiE7g3D4fFH44Wkg+4OUMWAwEeFRycEgihmvQ0eCwWjvQgHZi7AdGYzwYWkPQuFpQeCzg5hDgHGocFogasALgqpItYGLgoZBsITOgCuCszGWBDPQ8zDkGEhCizFqBAEwJ0M6kYOD5ENrMWkhw4ONeBlDo4KNeWODIlHjgzQYcmkEeHQZMBG3WPpZpPAGWZ2ChlhbQt2Cwmj8ULnZImjUQ72DeBDW+MrYOv0WQ5jws0JqWbFIQmjzQ82D82nxSS2C7EJjQ1ZDvGl1gjVosbDkcSIFhjF1adJYskKdQ7BR3BjdQsxoIkJ1grmDLrCtQ5bRFLACWI5J7UORAhpDP0ByQvVDEbDNQ73ZCkJyg5rC2IWiQ71DaYPEafxwI2jciIThxUNZguZIEkISGd/RRsPjQ+JxXEMUWIVCrrxFQxX8PFEmQ/ax82nSGUmC5kLTQ4rDy2ghg6lDP2G4WKvpKnAZQiawm2jEwpBp8UKOQwlDa0LOw96CuwWBQlFCYOh5reK1OwRXBL7D+NlRQv2CiNlhQ/sFjEn6GKDYfoN3WcHDvYwBgwIpgAAAANxkLHB85XgMlTB9PIXRwsG9aTwYBLHD3IXBvFyFSYFgfLc5Lr3lBBy8utFpQzzJ6UIwA4atuYDAfGfEnzxFBfdwM2h2Q/GDdsPSreGB/7zWSUXpNklSvJDQpsIH6MZCJkgxJbmAP7wxBAC8cQR28DrC7UKFkB1CIzy0rAGBH72t2Inoeb2DQv5IN+gyWEXCvkSvvMyRfb0pvCVpjYMP6Vp4GtH4tY+9MWDFSM+8Dr0bQlrhwsOeMBWxvNB3vfWx6diX2RzC3+jC2dO8dwTUcPcE3MP2QZe8x+Ex2Rk5sdi26GvYmENZGLTCi7wHUcsELwUrBSTpxkBnvYfhgdlFuUHY3Xze6CGR/0P+aQDDeRmfBb0JjOm3iRrZQgIrAYe9TXBu2aN87tmKRcdcF4OVGFewjmhlGSBBxtm3g/zpptkSiBxAO70N8FYhGVkDUKV8NQB8TUexr4IYGN5oh7yH/TCFwiHgheXDAEOkvDOwuthK6QmRJ0gRgW0Z97EH4M0Y3tjNMdUIDYGwhNF404BUvPNxFOg+kYrYD0hoaclJLMNrgqOwv7DZ8coMXYkNfZp4j+heQgy9H0ki2T1Yw9DWkMy1eEJ4KZvQbWG1BGb8Tuj1BJLdSDCRvCxCUbz7oNG9Dr0/kEwYYmkFaX6BicNlBUvIrryncYm95OlJvS9EKb0+BDxp7BjjQkPCGbwfPHVxGcN6SVm8NEFavJEB2ryuWIv8eb3X0RVCzdlTfAa8hbyGvEW9Pz1GverdCr1pWEq9ajFlvCq9SNEGw8pCwhjtNN39wlk/vdW9ALy1vYMIdbwK6AN9Vlj5wl9xfUOlQpNo58JAvHK8rbxfvG29tsAR/GORmlAifYzIhQSPcFNCTsKhEBv80MDnuOC9orzvvAO9tVk+ecpwiX02gMO9ycM4/FJIDELew8ADjgTcvC3CAek8vIgEQbxWDRuZXCMYMed4sUJEMLwiAUK2Dft5vCPovFwjAiM3vZFCgcJ+wj51fCKhQiIjK2CMI7agWv1MIlBBzCPsvSdwCUJrQ9JI7CJxic3CplhqBW29b9CHuMUBqHmdvdQjnRE0I5pJTsJV2XQjXgQR6eC9DCPXwbW8uP0SvYZCDbyZBcQipUI5glbDlPmyvMEFn7wKWEnp6CIlvRgi6NBlvON95b3yQobCLUJKMCvCbKB4I8XD1PhD2Heo2bz0YIroOrz1kbm8FUNN2S1oKCMFvLIDrPxoIoB8tkjgIgHIjYDJvXrokCKpvOwZY0KKw9AiOkgZwyB8Nek2vS2p2sCGkXa8wSnRvUoFQCL52RLDAYEgI8I5oCLJw8dxJUlTvG9Qn0h/AKLYVpDW6QUCe0L+Md/C6IV3ScnZfrzzvYu96dB3wo1ZG4n3wqZ9qQCPwtHZrMLwKM/Dv+EtBQUBrQViQGu9w3CnwqVZetmc6Loj/tjAQxTDIBmXwhGIWunXwz5DvA07vE0x28Ji6NbZu8J2fXvDVmlYwwfCjvz3Q9UIR8ITEU7ZxkCLwiUwS8O1kMvCsSArw1OR5tiww1UY27zrwuMEt4KikNCJQIXQQePCs+ETw4NJ05Dc/NPC/mj4wpfJWBmzwurZMRny4fPDxkD9wq1IsdnuWdaIQ8I0wsPCN0lAGCPDGbFE6J1geIljw2JBHcLp2bZZXEldwmdCFEP0vVzD/NnZw9B8/bjNwyZZ/umAIyK9BlkB0SxCtcJzuKojIrxqIgwiPgX36dmxMsLNgk3DfjhkInoiVcPWIhWCMkKVg8NDTSyxgMXCGryiWVgieNFqQ51pBYLbPHUtAXxWSaginFFoI1oj33AFw0ZCZsI/BXqssYHpwnkFV1CZwzdwWcOFQgIxwyPlDLGBfiJEWVnDw73uQnhZYYIsMJMj4kAxwm0E8cJ8hPfZmAXXI2fZb1lwhIkNscIVxQlAAAEU892u3DaCBl32gxaCVIOSXISDYl0D3B8COD1zwAc9JHzCXOvcqZwfZA9dIY3DPHrCWNgDPZlcEY19PHddKN1sXEBcqz23PGWdXT1H3OXc5ZiY3TFdkTUyggPN55jIg56MjTxPXGUDDZxZAj8D9FyZPR+UMhyGgwrUmdwAgzZcG13xAvSBihweXTqD+wMfzWCDa4AFAkkDguXJA4cCPi1VzN49vJnNzEKDCQK4rZU9hj2GHPMCkBW1PXCDUQK7HLikqT2lTBHd+z3Q3e4p691n3MKc3tw1neyC0Ux0PSOYJA2QXGGcvZwu3cyCkoPrPP8iTBznXfrcGV2kVUs9EoPuRFiDw6wsnUUdAoN2zR/cyYXsghE8EzwbzesYa231PP8ceRxCXEycdILL3KPct43so2TBJt3g3Gv1vyNsQPyjluzE1QCjNBDEg/Pcn2XgPYKiSB07tBCioSRiouosV/TQXQqCn0ViNHyi9kL+wVZcxh3co55cuTz+3MfDDOELPfXtI6zy3MKjESPrqK/chwzBrGiCbrz/IxCCLhzLArYdfNwgXK1sAt2fHHxdozxF7KlV8oNQoxQjnyLfAkMc4SwqgwMDBKKFTZecSFXfAtiiSKP33VCC9DTCguSis13NAUsDItSjAxiihrTig+MDwIMlPCncEwKootS00YwYgyWc5BWk3dPtcoJ1A9+MxoNfAyY0CIKwo3ndOQNHnGaC0QIWVZCjnlEFJT0D2qXEwPscFlXH3M/AGkXBAo2FvKChA9qU3LDnXHE1e/X+A3w9rQP8PUcDfyNMooOtO+gDNA0DNYTvnbWFrdw6o/DdOzzrA5Vha/U1A+2EdKUMPV3ds515HdAd/oz01RUDHDjEpdWAw92vIh8jQOSFrOaDSBxaXNzUJz3QnUQcql3fZBmjLoJug7mjeaOugvmiroMFo4QtCUAAAR1PIoIc8bnsuS5F9bgReCl4gRnduOO0CXlReFkjUg3luc25a9xlowl4yyOacPR8KLDcAj+gLzkxyHYIuAKYIJQ5eHDmCTggRyW9wszoetGeQ0RANLGweMkE2ANjkU8QWgnHOPP5EBwnuTX9Ozh8MPOCutBISDfC8iNvhBrhDX3rvCI4kgmiOFt8IXnSOMIJP8JCILYRU3mdoy0jnNHaIKGBKPineB8wbAkHIOwI2WCsaN0wOjjdOHXx0QifMZogJCDXA/iJN329gKCA5JDk+SY5BXCNOB0jKUGVOEQIFiG8fGb8i7nJqDYh8hgtqIYBTJyKEO4JCQg2fNhBLSBwga0hX7l4sR7g2TjrsPtlviBfBIwx2hhfQlMRdZFIIfYASTlpAMk5nJSxOCWx8MSz/fmY8SASiC7N9il+eJoQpTiOuaE5t6MUOBAJUTnZINeibYASEBKo2eEuKEOZuCUmSeDQ3nicDbypjfhLOPZ42EA1kCej2WCno1r4gGINIfZ4R6NomRSgEiAhgh0h3KgzoKrBXSBaeAx86Qj0qCWAEbmzo5G47uGEECL9W6Kg0GU5cGI0CA0566NoA404NKmXiLSo0HiTeU+geLELIHMinAzYqb35abll6FPwyiBdOYwIujlV+dhiVfgbILOiqjkf4ZShBtnHIRUo+KmvsUbREnlneJZBsKmFuPAJSvwTqIbp+jk6OMUJQ3DjObw4lGKvIBIICzkDUSOjQ/Ep4YioZND/IByJlYj0ia/oC8MTcHMotbkZOb2A2jmgmDQgqgi7OYR5NDnsYoYJXaLRSd2iJuBRuGhRI/DkeKEo6KEgXPkAOyn/KEMZmCHNo9ghLaLcxJc59XmXOcJj7nnMgS84V4gUoD8p2zGYeAPJbZDYecxc3NkIebm50WGDuaejSr0gsN4Jy6MadU6oO9HOqXuJZEDsoRDBLoicoRy5DLmPPMU5sujV4fO4WFifQIu4MQkxGZvD4MD+qLV4l6CBqKQhPGDXgWKh16LZuIqCl3C7uU+5l4nPucKR2QifMIe5h+jX+TEYt3yHkAxRSqD4CSwodfHquIK5t+msiPTQN7inubMByQk1CAche6P3ubEJhEMNCNx4TQjO8GThsfyGoNZj4rjsJLWp37jTOBPYx/y7o9UjLSM7+SFAJanRhMMIKQkksS38RID0AG5jUrjsJWO4ZfxNsHQgoiEwecYZPMm+2GnCFIKP6A2p7HCrCU8RRiMAIxOJBmJxwkW1FrmqY3sIy7ixYkKJdz1auWW4nLjYffB5xLkBYhS47CTxY1Ji42FxY9Fja+ipYjBcrElpYqpj8WLPPaCIhrmxYkR9SWOsuFljqWKXcBlihmOjYZliOWNZYjTVRf15Yxljs2GFYoljOWNhCVkgZZCDiMsgSHyTo94p7kXoIYxjLkAsvVjpm2lvGTpgm5BrEaVg+olDoGs4+gCjoBxBqAnfeJwhDPwIsC9BwOE4iY/9YPw4AO2jRAAEiFYYFOg6gYLg5Ki1A+9ASEEX4PeIkQMFgfJjpTnKgZJEYISSMSwhLHDUiKsIaP1FQm/Qan2dIA78R4BP4WUhgQllvduhfgmGMbugjgAzcK/CtKM88ZX5aV0FyYh9BiAeOCjgjSgQwv+4ZmLFQnVCLGG8iW2Rg9gXoPdgQXGOsSwggwQ3oMiwCcLdkaM4s6DOfPI5LiA74IMptAHeqEV9ikjaY3rDLajJ8ZeRe8nWIDjQd32+sPcB+cifoF+gLgHlIbWjZwE0OVq8KOAJSaX8bPhLKRIwyygNJRsjSMGJhQBhp8mQUCOhOjggYIYRiLAz4arAqRDh/RBgOFHYOLGQMsKZcdYA3aALiKUAbcn7KDPhA6NLhBkAsGHZ4SaJg50kYAYpcmNIYa2jbaImQWB5UX3geNz5EHlCEXBhL7h8+FNjL3z2iWv4K/kw48FiQyjOiFDhNGFBkJOIpIS58SoosOIw46v5K/hBiGrYEEmAgfWJXUm7oVa5+wEXKUzhGMDvuSjjWOK1iQJhpphCYeu53GA7cLxhEtl8YdjihOOBiDjiROIcYTT4yEKzObmJwmDPeOJQp4gqw4eA9PiM+Az50mBnuQpg57jliVhBiQgqYZTj9Pj043TjDPhPKARQW7hs+bGII5H5iCL5Dyhx/Y8om7ls4sZgjOL6YS+5pmGbiWWIaYmQ4c395QA2oOziJYm84hziNmDTuHUgM7k+iYrloEGNiORwzYgtiSLix3l+YCB4tamD2V5hNZD7/XpivmGi4y2I0uKi4o5hlok/kcH4Hlgqee8pFUEfKGOIo4iK4uFh7anjiCh5Lol5eDxgyP2K42rjo4lq4k49GuKOPZrimuNa4h5R+aI64oWiBaJ5o3vASJ3Fo610xz1tdQbj7XWG4ssBez3r3cdouaLi7DSDVwOEg6DchWSZXOs9OWx6nHKgjKM0o33ccB1Zo+eYHm1ao1XcfJVG44HcNTxIRVyCYRRW4qOCBqISmW8jhD0h3dGiiCyC3e+1uN0tPG7i4aKN3b4dYmRY3Lyj1d1BouiCoKQ+4lg8vuIsXYqjPUUe4mXcAeP7HabdYphB4gFtOJ2uo5I0fIKqnRNdZQLtuU6jtB3Mol5dOKOKndl1KwNencKDeF3gg/HiieVYglajXTVSgiCCKQ0qDIsCSTw2XLsDAIMV3CqDkaymo1kDJj283NrjWeJa4qy0meM54se04S3TAoii+I3SnMnjBeP2okf0aaxHA9aiCeJ6mK9MMeLmo6XiGdwGFMai5wKDAg2cPy0BtP5kpuLhZdXi1GU14h60tuLqjM7ihuP14kbjDeMddA7jJXV147riLeM64nriuuKt4y3ibePt463jHeLt4p3jetGWnfrjIyxEgwzMIqLQ9WVd5IPTqPacPIKW3IJc3dxznBhklwL3hLiDHi1+HCyjZuMTnJSiADUIZSyiXF1e44ScHJ1N3RiCPp07Y8Oc/yLrNTcDQZ1Mgxqj3JzfnInd1uLu3IBlTsGItTw8NU2so3ZdeQOao97cFKJtPGvjsQ0b4y5sv9weo93MsZ1Sow7j0z11wE7jxoM83LMCDFyvVaSjsqJwgko9/q2r7E3smx1G3X7dHdyS7IHimF1mosiiRQJKHPMdTkz5nCKDM+OjpYw9hZz63FXtxZ034vHicxzAgvE9IKKr5eGjPi117HkCdU2X4jaZ0ILgbKfcJtwxo+7juKOp4yLBclC/AmHdph3wgsSjF9xco3+1kN11PW6iwNUNbFKipdw2HCHjUyHtnKATIh2tPUntcz1/7BqDuE2ogl088TQsg4Cj7ty13F5Ur/T0o8qis+I1HBs9By2jnIgSEaLR4/Kj5+KPYyM94+NfHNLs4Vw7PPLcMqNjY850LuJkqTgNBIMfIphNBDxA3F7dHIIvAiucmD3LnbHd9V04E4qDuBIWgtmiloL+4s8ieDyL3YQSy5xLnIKDu9T94g7dqoOkEukdKR08o8Cd620D4/iDg+OJogCcKaLDhKmj++KJoqecMNwmoq6dvWyT47Q8X+LxFPGjQj1xhJrcD5zsEi6dbJyOooU9t+OQZFPjDMGRogldUaKJXJxMgu2qFdddRQOOHM/j0BLzY0PBO40hoh9xzD3fEJbjohJ+4pwd6+Pko5wTGlVtPR0DAaPgXdeM291gLeXdYKMV3IiDTBNxnUXc7MQ+ovBcvqPHnAUdsOyO40cc+NyXzAMdbN3H40dBWoxaEiKM6FwZPePslF2bHcfs5eOp5Dijmkz/A9k9fa09PCTtyKJYra/dBF1v3MsczC26g0/iBS15nD4NSeK6tStcLlzsLOOs3+MIo1Rchj3f4t+NOTxcLS6FYeKNnOmVyZ10XVfdsKK/4sMc4Axeo2ATbwL6ohASChO+3OCiPlHgE+8Vd+LsXKPMWczQEnK1vBJxXY3cN1xxo/ATDA0/Iv1hAqLDBC9dIYyYEicjiHX6LLnimmQqE7I8qhL4ghyjj2MQ7Xnip5SyEgqk/v00PSqiwZxNAk0CfDziEwEDLD08XGoYmVzF44Gs/BPsPDw8yz2PQTYsXQMZElcAHBIeAsI98zxkPY6cleK1jEOFZ52VA4iCsO15rbaDpXWVXNXiRRJd4h3jneMlE+Io0UXd4uKMZIPEgz3iGG3lEhl4OBOYPNoZ7V0vIuNhotzIEgNddIO9xOdd1BJwHcfdDRJn3V6jKoL0zVgSThIiHc0T1RMj4rIceqIXtKHi8+1IEq/iixyS1J0TsQiqo9Mdbl01EqyjEBKf3PZdctwe430SxxjH4lCNWy1EEzFB6T2iHbvjBtyFE5oo2Twg7XbiVDDFEiG9L+JYoiCjIhM2gVMTDKOSE0/MM+NDnYIQcxL7GHLdWdwKoj2lixIJmMMTvd2koysSbFUkoyAMMKIeEyQSdVxUEz5BExJjFMk81T3CbVaDeDzQPeqj2txZVc/iMBI94+MTnEzzEwcMCxIxPAgSAGzHE5NNm+LrHJvlY+NUEwQTFBLHjOoTcO3jXWE9wdzvI9g81RNUxRsCa92mg78DEeMNnUaiAPX6E1+1QwLp5NQdgIL3zCYTCQ3T446i6I2PHbjsmKNGE+iDi+O6PamsslRWEym1KeICnOtdiKLs7c6jemXp4yaiQBM/AirUswJZLdni2ePgk9g14RKKLd0dk1x4NDETT3Q8HAY86rT7AnCT3gwm1P8TSXUpE0GthdRig+l1JwJl46nsG/RQguv0FeIR4gfiQA3PExa0Ng1kEvUTIPU0E51iTM0NXCUTbeJ4k7iS+JPFEgSSpRP4kw/AgAA",
            character_set: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", // Q, d, j, k, q, v, w, x, z, 0, 1, 2, 3, 5, 8, 9 missing
            blob_min_pixels: 15,
            blob_min_width: 3,
            blob_min_height: 5,
            blob_max_width: 20,
            blob_max_height: 20,
            pattern_width: 60,
            pattern_height: 60,
            pattern_maintain_ratio: true,
            perceptive_colorspace: true,
            model_loaded: function() {
                setTimeout( () => { solveCI(); }, 1000);
            }
        });
    }

    var solveCI = function() {
        cbl.solve(`#${imgElmId},#captchaClaimsImage img,#captchaAddressImage img`).done(function (solution) {
            // console.log(`Solution: ${solution}`);
            let solutionElement = getSolutionElement();
            // console.log(solutionElement);
            solutionElement.value = solution;
            // console.log(`Input value: ${inputElm.value}`);
        });
    };

})();
