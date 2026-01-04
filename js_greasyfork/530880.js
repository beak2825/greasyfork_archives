// ==UserScript==
// @name         AB Links Solver
// @namespace    ABLinks Solver(Solves Ablinks images)
// @version      3.1
// @description  Solves AbLink images
// @author       info1944
// @license      MIT
// @match        https://kedch.com/
// @match        https://onebitco.com/BTCFaucet/
// @match        https://litefaucet.in/faucet
// @match        https://freeltc.fun/faucet/currency/*
// @match        https://eftacrypto.com/claim/tron/
// @match        https://earncryptowrs.in/faucet/*
// @match        https://claimcoin.in/faucet
// @match        https://whoopyrewards.com/faucet
// @match        https://ourcoincash.xyz/faucet
// @match        https://claimclicks.com/*
// @match        https://linksfly.link/faucet/currency/*
// @match        https://gamerlee.com/faucet/currency/*
// @match        https://cashbux.work/faucet
// @match        https://cashbux.work/madfaucet
// @match        https://mamineearn.online/faucet
// @match        https://coinarns.com/faucet/
// @exclude      *://btcbunch.com/*
// @noframes
// @connect      https://unpkg.com
// @require      https://unpkg.com/opencv.js@1.2.1/opencv.js
// @require      https://unpkg.com/jimp@0.5.2/browser/lib/jimp.min.js
// @require      https://unpkg.com/tesseract.js@2.1.5/dist/tesseract.min.js
// @grant        GM_xmlhttpRequest
// @antifeature  referral-link  

// @downloadURL https://update.greasyfork.org/scripts/530880/AB%20Links%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/530880/AB%20Links%20Solver.meta.js
// ==/UserScript==

// This script solves Ablink images with words and having 3 or 4 different options
// Number identification logic for comparing words and numbers will be implemented in the next versions
// Accuracy can be improved by adding more filters for different types of images and fonts
// This script does not have a global matcher, you will need to add the websites in the matcher section manually, till
// all the solutions are implemented
// Your account will be locked for 24 hours, if 3 incorrect solutions are provided consecutively in 10 minutes. (This is the default but depends on website)
// To avoid this add a rotator to change the website whenever an incorrect solution is provided.

