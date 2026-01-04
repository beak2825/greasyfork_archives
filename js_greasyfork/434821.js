// ==UserScript==
// @name         OWOP Image To Pixel
// @match        *.ourworldofpixels.com/*
// @description  Script that inserts the image for pixelart in OWOP
// @author       Pedro Henrique
// @license      MIT
// @version      3.0
// @namespace https://greasyfork.org/users/831014
// @icon https://www.google.com/s2/favicons?domain=ourworldofpixels.com
// @downloadURL https://update.greasyfork.org/scripts/434821/OWOP%20Image%20To%20Pixel.user.js
// @updateURL https://update.greasyfork.org/scripts/434821/OWOP%20Image%20To%20Pixel.meta.js
// ==/UserScript==
var x = 0;
var y = 0;
var alphar = 255;
var alphag = 255;
var alphab = 255;
var imagesize = 64;

var image = [];
var delay = 50;
var pointpaint = false;
var alphacheck = true;
var replacealphacheck = false;
var running;
function run() {
    var _lastimagepixel = [parseInt(image[image.length-1][0]), parseInt(image[image.length-1][1])];
    running = setInterval(function () {
        var iposX = OWOP.mouse.tileX - x;
        var iposY = OWOP.mouse.tileY - y;
        var currentpos = ((iposX + 1) + (_lastimagepixel[0] * iposY)) + iposY
        if (pointpaint == true) {
            if (currentpos < 0 || currentpos > image.length) {
                currentpos = 0
            }
        }
        else {
            currentpos = 0
        }
        loop:
        for (var i = currentpos; i < image.length; i++) {
            var x1 = x + parseInt(image[i][0]);
            var y1 = y + parseInt(image[i][1]);
            var red = parseInt(image[i][2]);
            var green = parseInt(image[i][3]);
            var blue = parseInt(image[i][4]);
            var alpha = parseInt(image[i][5]);
            if (replacealphacheck == false && alphacheck == true && alpha < 127) {
                red = OWOP.world.getPixel(x1, y1)[0];
                green = OWOP.world.getPixel(x1, y1)[1];
                blue = OWOP.world.getPixel(x1, y1)[2];
            } else if (replacealphacheck == true && alpha < 127) {
                red = alphar;
                green = alphag;
                blue = alphab;
            }
            if (OWOP.world.getPixel(x1, y1) != null && (OWOP.world.getPixel(x1, y1)[0] != red || OWOP.world.getPixel(x1, y1)[1] != green || OWOP.world.getPixel(x1, y1)[2] != blue)) {
                if (x1 < (OWOP.mouse.tileX + 30) && x1 > (OWOP.mouse.tileX - 30) && y1 > (OWOP.mouse.tileY - 30) && y1 < (OWOP.mouse.tileY + 30)) {

                    OWOP.world.setPixel(x1, y1, [red, green, blue], false)
                    break loop;
                }
            }
        }
    }, delay);
}


