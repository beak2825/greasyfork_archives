// ==UserScript==
// @name         Nycon -offline
// @namespace    https://greasyfork.org/users/144229
// @version      1.2
// @description  Converts .png resolutions
// @author       MasterNyborg
// @icon         https://i.imgur.com/OFQLKZg.png
// @include      *nycon.com*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @require      https://greasyfork.org/scripts/381311-download-js/code/downloadjs.js?version=685821
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/381258/Nycon%20-offline.user.js
// @updateURL https://update.greasyfork.org/scripts/381258/Nycon%20-offline.meta.js
// ==/UserScript==

"use strict";
var nycon = {
    main: function () {
        nycon.setup();
        $('body').on('change', '#fileInput', function () {
            if (document.getElementById('fileInput').files.length) { nycon.process(); $('#downloadAll').show(); }
        });
    },
    defaults: {
        emotes: [28, 56, 112],
        badges: [18, 36, 72],
        custom: [64, 128, 256]
    },
    theme: {
        bg: "#183661",
        fg: "#1c4b82",
        trim: "#dd6b4d",
        text: "#dae1e7"
    },
    data: {
        names: [],
        images: [],
        resolution: "emotes",
        active: [28, 56, 112],
        dataUrls: [],
        dlNames: [],
        scale1: false,//original - pixelly
        scale2: false,//uses last rendered canvas instead of source for each image
        scale3: false,//scale 2 but offsets first canvas by .5
        scale4: false,//scaled 3 but offsets every canvas by .5, looks bad don't use ever
        scale5: false,//halves the input image before rescaling
        scale6: true,//scale 5 with first canvas offset by .5
    },
    setup: function () {
        $('body').empty();
        $('head').empty();
        document.title = "Nycon - Image rescaler"
        var startDiv =
            `<div id="start">
                <h1>Welcome!</h1></br>
                    <input type="radio" name=res id=emotes checked><b title="28x28, 56x56, 112x112">Emotes</b></input>
                    <input type="radio" name=res id=badges><b title="18x18, 36x36, 72x72">Badges</b></input>
                    <input type="radio" name=res id=other><b title="Input your own resolutions">Choose your own</b></input></br></br>
                        <b class=customRes>Output 1: </b><input id=res1 class=customRes></input>
                        <b class=customRes>Output 2: </b><input id=res2 class=customRes></input>
                        <b class=customRes>Output 3: </b><input id=res3 class=customRes></input></br></br>
                <input type="file" id="fileInput" accept="image/*" multiple files></br></br>
                <button id="downloadAll">Download All Images to Drive</button>
            </div>`;
        $('body').append(startDiv);
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerText = `
            #start::-webkit-scrollbar {
                width: 12px;
                border-radius: 10px;
                background-color: #F5F5F5;
            }
            #start::-webkit-scrollbar-track {
                background-color: ${nycon.theme.trim};
                border-radius: 10px;
            }
            #start::-webkit-scrollbar-thumb {
                border-radius: 10px;
                background-image: -webkit-gradient(linear,
                                                   left bottom,
                                                   left top,
                                                   color-stop(0.44, rgb(122,153,217)),
                                                   color-stop(0.72, rgb(73,125,189)),
                                                   color-stop(0.86, rgb(28,58,148)));
            }`;
        document.head.appendChild(style);
        $('body').css('color', nycon.theme.text);
        $('body').css('background-color', nycon.theme.bg);
        $('body').css('font-family', 'Georgia');
        $('#start').css('margin', 'auto');
        $('#start').css('width', '80%');
        $('#start').css('text-align', "center");
        $('#start').css('padding', "10px");
        var h = $(window).height() / 100;
        h = h * 90;
        $('#start').css('max-height', h);
        $('#start').css('overflow', 'auto');
        $('#start').css('background-color', nycon.theme.fg);
        $('#start').css('border', `5px solid ${nycon.theme.trim}`);
        $('#start').css('border-radius', "10px");
        $('button').css('color', "white");
        $('button').css('background-color', nycon.theme.trim);
        $('button').css('border', `5px solid ${nycon.theme.bg}`);
        $('button').css('padding', "7px");
        $('button').css('border-radius', '50px');
        $('button').css('font-size', '18px');
        $('button').css('font-weight', 'bold');
        $('.customRes').css('width', '50px');
        $('.customRes').hide();
        $('#downloadAll').hide();
    },
    process: function () {
        var files = document.getElementById('fileInput').files;
        var fl = files.length;
        console.log(files[0].name);
        convert();
        function convert(i = 0) {
            if (i < fl) {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                var img = new Image();
                var reader = new FileReader();
                reader.addEventListener("load", function () {
                    img.src = reader.result;
                }, false);
                img.addEventListener("load", function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    nycon.data.images.push(canvas);
                    setTimeout(function () { i++; convert(i); }, 0);
                }, false)
                reader.readAsDataURL(files[i]);
            } else {
                display();
            }
        }
        function display() {
            var ndil = nycon.data.images.length
            for (var i = 0; i < ndil; i++) {
                var defCanvas = nycon.data.images[i];
                var div = `
                    <div class=imgBox id=image${i}>
                    </div></br>
                `
                $('#start').append(div);
                $(`#image${i}`).append(defCanvas);
            }
            $('#imgBox').css('border', `5px solid ${nycon.theme.trim}`);
            resize();
        }
        function resize() {
            var ndil = nycon.data.images.length;
            for (var i = 0; i < ndil; i++) {
                var canvasSm = document.createElement("canvas");
                var canvasMd = document.createElement("canvas");
                var canvasLg = document.createElement("canvas");
                var smCtx = canvasSm.getContext("2d");
                smCtx.imageSmoothingQuality = "high";
                var mdCtx = canvasMd.getContext("2d");
                mdCtx.imageSmoothingQuality = "high";
                var lgCtx = canvasLg.getContext("2d");
                lgCtx.imageSmoothingQuality = "high";
                canvasSm.width = nycon.data.active[0];
                canvasSm.height = nycon.data.active[0];
                canvasMd.width = nycon.data.active[1];
                canvasMd.height = nycon.data.active[1];
                canvasLg.width = nycon.data.active[2];
                canvasLg.height = nycon.data.active[2];
                //add a sharpness slider and add a slider for x and y offset
                if (nycon.data.scale1) {
                    lgCtx.drawImage(nycon.data.images[i], 0, 0, nycon.data.images[i].width, nycon.data.images[i].height, 0, 0, canvasLg.width, canvasLg.height);
                    mdCtx.drawImage(nycon.data.images[i], 0, 0, nycon.data.images[i].width, nycon.data.images[i].height, 0, 0, canvasMd.width, canvasMd.height);
                    smCtx.drawImage(nycon.data.images[i], 0, 0, nycon.data.images[i].width, nycon.data.images[i].height, 0, 0, canvasSm.width, canvasSm.height);
                }
                else if (nycon.data.scale2) {
                    lgCtx.drawImage(nycon.data.images[i], 0, 0, nycon.data.images[i].width, nycon.data.images[i].height, 0, 0, canvasLg.width, canvasLg.height);
                    mdCtx.drawImage(canvasLg, 0, 0, canvasLg.width, canvasLg.height, 0, 0, canvasMd.width, canvasMd.height);
                    smCtx.drawImage(canvasMd, 0, 0, canvasMd.width, canvasMd.height, 0, 0, canvasSm.width, canvasSm.height);
                }
                else if (nycon.data.scale3) {
                    lgCtx.drawImage(nycon.data.images[i], 0, 0, nycon.data.images[i].width, nycon.data.images[i].height, 0.5, 0.5, canvasLg.width, canvasLg.height);
                    mdCtx.drawImage(canvasLg, 0, 0, canvasLg.width, canvasLg.height, 0, 0, canvasMd.width, canvasMd.height);
                    smCtx.drawImage(canvasMd, 0, 0, canvasMd.width, canvasMd.height, 0, 0, canvasSm.width, canvasSm.height);
                }
                else if (nycon.data.scale4) {//don't do this one, it smushed the image down and left a pixel
                    lgCtx.drawImage(nycon.data.images[i], 0, 0, nycon.data.images[i].width, nycon.data.images[i].height, 0.5, 0.5, canvasLg.width, canvasLg.height);
                    mdCtx.drawImage(canvasLg, 0, 0, canvasLg.width, canvasLg.height, 0.5, 0.5, canvasMd.width, canvasMd.height);
                    smCtx.drawImage(canvasMd, 0, 0, canvasMd.width, canvasMd.height, 0.5, 0.5, canvasSm.width, canvasSm.height);
                }
                else if (nycon.data.scale5) {
                    var stCanvas = document.createElement("canvas");
                    var stcCtx = stCanvas.getContext("2d");
                    stCanvas.width = nycon.data.images[i].width * .5;
                    stCanvas.height = nycon.data.images[i].width * .5;
                    stcCtx.drawImage(nycon.data.images[i], 0, 0, nycon.data.images[i].width, nycon.data.images[i].height, 0, 0, stCanvas.width, stCanvas.height);
                    lgCtx.drawImage(stCanvas, 0, 0, stCanvas.width, stCanvas.height, 0, 0, canvasLg.width, canvasLg.height);
                    mdCtx.drawImage(canvasLg, 0, 0, canvasLg.width, canvasLg.height, 0, 0, canvasMd.width, canvasMd.height);
                    smCtx.drawImage(canvasMd, 0, 0, canvasMd.width, canvasMd.height, 0, 0, canvasSm.width, canvasSm.height);
                }
                else if (nycon.data.scale6) {
                    var stCanvas = document.createElement("canvas");
                    var stcCtx = stCanvas.getContext("2d");
                    stCanvas.width = nycon.data.images[i].width * .5;
                    stCanvas.height = nycon.data.images[i].width * .5;
                    stcCtx.drawImage(nycon.data.images[i], 0, 0, nycon.data.images[i].width, nycon.data.images[i].height, 0.25, 0.25, stCanvas.width, stCanvas.height);
                    lgCtx.drawImage(stCanvas, 0, 0, stCanvas.width, stCanvas.height, 0, 0, canvasLg.width, canvasLg.height);
                    mdCtx.drawImage(canvasLg, 0, 0, canvasLg.width, canvasLg.height, 0, 0, canvasMd.width, canvasMd.height);
                    smCtx.drawImage(canvasMd, 0, 0, canvasMd.width, canvasMd.height, 0, 0, canvasSm.width, canvasSm.height);
                }
                var name = files[i].name;
                var width = nycon.data.images[i].width;
                var height = nycon.data.images[i].height;
                if (width != height) { alert("You have uploaded a file without a 1:1 aspect ratio. The program will still proceed but file naming may be incorrect"); }
                var remove = width + "x" + width;
                name = name.replace(remove, "");
                name = name.replace(".png", "");
                var n1 = name + nycon.data.active[0] + "x" + nycon.data.active[0] + ".png"
                var n2 = name + nycon.data.active[1] + "x" + nycon.data.active[1] + ".png"
                var n3 = name + nycon.data.active[2] + "x" + nycon.data.active[2] + ".png"
                $(canvasSm).attr('id', n1);
                $(canvasMd).attr('id', n2);
                $(canvasLg).attr('id', n3);
                $(`#image${i}`).append(canvasLg);
                $(`#image${i}`).append(canvasMd);
                $(`#image${i}`).append(canvasSm);
                $('body').append(`<a style="padding:5px;" id="download${n3}" class="download">${n3}</a>`);

                $(`#download${n3}`).click();
                document.getElementById(`download${n3}`).addEventListener('click', function () {
                    nycon.downloadCanvas(this, n3, n3);
                }, false);
                $('body').append(`<a style="padding:5px;" id="download${n2}" class="download">${n2}</a>`);
                document.getElementById(`download${n2}`).addEventListener('click', function () {
                    nycon.downloadCanvas(this, n2, n2);
                }, false);
                $('body').append(`<a style="padding:5px;" id="download${n1}" class="download">${n1}</a>`);
                document.getElementById(`download${n1}`).addEventListener('click', function () {
                    nycon.downloadCanvas(this, n1, n1);
                }, false);
                var smulr = canvasSm.toDataURL();
                var mdulr = canvasMd.toDataURL();
                var lgulr = canvasLg.toDataURL();
                nycon.data.dataUrls.push(smulr);
                nycon.data.dlNames.push(n1);
                nycon.data.dataUrls.push(mdulr);
                nycon.data.dlNames.push(n2);
                nycon.data.dataUrls.push(lgulr);
                nycon.data.dlNames.push(n3);
            }
        }
    },
    updateCustom: function () {
        var res1 = localStorage.getItem("res1");
        var res2 = localStorage.getItem("res2");
        var res3 = localStorage.getItem("res3");
        if (res1 === null) { res1 = 64; }
        if (res2 === null) { res2 = 128; }
        if (res3 === null) { res3 = 256; }
        nycon.defaults.custom[0] = res1;
        nycon.defaults.custom[1] = res2;
        nycon.defaults.custom[2] = res3;
        $('#res1').val(nycon.defaults.custom[0]);
        $('#res2').val(nycon.defaults.custom[1]);
        $('#res3').val(nycon.defaults.custom[2]);
    },
    downloadCanvas: function (link, canvasId, filename) {
        link.href = document.getElementById(canvasId).toDataURL();
        link.download = filename;
    },
    clickAll: function () {
        var all = $('a').length
        for (var a = 0; a < all; a++) {
            setTimeout(function () { $('a').eq(a).click(); }, 1);
        }
    },
    downloadAll: function () {
        var imageCount = nycon.data.dataUrls.length;
        for (var i = 0; i < imageCount; i++) {
            download(nycon.data.dataUrls[i], nycon.data.dlNames[i], "image/png");
        }
    },
}