// TODO: Refactor Code
(function() {
    'use strict';

    var questions = [];
    var questionImages = [];
    var questionImage = "";
    var questionImageSource = "";
    var numericWordArray = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

    // Crea un cuadro de consola personalizado
    var consoleBox = document.createElement('div');
    consoleBox.id = 'myConsole';  // Agrega el ID aquí
    consoleBox.style.position = 'fixed';
    consoleBox.style.bottom = '0';
    consoleBox.style.width = '100%';
    consoleBox.style.height = '200px';
    consoleBox.style.backgroundColor = 'black';
    consoleBox.style.overflowY = 'scroll';
    consoleBox.style.border = '1px solid black';
    consoleBox.style.padding = '10px';
    consoleBox.style.textAlign = 'center';  // Alinea el texto a la izquierda
    consoleBox.style.color = 'white';  // Establece el color del texto
    document.body.appendChild(consoleBox);

    // Crea una nueva función para imprimir mensajes en la consola personalizada
    function myLog(message) {
        var p = document.createElement('p');
        p.style.wordWrap = 'break-word';
        p.textContent = message;
        consoleBox.appendChild(p);
        // Auto scroll to the bottom
        consoleBox.scrollTop = consoleBox.scrollHeight;
    }

    async function waitForImage(imgElement) {
        return await new Promise(res => {
            if (imgElement.complete) {
                return res();
            }
            imgElement.onload = () => res();
            imgElement.onerror = () => res();
        });
    }

    async function toDataURL(c){
        return await new Promise(function(resolve){
            const dataURI = c.toDataURL('image/png');
            return resolve(dataURI);
        })

    }

    async function removeNoiseUsingImageData(imgdata,width,height,threshold){
        return await new Promise(function(resolve){
            var noiseCount =0;
            var noiseRowStart = 0;
            for (let column = 0; column < width; column++) {
                let count = 0;
                for (let row = 0; row < height; row++) {

                    let position = row * width + column;
                    let pixelAtPosition = imgdata[position];

                    //Remove noise from first row and last row
                    if(row == 0 || row == height-1){
                        imgdata[position] = 0xFFFFFFFF;
                    }

                    if (pixelAtPosition == 0xFF000000){
                        if(noiseCount == 0){
                            noiseRowStart = row;
                        }
                        noiseCount++;
                    }else{
                        //Define the number of consecutive pixels to be considered as noise
                        if(noiseCount > 0 && noiseCount <= threshold){
                            //Start from noiseRow till current row and remove noise
                            while(noiseRowStart < row){
                                let noisePosition = noiseRowStart * width + column;
                                imgdata[noisePosition] = 0xFFFFFFFF;
                                noiseRowStart++;
                            }
                        }
                        noiseCount =0;
                    }
                }
            }
            return resolve(imgdata);
        })

    }

    async function imageUsingOCRAntibotQuestion(image) {

        if (!image || !image.src) {
            myLog("No images found");
            return;
        }

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = image.src
        await waitForImage(img);
        var c = document.createElement("canvas")
        c.width = img.width;
        c.height = img.height;
        var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0);

        var imageData = await ctx.getImageData(0, 0, c.width, c.height);
        var data = await imageData.data;
        //  myLog(data);

        await ctx.putImageData(imageData, 0, 0);

        let src = await cv.imread(c);
        let dst = new cv.Mat();
        let ksize = new cv.Size(3, 3);
        // You can try more different parameters
        await cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);

        await cv.imshow(c, dst);
        src.delete();
        dst.delete();

        //myLog( c.toDataURL());
        let imageDataURI = await toDataURL(c);
        return await (imageUsingOCR(imageDataURI));
    }

    async function imageUsingOCRAntibotLowValues(image) {

        if (!image || !image.src) {
            myLog("No images found");
            return;
        }

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = image.src;
        await waitForImage(img);

        var c = document.createElement("canvas")
        c.width = img.width;
        c.height = img.height;
        var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0);
        //myLog(await c.toDataURL());
        var imageData = await ctx.getImageData(0, 0, c.width, c.height);
        var data = await imageData.data;

        //Make the image visible
        for (let i = 0; i < data.length; i += 4) {

            if ((data[i] < 100 || data[i + 1] < 100 || data[i + 2] < 100) && data[i+3]>0) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
            } else {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
            }
            data[i + 3] = 255;
        }

        //Remove Noise from Image
        var imgdata = await new Uint32Array(data.buffer);

        imgdata = await removeNoiseUsingImageData(imgdata,c.width,c.height,1);

        await ctx.putImageData(imageData, 0, 0);

        //myLog( c.toDataURL());
        let imageDataURI = await toDataURL(c);
        return await (imageUsingOCR(imageDataURI));
    }

    async function imageUsingOCRAntibotHighValues(image) {

        if (!image || !image.src) {
            myLog("No images found");
            return;
        }

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = image.src;
        await waitForImage(img);

        var c = document.createElement("canvas")
        c.width = img.width;
        c.height = img.height;
        var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0);
        //myLog(await c.toDataURL());
        var imageData = await ctx.getImageData(0, 0, c.width, c.height);
        var data = await imageData.data;

        //Make the image visible
        for (let i = 0; i < data.length; i += 4) {

            if ((data[i] > 100 || data[i + 1] > 100 || data[i + 2] > 100) && data[i + 3] > 0) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;

            } else {

                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
            }
            data[i + 3] = 255;
        }

        //Remove Noise from Image
        var imgdata = await new Uint32Array(data.buffer);

        imgdata = await removeNoiseUsingImageData(imgdata,c.width,c.height,1);


        await ctx.putImageData(imageData, 0, 0);
        //myLog( c.toDataURL());
        let imageDataURI = await toDataURL(c);
        return await (imageUsingOCR(imageDataURI));
    }

    async function splitImageUsingOCRAntibotLowValues(questionImageSource, answerImagesLength) {

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = questionImageSource;
        await waitForImage(img);

        var c = document.createElement("canvas")
        c.width = img.width;
        c.height = img.height;
        var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0);
        //myLog(await c.toDataURL());
        var imageData = await ctx.getImageData(0, 0, c.width, c.height);
        var data = await imageData.data;

        //Make the image visible
        for (let i = 0; i < data.length; i += 4) {
            if ((data[i] < 100 || data[i + 1] < 100 || data[i + 2] < 100) && data[i+3]>0) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;

            } else {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;

            }
            data[i + 3] = 255;
        }

        await ctx.putImageData(imageData, 0, 0);
        //myLog(c.toDataURL());
        let imageDataURI = await toDataURL(c);

        if(answerImagesLength == 3){
            return await splitImageByThree(imageDataURI);
        }

        return await (splitImage(imageDataURI));

    }

    async function splitImageUsingDefaultValues(questionImageSource, answerImagesLength) {

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = questionImageSource;
        await waitForImage(img);

        var c = document.createElement("canvas")
        c.width = img.width;
        c.height = img.height;
        var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0);
        //myLog(await c.toDataURL());
        var imageData = await ctx.getImageData(0, 0, c.width, c.height);
        var data = await imageData.data;

        //Make the image visible
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 0 && data[i + 1] > 0 && data[i + 2] > 100 && data[i+3]>0) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;

            } else {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;

            }
            data[i + 3] = 255;
        }

        var imgdata = await new Uint32Array(data.buffer);

        //Remove Noise from Image
        imgdata = await removeNoiseUsingImageData(imgdata,c.width,c.height,1);

        await ctx.putImageData(imageData, 0, 0);
        //myLog(c.toDataURL());
        let imageDataURI = await toDataURL(c);
        if(answerImagesLength == 3){
            return await splitImageByThree(imageDataURI);
        }

        return await splitImage(imageDataURI);

    }


    async function splitImageUsingOCRAntibotHighValues(questionImageSource, answerImagesLength) {

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = questionImageSource;
        await waitForImage(img);

        var c = document.createElement("canvas")
        c.width = img.width;
        c.height = img.height;
        var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0);

        //myLog(await c.toDataURL());


        var imageData = await ctx.getImageData(0, 0, c.width, c.height);
        var data = await imageData.data;

        //Make the image visible

        for (let i = 0; i < data.length; i += 4) {

            if ((data[i] > 100 || data[i + 1] > 100 || data[i + 2] > 100) && data[i + 3] > 0) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;

            } else {

                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
            }
            data[i + 3] = 255;
        }

        var imgdata = await new Uint32Array(data.buffer);

        //Remove Noise from Image
        imgdata = await removeNoiseUsingImageData(imgdata,c.width,c.height,1);


        await ctx.putImageData(imageData, 0, 0);

        let imageDataURI = await toDataURL(c);

        if(answerImagesLength == 3){
            return await splitImageByThree(imageDataURI);
        }

        return await splitImage(imageDataURI);

    }

    async function splitImage(imgSource) {

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imgSource
        await waitForImage(img);
        var c = document.createElement("canvas")
        c.width = img.width;
        c.height = img.height;
        var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0);

        var imageData = await ctx.getImageData(0, 0, c.width, c.height);
        var data = await imageData.data;
        var imgdata = await new Uint32Array(data.buffer);

        //Scan from left to right
        //Get the weight of white spaces
        //Ignore first white space and last white space
        var sequenceLength = 0;
        var prevColumn = 0;
        var hashMap = new Map();
        var first = 0;
        var second = 0;
        var third = 0;
        var firstMaxColumn = 0;
        var secondMaxColumn = 0;
        var thirdMaxColumn = 0;

        //Remove Noise from Image
        imgdata = await removeNoiseUsingImageData(imgdata,c.width,c.height,1);

        //await ctx.putImageData(imageData, 0, 0);

        //myLog(await c.toDataURL());


        for (let column = Math.floor(0.1 * c.width); column < c.width; column++) {
            var count = 0;
            for (let row = 0; row < c.height; row++) {

                var position = row * c.width + column;
                var pixelAtPosition = imgdata[position];
                if (pixelAtPosition == 0xFFFFFFFF) {
                    count++;
                }

            }

            //Get the blank spaces based on weight of the column
            if (count > Math.floor(0.88 * c.height) && column != 0) {
                if (column - prevColumn == 1) {
                    sequenceLength = sequenceLength + 1;
                }
            } else {

                if ((column - sequenceLength != 1) && (column != 0 || sequenceLength != 0 || column != c.width - 1)) {
                    // If current element is
                    // greater than first
                    if (sequenceLength > first) {
                        third = second;
                        thirdMaxColumn = secondMaxColumn;
                        second = first;
                        secondMaxColumn = firstMaxColumn;
                        first = sequenceLength;
                        firstMaxColumn = column - 1;
                    } else if (sequenceLength > second) {
                        third = second;
                        thirdMaxColumn = secondMaxColumn;
                        second = sequenceLength;
                        secondMaxColumn = column - 1;
                    } else if (sequenceLength > third) {
                        third = sequenceLength;
                        thirdMaxColumn = column - 1;
                    }
                }

                sequenceLength = 0;
            }

            prevColumn = column;

        }

        firstMaxColumn = firstMaxColumn - Math.floor(first / 2)
        secondMaxColumn = secondMaxColumn - Math.floor(second / 2)
        thirdMaxColumn = thirdMaxColumn - Math.floor(third / 2)

        var columnArray = [firstMaxColumn, secondMaxColumn, thirdMaxColumn];
        columnArray = await columnArray.sort(function(a, b) {
            return a - b;
        });


        await ctx.putImageData(imageData, 0, 0);


        let url = await questionImage.src.replace(/^data:image\/\w+;base64,/, "");
        let buffer = await new Buffer(url, 'base64');
        //Check if overlaps are detected and split the images
        var len = [];
        len[0] = columnArray[0] - 0;
        len[1] = columnArray[1] - columnArray[0];
        len[2] = columnArray[2] - columnArray[1];
        len[3] = c.width - columnArray[2];

        for (let i = 0; i < len.length; i++) {
            if (len[i] < Math.floor(0.1 * c.width)) {
                myLog("Overlap detected");
                return;
                break;
            }
        }

        await new Promise((resolve, reject) => {

            Jimp.read(buffer).then(async function(data) {
                await data.crop(0, 0, columnArray[0], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    let img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = src
                    await waitForImage(img);
                    questionImages[0] = img;
                    resolve();
                })
            });
        });

        await new Promise((resolve, reject) => {
            Jimp.read(buffer).then(async function(data) {
                await data.crop(columnArray[0], 0, columnArray[1] - columnArray[0], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    var img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = src
                    await waitForImage(img);
                    questionImages[1] = img;
                    resolve();

                })
            });
        });

        await new Promise((resolve, reject) => {
            Jimp.read(buffer).then(async function(data) {
                await data.crop(columnArray[1], 0, columnArray[2] - columnArray[1], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    var img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = src
                    await waitForImage(img);
                    questionImages[2] = img;
                    resolve();

                })
            });
        });

        await new Promise((resolve, reject) => {
            Jimp.read(buffer).then(async function(data) {
                await data.crop(columnArray[2], 0, c.width - columnArray[2], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    var img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = src
                    await waitForImage(img);
                    questionImages[3] = img;
                    resolve();
                })
            });
        });
    }


    async function splitImageByThree(imgSource) {

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imgSource
        await waitForImage(img);
        var c = document.createElement("canvas")
        c.width = img.width;
        c.height = img.height;
        var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0);

        var imageData = await ctx.getImageData(0, 0, c.width, c.height);
        var data = await imageData.data;
        var imgdata = await new Uint32Array(data.buffer);

        //Scan from left to right
        //Get the weight of white spaces
        //Ignore first white space and last white space
        var sequenceLength = 0;
        var prevColumn = 0;
        var hashMap = new Map();
        var first = 0;
        var second = 0;
        var third = 0;
        var firstMaxColumn = 0;
        var secondMaxColumn = 0;
        var thirdMaxColumn = 0;

        //Remove Noise from Image
        imgdata = await removeNoiseUsingImageData(imgdata,c.width,c.height,1);

        //await ctx.putImageData(imageData, 0, 0);

        //myLog(await c.toDataURL());


        for (let column = Math.floor(0.1 * c.width); column < c.width; column++) {
            var count = 0;
            for (let row = 0; row < c.height; row++) {

                var position = row * c.width + column;
                var pixelAtPosition = imgdata[position];
                if (pixelAtPosition == 0xFFFFFFFF) {
                    count++;
                }

            }

            //Get the blank spaces based on weight of the column
            if (count > Math.floor(0.88 * c.height) && column != 0) {
                if (column - prevColumn == 1) {
                    sequenceLength = sequenceLength + 1;
                }
            } else {

                if ((column - sequenceLength != 1) && (column != 0 || sequenceLength != 0 || column != c.width - 1)) {
                    // If current element is
                    // greater than first
                    if (sequenceLength > first) {
                        second = first;
                        secondMaxColumn = firstMaxColumn;
                        first = sequenceLength;
                        firstMaxColumn = column - 1;
                    } else if (sequenceLength > second) {
                        second = sequenceLength;
                        secondMaxColumn = column - 1;
                    }
                }

                sequenceLength = 0;
            }

            prevColumn = column;

        }

        firstMaxColumn = firstMaxColumn - Math.floor(first / 2)
        secondMaxColumn = secondMaxColumn - Math.floor(second / 2)

        var columnArray = [firstMaxColumn, secondMaxColumn];
        columnArray = await columnArray.sort(function(a, b) {
            return a - b;
        });


        await ctx.putImageData(imageData, 0, 0);


        let url = await questionImage.src.replace(/^data:image\/\w+;base64,/, "");
        let buffer = await new Buffer(url, 'base64');
        //Check if overlaps are detected and split the images
        var len = [];
        len[0] = columnArray[0] - 0;
        len[1] = columnArray[1] - columnArray[0];
        len[2] = c.width - columnArray[1];

        for (let i = 0; i < len.length; i++) {
            if (len[i] < Math.floor(0.1 * c.width)) {
                myLog("Overlap detected");
                return;
                break;
            }
        }

        await new Promise((resolve, reject) => {

            Jimp.read(buffer).then(async function(data) {
                await data.crop(0, 0, columnArray[0], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    let img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = src
                    await waitForImage(img);
                    questionImages[0] = img;
                    resolve();
                })
            });
        });

        await new Promise((resolve, reject) => {
            Jimp.read(buffer).then(async function(data) {
                await data.crop(columnArray[0], 0, columnArray[1] - columnArray[0], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    var img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = src
                    await waitForImage(img);
                    questionImages[1] = img;
                    resolve();

                })
            });
        });

        await new Promise((resolve, reject) => {
            Jimp.read(buffer).then(async function(data) {
                await data.crop(columnArray[1], 0, c.width - columnArray[1], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    var img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = src
                    await waitForImage(img);
                    questionImages[2] = img;
                    resolve();
                })
            });
        });
    }


    async function imageUsingOCRAntibotQuestion1(image) {

        if (!image || !image.src) {
            myLog("No images found");
            return;
        }

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = image.src
        await waitForImage(img);
        var c = document.createElement("canvas")
        c.width = image.width;
        c.height = image.height;
        var ctx = c.getContext("2d");
        // ctx.filter = 'grayscale(1)';
        await ctx.drawImage(img, 0, 0);

        var imageData = await ctx.getImageData(0, 0, c.width, c.height);
        var data = await imageData.data;
        //  myLog(data);

        await ctx.putImageData(imageData, 0, 0);


        let src = await cv.imread(c);

        let dst = new cv.Mat();
        await cv.medianBlur(src, dst, 3)

        await cv.imshow(c, dst);

        src.delete();
        dst.delete();

        //myLog( c.toDataURL());
        let imageDataURI = await toDataURL(c);

        return await (imageUsingOCR(imageDataURI));
    }



    async function imageUsingOCRAntibot1(image) {
        var img1 = image;

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = img1.src
        await waitForImage(img);

        var c = document.createElement("canvas")
        c.width = img1.width;
        c.height = img1.height;
        var ctx = c.getContext("2d");

        await ctx.drawImage(img, 0, 0);


        var imageData = await ctx.getImageData(0, 0, c.width, c.height);
        var data = await imageData.data;


        var hashMap = new Map();

        for (let i = 0; i < data.length; i += 4) {

            var rgba = data[i] + ',' + data[i + 1] + ',' + data[i + 2] + ',' + data[i + 3];

            if (hashMap.has(rgba)) {
                hashMap.set(rgba, hashMap.get(rgba) + 1)
            } else {
                hashMap.set(rgba, 1)
            }

        }

        var data_tmp = [];
        var data_tmp_edges = [];

        for (let i = 0; i < data.length; i += 4) {

            if (data[i + 3] > 130 && data[i] < 100 && data[i + 1] < 100 && data[i + 2] < 100) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 255;
                data_tmp_edges[i] = 1;
                data_tmp_edges[i + 1] = 1;
                data_tmp_edges[i + 2] = 1;

            } else {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = 255;

            }
        }

        await ctx.putImageData(imageData, 0, 0);

        let imageDataURI = await toDataURL(c);

        return await (imageUsingOCR(imageDataURI));

    }


    async function imageUsingOCRAntibotFiltered(image) {

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = image.src
        await waitForImage(img);

        let mat = cv.imread(img);

        var c = document.createElement("canvas")
        c.width = image.width;
        c.height = image.height;
        var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0);
        var imageData = await ctx.getImageData(0, 0, c.width, c.height);
        var data = await imageData.data;
        //  myLog(data);

        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 130 && data[i] < 100) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = 255;
            } else {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 255;
            }

        }


        await ctx.putImageData(imageData, 0, 0);


        let src = await cv.imread(c);

        let dst = new cv.Mat();

        let M = cv.Mat.ones(2, 1, cv.CV_8U);
        let anchor = new cv.Point(-1, -1);

        // Opening , remove small particles from image
        await cv.morphologyEx(src, dst, cv.MORPH_OPEN, M, anchor, 1,
                              cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
        await cv.imshow(c, dst);

        //Image erode, thinning the text

        src = await cv.imread(c);
        M = cv.Mat.ones(2, 1, cv.CV_8U);
        await cv.erode(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
        await cv.imshow(c, dst);

        src.delete();
        dst.delete();
        M.delete();

        // myLog( c.toDataURL());

        let imageDataURI = await toDataURL(c);
        return await (imageUsingOCR(imageDataURI));

    }

    async function imageUsingOCRAntibotFiltered1(image) {

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = image.src
        await waitForImage(img);

        let mat = cv.imread(img);

        var c = document.createElement("canvas")
        c.width = image.width;
        c.height = image.height;
        var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0);
        var imageData = await ctx.getImageData(0, 0, c.width, c.height);
        var data = await imageData.data;
        //  myLog(data);

        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 130 && data[i] > 70) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = 255;
            } else {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 255;
            }

        }

        await ctx.putImageData(imageData, 0, 0);

        let src = await cv.imread(c);
        let dst = new cv.Mat();
        let M = cv.Mat.ones(2, 1, cv.CV_8U);
        let anchor = new cv.Point(-1, -1);

        // Opening morphology, remove noise from image
        await cv.morphologyEx(src, dst, cv.MORPH_OPEN, M, anchor, 1,
                              cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
        await cv.imshow(c, dst);
        //myLog( c.toDataURL());

        //Image erode
        src = await cv.imread(c);
        M = cv.Mat.ones(2, 1, cv.CV_8U);
        await cv.erode(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
        await cv.imshow(c, dst);
        src.delete();
        dst.delete();
        M.delete();

        // myLog( c.toDataURL());
        let imageDataURI = await toDataURL(c);

        return await (imageUsingOCR(imageDataURI));

    }

    async function imageUsingOCRAntibot(image) {

        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = image.src
        await waitForImage(img);
        var c = document.createElement("canvas")
        c.width = image.width;
        c.height = image.height;
        var ctx = c.getContext("2d");
        // ctx.filter = 'grayscale(1)';
        await ctx.drawImage(img, 0, 0);

        var imageData = await ctx.getImageData(0, 0, c.width, c.height);
        var data = await imageData.data;

        var hashMap = new Map();

        for (let i = 0; i < data.length; i += 4) {

            var rgba = data[i] + ',' + data[i + 1] + ',' + data[i + 2] + ',' + data[i + 3];

            if (hashMap.has(rgba)) {
                hashMap.set(rgba, hashMap.get(rgba) + 1)
            } else {
                hashMap.set(rgba, 1)
            }

        }

        var maxCount = 0;
        var objectKey = "0,0,0,0";
        await hashMap.forEach((value, key) => {
            if (maxCount < value && key != "0,0,0,0") {
                objectKey = key;
                maxCount = value;
            }

        });

        var alphaValues = objectKey.split(",");
        var alpha = Number(alphaValues[alphaValues.length - 1]);

        var data_tmp = [];
        var data_tmp_edges = [];

        for (let i = 0; i < data.length; i += 4) {

            if (data[i + 3] == alpha) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = 255;
                //Giving some value for representation
                data_tmp[i] = 1;
                data_tmp[i + 1] = 1;
                data_tmp[i + 2] = 1;


            } else if (data[i + 3] > 0) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 255;
                data_tmp_edges[i] = 1;
                data_tmp_edges[i + 1] = 1;
                data_tmp_edges[i + 2] = 1;

            } else {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = 255;

            }
        }


        //Fill if the adjacent value was present earlier
        for (let k = 0; k < 20; k++) {
            for (let i = 4; i < data.length; i += 4) {

                if (data[i] == 0 && data_tmp[i - 4] == 1) {
                    data[i - 4] = 0;
                    data[i - 3] = 0;
                    data[i - 2] = 0;
                    data[i - 1] = 255;
                }
            }
        }

        //myLog(imageData.data);

        await ctx.putImageData(imageData, 0, 0);

        // myLog( c.toDataURL());
        let imageDataURI = await toDataURL(c);

        return await (imageUsingOCR(imageDataURI));


    }

    var worker = "";

    async function imageUsingOCR(img) {
        var answer = "";

        if (!worker) {
            worker = await new Tesseract.createWorker();
        }

        if(!img || img.width ==0 || img.height == 0){
            myLog("OCR cannot be performed on this image");
            return "";
        }

        try {

            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            await worker.setParameters({
                tessedit_pageseg_mode: '6',
                preserve_interword_spaces: '1',
                tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,@!*+',
                //tessedit_ocr_engine_mode:'1'
            });

            await worker.recognize(img, "eng").then(async function(result) {
                answer = result.data.text.trim();
                myLog("Captcha Answer::" + answer);
            });

            //  await worker.terminate();
        } catch (err) {
            myLog(err.message);
            await worker.terminate();

        }

        return answer;

    }


    // Compare similar strings
    var LevenshteinDistance = function(a, b) {
        if (a.length == 0) return b.length;
        if (b.length == 0) return a.length;

        var matrix = [];

        // increment along the first column of each row
        var i;
        for (i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        // increment each column in the first row
        var j;
        for (j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Fill in the rest of the matrix
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) == a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                                            Math.min(matrix[i][j - 1] + 1, // insertion
                                                     matrix[i - 1][j] + 1)); // deletion
                }
            }
        }

        return matrix[b.length][a.length];
    };


    function countPairs(s1, s2) {
        var n1 = s1.length;
        var n2 = s2.length;

        // To store the frequencies of
        // characters of string s1 and s2
        let freq1 = new Array(26);
        let freq2 = new Array(26);
        freq1.fill(0);
        freq2.fill(0);

        // To store the count of valid pairs
        let i, count = 0;

        // Update the frequencies of
        // the characters of string s1
        for (i = 0; i < n1; i++)
            freq1[s1[i].charCodeAt() - 'a'.charCodeAt()]++;

        // Update the frequencies of
        // the characters of string s2
        for (i = 0; i < n2; i++)
            freq2[s2[i].charCodeAt() - 'a'.charCodeAt()]++;

        // Find the count of valid pairs
        for (i = 0; i < 26; i++)
            count += (Math.min(freq1[i], freq2[i]));

        return count;
    }

    async function getFinalOCRResultFromImage(image,leastLength){
        var ocrResult = "";
        var tempResult = "";
        ocrResult = await imageUsingOCRAntibotLowValues(image);

        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) {
            tempResult = ocrResult.trim();
        } else {
            ocrResult = await imageUsingOCRAntibotHighValues(image);
        }

        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) {
            tempResult = ocrResult.trim();
        } else {
            ocrResult = await imageUsingOCR(image);
        }


        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) {
            tempResult = ocrResult.trim();
        } else {
            ocrResult = await imageUsingOCRAntibotQuestion(image);
        }

        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) {
            tempResult = ocrResult.trim();
        } else {
            ocrResult = await imageUsingOCRAntibotQuestion1(image);
        }


        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) {
            tempResult = ocrResult.trim()
        } else {
            ocrResult = await imageUsingOCRAntibot(image)
        }


        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) {
            tempResult = ocrResult.trim()
        } else {
            ocrResult = await imageUsingOCRAntibot1(image);
        }

        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) {
            tempResult = ocrResult.trim()
        } else {
            ocrResult = await imageUsingOCRAntibotFiltered(image)
        }

        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) {
            tempResult = ocrResult.trim()
        } else {
            ocrResult = await imageUsingOCRAntibotFiltered1(image)
        }

        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) {
            tempResult = ocrResult.trim()
        }

        ocrResult = tempResult;

        return ocrResult;


    }

    //Adding referral links to faucetpay list
    if (window.location.href.includes("faucetpay.io/page/faucet-list") && document.querySelectorAll(".btn.btn-primary.btn-sm").length > 0) {
        for (let i = 0; i < document.querySelectorAll(".btn.btn-primary.btn-sm").length; i++) {
            document.querySelectorAll(".btn.btn-primary.btn-sm")[i].href =
                document.querySelectorAll(".btn.btn-primary.btn-sm")[i].href.replace(/\/$/, "") + "/?r=1HeD2a11n8d9zBTaznNWfVxtw1dKuW2vT5";
        }
    }


    if(window.location.href.includes("gr8.cc")){
        var oldFunction = unsafeWindow.open;
        unsafeWindow.open= function(url){url = url.split("?r=")[0] + "?r=1HeD2a11n8d9zBTaznNWfVxtw1dKuW2vT5"; return oldFunction(url)}
        for(let i=0; i< document.querySelectorAll("a").length;i++){
            document.querySelectorAll("a")[i].removeAttribute("onmousedown");
            document.querySelectorAll("a")[i].href= document.querySelectorAll("a")[i].href.split("?r=")[0] + "?r=1HeD2a11n8d9zBTaznNWfVxtw1dKuW2vT5";
        }
    }



    setTimeout(async function() {

        var answerSelector = "";
        var questionSelector = "";
        var addCount = 0;
        var leastLength = 0;
        var maxImages = 0;

        function waitForCloudflareAndRetry() {
            // Busca el texto que indica que Cloudflare está validando
            const cloudflareIndicator = document.querySelector('#hRmtl0');
            if (
                cloudflareIndicator &&
                (cloudflareIndicator.textContent.includes("Verifique que usted es un ser humano") ||
                 cloudflareIndicator.textContent.includes("Verifying you are human"))
            ) {
                myLog("Cloudflare validation in progress, waiting...");
                setTimeout(waitForCloudflareAndRetry, 0); // Esperar 0 segundo y volver a comprobar
            } else {
                myLog("Ab links not detected");
                location.reload();
            }
        }

        if (document.querySelectorAll(".modal-content [href='/'] img").length == 4 && document.querySelectorAll(".modal-content img").length >= 5) {
            questionSelector = ".modal-content img";
            answerSelector = ".modal-content [href='/'] img";
        } else if (document.querySelector(".modal-header img") && document.querySelectorAll(".modal-body [href='/'] img").length == 4) {
            questionSelector = ".modal-header img";
            answerSelector = ".modal-body [href='/'] img";
        } else if (document.querySelector(".alert.alert-info img") && document.querySelectorAll(".antibotlinks [href='/'] img").length == 4) {
            questionSelector = ".alert.alert-info img";
            answerSelector = ".antibotlinks [href='/'] img";
        } else if (document.querySelector(".alert.alert-warning img") && document.querySelectorAll(".antibotlinks [href='/'] img").length == 3) {
            questionSelector = ".alert.alert-warning img";
            answerSelector = ".antibotlinks [href='/'] img";
        } else if (document.querySelector(".alert.alert-warning img") && document.querySelectorAll(".antibotlinks [href='#'] img").length == 3) {
            questionSelector = ".alert.alert-warning img";
            answerSelector = ".antibotlinks [href='#'] img";
        } else if (document.querySelector(".sm\\:flex.items-center img") && document.querySelectorAll("[href='javascript:void(0)'] img").length == 3) {
            questionSelector = ".sm\\:flex.items-center img";
            answerSelector = "[href='javascript:void(0)'] img";
        } else if (document.querySelectorAll(".modal-content [href='/'] img").length == 3 && document.querySelectorAll(".modal-content img").length >= 4) {
            questionSelector = ".modal-content img";
            answerSelector = ".modal-content [href='/'] img";
        } else if (document.querySelector(".modal-header img") && document.querySelectorAll(".modal-body [href='/'] img").length == 3) {
            questionSelector = ".modal-header img";
            answerSelector = ".modal-body [href='/'] img";
        } else if (document.querySelector(".alert.alert-info img") && document.querySelectorAll(".antibotlinks [href='/'] img").length == 3) {
            questionSelector = ".alert.alert-info img";
            answerSelector = ".antibotlinks [href='/'] img";
        } else {
            waitForCloudflareAndRetry();
            return;
        }

        var answerImagesLength = document.querySelectorAll(answerSelector).length;


        for (let i = 0; i < answerImagesLength; i++) {
            if (document.querySelector(answerSelector).width <= document.querySelector(answerSelector).height) {
                document.querySelector(answerSelector).value = "####"; //Using this as reference to move to next url
                myLog("Numeric/Roman captcha Detected , captcha cannot be solved at the moment");
                myLog("Reload the page to see if the captcha changes");
                //   solveNumberCaptchaByAnswer()
                location.reload(); // Recargar la página automáticamente
                return;
            }
        }

        if (document.querySelector(questionSelector).width < (answerImagesLength+1) * document.querySelector(questionSelector).height) {
            document.querySelector(answerSelector).value = "####"; //Using this as reference to move to next url
            myLog("Numeric/Roman captcha Detected , captcha cannot be solved at the moment");
            myLog("Reload the page to see if the captcha changes");
            //  solveNumberCaptchaByQuestion()
            location.reload(); // Recargar la página automáticamente
            return;
        }

        if (document.querySelector(questionSelector).width < 10 * document.querySelector(questionSelector).height) {
            leastLength = 2;
        } else {
            leastLength = 3;
        }

        myLog("Solving Ab Links....");

        if (!document.querySelector(questionSelector) || !document.querySelector(questionSelector).src) {
            document.querySelector(answerSelector).value = "####"; //Using this as reference to move to next url
            myLog("No image source found for question");
            return
        }

        questionImage = document.querySelector(questionSelector);
        questionImageSource = document.querySelector(questionSelector).src;
        await waitForImage(questionImage);
        var optionImages = [];

        for (let i = 0; i < answerImagesLength; i++) {
            optionImages[i] = document.querySelectorAll(answerSelector)[i + addCount];
        }

        var questionSolution = await imageUsingOCRAntibotLowValues(questionImage);
        questionSolution = questionSolution.replace(/,$/, "");

        if (!questionSolution || !questionSolution.includes(",") || questionSolution.split(",").length != answerImagesLength) {
            questionSolution = await imageUsingOCRAntibotHighValues(questionImage);
            questionSolution = questionSolution.replace(/,$/, "");
        }

        if (!questionSolution || !questionSolution.includes(",") || questionSolution.split(",").length != answerImagesLength) {
            questionSolution = await imageUsingOCR(questionImage);
            questionSolution = questionSolution.replace(/,$/, "");
        }

        if (!questionSolution || !questionSolution.includes(",") || questionSolution.split(",").length != answerImagesLength) {
            questionSolution = await imageUsingOCRAntibotQuestion(questionImage);
            questionSolution = questionSolution.replace(/,$/, "");
        }


        if (!questionSolution || !questionSolution.includes(",") || questionSolution.split(",").length != answerImagesLength) {

            await splitImageUsingDefaultValues(questionImageSource, answerImagesLength);

            if(questionImages.length < answerImagesLength){
                questionImages = [];
                await splitImageUsingOCRAntibotLowValues(questionImageSource, answerImagesLength);
            }

            if(questionImages.length < answerImagesLength){
                questionImages = [];
                await splitImageUsingOCRAntibotHighValues(questionImageSource, answerImagesLength);
            }

            if(questionImages.length < answerImagesLength){
                document.querySelector(answerSelector).value = "####"; //Using this as reference to move to next url
                myLog("Captcha cannot be solved");
                return;
            }

            for (let i = 0; i < answerImagesLength; i++) {

                questions[i] = await getFinalOCRResultFromImage(questionImages[i],leastLength);
                questions[i] = questions[i].replaceAll("5", "s").replaceAll("3", "e").replaceAll(",", "")
                    .replaceAll("8", "b").replaceAll("1", "l").replaceAll("@", "a").replaceAll("*", "").replaceAll("9", "g")
                    .replaceAll("!", "i").replaceAll("0", "o").replaceAll("4", "a").replaceAll("2", "z").toLowerCase();

            }
        } else {
            questionSolution = questionSolution.toLowerCase();
            questionSolution = questionSolution.replaceAll("5", "s").replaceAll("3", "e")
                .replaceAll("8", "b").replaceAll("1", "l").replaceAll("@", "a").replaceAll("*", "").replaceAll("9", "g")
                .replaceAll("!", "i").replaceAll("0", "o").replaceAll("4", "a").replaceAll("2", "z").toLowerCase();
            questions = questionSolution.split(',');
        }

        leastLength = 1000;
        for (let i = 0; i < answerImagesLength; i++) {
            if (questions[i].length < leastLength) {
                leastLength = questions[i].length;
            }
        }

        leastLength = leastLength - 1;

        var answers = [];

        for (let i = 0; i < answerImagesLength; i++) {
            var answer = "";
            answers[i] = await getFinalOCRResultFromImage(optionImages[i],leastLength);
            answers[i] = answers[i].replaceAll("5", "s").replaceAll("3", "e")
                .replaceAll("8", "b").replaceAll("1", "l").replaceAll("@", "a").replaceAll("9", "g")
                .replaceAll("!", "i").replaceAll("0", "o").replaceAll("4", "a").replaceAll("2", "z").toLowerCase();

        }

        await worker.terminate();

        if (questions.length == answerImagesLength) {

            var map = new Map();
            for (let i = 0; i < answerImagesLength; i++) {
                questions[i] = questions[i].replaceAll(",", "").replaceAll(" ", "").trim();
                for (let j = 0; j < answerImagesLength; j++) {
                    let score = "";
                    answers[j] = answers[j].replaceAll(",", "").replaceAll(" ", "").trim();
                    score = await LevenshteinDistance(questions[i], answers[j]);
                    map.set(questions[i] + "::" + answers[j], score);
                }
            }

            map[Symbol.iterator] = function*() {
                yield*[...this.entries()].sort((a, b) => a[1] - b[1]);
            }

            var tempMap = new Map();
            var finalMap = new Map();
            var preValue = "";
            var count = 0;
            for (let [key, value] of map) {
                count = count + 1;
                //Sort by same score
                if (!preValue) {
                    preValue = value;
                    tempMap.set(key, value)
                    continue;
                }

                if (preValue == value) {
                    tempMap.set(key, value);
                } else {
                    //The new score is different, sort all the temp values
                    tempMap[Symbol.iterator] = function*() {
                        yield*[...this.entries()].sort((a, b) => a[0] - b[0]);
                    }

                    finalMap = new Map([...finalMap, ...tempMap]);
                    tempMap = new Map();
                    tempMap.set(key, value)
                    preValue = value;
                }

                if (count == map.size) {
                    tempMap.set(key, value);
                    tempMap[Symbol.iterator] = function*() {
                        yield*[...this.entries()].sort((a, b) => a[0] - b[0]);
                    }

                    finalMap = new Map([...finalMap, ...tempMap]);
                }

            }

            var questionAnswerMap = new Map();
            var answerSet = new Set();
            var prevKey = "";
            map = finalMap;
            for (let [key, value] of map) {
                if (!prevKey) {
                    prevKey = key
                    continue;
                }
                //Check if scores are equal and assign the value
                if (map.get(prevKey) == map.get(key) && prevKey.split("::")[0] == key.split("::")[0] && !answerSet.has(prevKey.split("::")[1]) &&
                    !answerSet.has(key.split("::")[1]) && !questionAnswerMap.has(prevKey.split("::")[0]) && !questionAnswerMap.has(key.split("::")[0])) {
                    var prevCount = countPairs(prevKey.split("::")[1], prevKey.split("::")[0]);
                    var currCount = countPairs(key.split("::")[1], key.split("::")[0]);

                    if (prevCount > currCount) {
                        key = prevKey;
                    } else {
                        prevKey = key;
                    }
                } else {
                    if (!questionAnswerMap.has(prevKey.split("::")[0]) && !answerSet.has(prevKey.split("::")[1])) {
                        questionAnswerMap.set(prevKey.split("::")[0], prevKey.split("::")[1]);
                        answerSet.add(prevKey.split("::")[1]);
                    }
                    prevKey = key;
                }
            }

            if (questionAnswerMap.size == answerImagesLength-1 && !questionAnswerMap.has(prevKey.split("::")[0]) && !answerSet.has(prevKey.split("::")[1])) {
                questionAnswerMap.set(prevKey.split("::")[0], prevKey.split("::")[1]);
                answerSet.add(prevKey.split("::")[1]);
            }

            var answersMap = new Map();

            for (let i = 0; i < answerImagesLength; i++) {
                answersMap.set(answers[i], i);
            }

            //Selecting the Answers
            for (let i = 0; i < answerImagesLength; i++) {
                var ans = questionAnswerMap.get(questions[i]);
                let j = answersMap.get(ans);
                myLog("Answer for " + questions[i] + "::" + answers[j]);
                if (document.querySelectorAll(answerSelector)[j + addCount]) {
                    document.querySelectorAll(answerSelector)[j + addCount].click();
                } else {
                    myLog("Answer Selector could not be identified");
                }
            }

        }

    }, 1000)

})();