function initializeComponent() {
    OWOP.windowSys.addWindow(new OWOP.windowSys.class.window("Image to PixelArt", {}, function (win) {
        win.container.style = "height:auto;width:175px;overflow:hidden"

        // Imagem
        win.addObj(document.createTextNode('Choose image'));
        win.addObj(OWOP.util.mkHTML('div', {}));
        var imagem = OWOP.util.mkHTML('img', {
            id: 'imagem',
            width: 32,
            height: 32,
        })
        win.addObj(imagem);
        win.addObj(OWOP.util.mkHTML('div', {}));
        // Tamanho da Imagem
        var imgsizetxt = win.addObj(document.createTextNode('Image Size (0px) : '));
        var imgsizeinput = OWOP.util.mkHTML('input', {
            id: 'imgsizeinput',
            value: 64,
            oninput: function () {
                imgsizetxt.nodeValue = "Image Size (" + this.value + "px) : "
                imagesize = this.value;
            }
        });
        win.addObj(imgsizeinput);
        // Aplicat tamanho
        var applysize_button = OWOP.util.mkHTML('button', {
            id: 'applysize',
            innerHTML: 'Apply Size',
            onclick: function () {
                applysize();
            }
        });
        win.addObj(applysize_button);
        // Escolher imagem
        var escolherimagem = OWOP.util.mkHTML('input', {
            id: 'imageminput',
            type: 'file',
            oninput: function (evt) {
                function readURL(input) {

                    if (input.files && input.files[0]) {
                        var reader = new FileReader();
                        reader.onloadend = async function (e) {
                            var img = new Image();
                            img.src = await e.target.result;
                            document.getElementById("imagem").src = img.src;
                            applysize();
                        }

                        reader.readAsDataURL(input.files[0]);
                    }
                }
                readURL(this)
            }
        });
        win.addObj(escolherimagem);
        // Input da posição da imagem no OWOP
        win.addObj(document.createTextNode('X : '));
        var inputX = OWOP.util.mkHTML('input', {
            id: 'Xinput',
            oninput: function () {
                x = parseInt(this.value);
            }
        });
        win.addObj(OWOP.util.mkHTML('div', {}));
        win.addObj(inputX);
        win.addObj(document.createTextNode('Y : '));
        var inputY = OWOP.util.mkHTML('input', {
            id: 'Yinput',
            oninput: function () {
                y = parseInt(this.value);
            }
        });
        win.addObj(inputY);
        // Delay para aplicar pixel no owop
        var delaytext = win.addObj(document.createTextNode('Delay : '));
        var delayinput = OWOP.util.mkHTML('input', {
            id: 'delayinput',
            type: 'range',
            min: 1, max: 500,
            oninput: function () {
                delaytext.nodeValue = "Delay : " + parseInt(this.value);
                delay = parseInt(this.value);
            }
        });
        win.addObj(delayinput);
        // Modo Point Paint, que pinta o pixel onde você está apontando o mouse
        win.addObj(document.createTextNode('Point Paint'));
        var pointpaintcheck = OWOP.util.mkHTML('input', {
            id: 'pointpaintcheck',
            type: 'checkbox',
            oninput: function () {
                pointpaint = this.checked;
            }
        });
        win.addObj(pointpaintcheck);
        win.addObj(OWOP.util.mkHTML('div', {}));
        // Substituir a cor apha do OWOP
        win.addObj(document.createTextNode('Replace Alpha Color'));
        var alphainput = OWOP.util.mkHTML('input', {
            id: 'replacecheck',
            type: 'checkbox',
            oninput: function () {
                replacealphacheck = this.checked;
            }
        });
        win.addObj(alphainput);
        // Tipo de cor
        var coloriralpha = OWOP.util.mkHTML('input', {
            type: 'color',
            id: 'replacealphacolor',
            onchange: function () {
                alphar = hexToRgb(this.value).r;
                alphag = hexToRgb(this.value).g;
                alphab = hexToRgb(this.value).b;
            }
        });
        win.addObj(coloriralpha);
        win.addObj(OWOP.util.mkHTML('div', {}));
        // Opção de ignorar o Alpha da imagem
        win.addObj(document.createTextNode('Ignore Alpha (.png)'));
        var alphainput = OWOP.util.mkHTML('input', {
            id: 'alphacheck',
            type: 'checkbox',
            checked: 'true',
            oninput: function () {
                alphacheck = this.checked;
            }
        });
        win.addObj(alphainput);
        win.addObj(OWOP.util.mkHTML('div', {}));
        // Botão de Ativar
        var button = OWOP.util.mkHTML('button', {
            id: 'EnableImageToPixel',
            innerHTML: 'Activate',
            onclick: function () {
                if (document.getElementById("Xinput").value != "") {
                    if (document.getElementById("Yinput").value != "") {
                        run();
                        document.getElementById("EnableImageToPixel").disabled = 'true';
                    }
                }
            }
        });
        win.addObj(button);
        // Botão de desativar
        var desativar = OWOP.util.mkHTML('button', {
            id: 'DisableImageToPixel',
            innerHTML: 'Disable',
            onclick: function () {
                clearInterval(running);
                document.getElementById("EnableImageToPixel").removeAttribute("disabled");

            }
        });
        win.addObj(desativar);

        // Evento para definir a posição da imagem no OWOP
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            if (keyName == "e" || keyName == "E") {
                document.getElementById("Xinput").value = OWOP.mouse.tileX
                document.getElementById("Yinput").value = OWOP.mouse.tileY
                x = OWOP.mouse.tileX
                y = OWOP.mouse.tileY
            }
        });
    }).move(window.innerWidth - 500, 32));
}

function applysize() {
    var img = new Image();
    img.src = document.getElementById("imagem").src


    var canvas = document.createElement('canvas');
    var imgW = 0;
    var imgH = 0;
    if (imagesize == 0) {
        imgW = img.width;
        imgH = img.height;
    }
    else {
        if (imagesize.toString().includes(";")) {
            let wh = imagesize.toString().split(";");
            imgW = parseInt(wh[0]);
            imgH = parseInt(wh[1]);
        }
        else {
            imgW = imagesize;
            imgH = imagesize;
        }
    }
    canvas.width = imgW;
    canvas.height = imgH;

    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, imgW, imgH);
    //context.drawImage(img, 0, 0, img.width, img.height);

    image = [];
    for (var v = 0; v < imgH; v++) {
        for (var i = 0; i < imgW; i++) {
            var pixelData = context.getImageData(i, v, 1, 1).data;
            image.push([i,v,pixelData[0],pixelData[1],pixelData[2],pixelData[3]])
        }
    }
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
if (typeof OWOP != 'undefined') initializeComponent();
window.addEventListener('load', function () {
    setTimeout(initializeComponent, 2000);

    // Função que auto reconecta o OWOP
    setInterval(() => {
        if (document.getElementById("load-options").class == "hide") {
            document.getElementById("reconnect-btn").click();
        }
    }, 1000);
});