$('body').on('click', '#emotes', function () {
    nycon.data.resolution = "emotes";
    nycon.data.active = nycon.defaults.emotes.slice(0);
    $('.customRes').hide();
});

$('body').on('click', '#badges', function () {
    nycon.data.resolution = "badges";
    nycon.data.active = nycon.defaults.badges.slice(0);
    $('.customRes').hide();
});

$('body').on('click', '#other', function () {//<button id="startButton">Start!</button></br></br>
    nycon.data.resolution = "custom"
    nycon.updateCustom();
    nycon.data.active = nycon.defaults.custom.slice(0);
    $('.customRes').show();
});

$('body').on('click', '#downloadAll', function () {
    nycon.downloadAll();
});

$('body').on('change', '#res1', function () {
    nycon.defaults.custom[0] = $('#res1').val();
    localStorage.setItem("res1", nycon.defaults.custom[0]);
});

$('body').on('change', '#res2', function () {
    nycon.defaults.custom[1] = $('#res2').val();
    localStorage.setItem("res2", nycon.defaults.custom[1]);
});

$('body').on('change', '#res3', function () {
    nycon.defaults.custom[2] = $('#res3').val();
    localStorage.setItem("res3", nycon.defaults.custom[2]);

});


function junk() {//Stuff I used for testing that I didn't end up needing
    function downloadAll(imgs, ext, limit) {
        /* If specified, filter images by extension */
        if (ext) {
            ext = "." + ext;
            imgs = [].slice.call(imgs).filter(function (img) {
                var src = img.src;
                return (src && (src.indexOf(ext, src.length - ext.length) !== -1));
            });
        }
        /* Determine the number of images to download */
        limit = (limit && (0 <= limit) && (limit <= imgs.length))
            ? limit : imgs.length;

        /* (Try to) download the images */
        for (var i = 0; i < limit; i++) {
            var img = imgs[i];
            console.log("IMG: " + img.src + " (", img, ")");
            download(img);
        }
        function stepDown() {
            var smSteps = Math.ceil(Math.log(nycon.data.images[i].height / canvasSm.width) / Math.log(2));
            console.log(smSteps);
            var stepCanvas = document.createElement("canvas");
            var sCtx = stepCanvas.getContext("2d");
            stepCanvas.height = nycon.data.images[i].height;
            stepCanvas.width = nycon.data.images[i].width;
            sCtx.drawImage(nycon.data.images[i], 0, 0, sCtx.width, sCtx.height);
            for (var j = 0; j < smSteps; j++) {
                stepCanvas.height = stepCanvas.height * 0.5;
                stepCanvas.width = stepCanvas.height * 0.5;
                sCtx.drawImage(stepCanvas, 0, 0, stepCanvas.height, stepCanvas.height);
                $(`#image${i}`).append(stepCanvas);
            }
        }
        //Canvas2Image.saveAsPNG(canvasSm, canvasSm.width, canvasSm.height)
        //var link = $('canvas').eq(1);
        //link.attr('download', 'donut.png');
        //link.attr('href', canvasSm.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        //link.click();
        var newImg = document.createElement('img')
        canvasSm.toBlob(function (blob) {
            var url = URL.createObjectURL(blob);
            newImg.onload = function () {
                // no longer need to read the blob so it's revoked
                URL.revokeObjectURL(url);
            };
            newImg.src = url;
            //document.body.appendChild(newImg);
            var zip = new JSZip();
            var img = zip.folder("images");
            var data = new ArrayBuffer(newImg);
            img.file("test.png", data, { base64: true });
            zip.generateAsync({ type: "blob" })
                .then(function (content) {
                    // see FileSaver.js
                    //saveAs(content, "example.zip");
                    //    <script type="text/javascript" src="dist/jszip.js"></script>
                });
        });
    }
}
///////////////
nycon.main();//
///////////////