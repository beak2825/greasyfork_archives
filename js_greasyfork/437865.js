// ==UserScript==
// @name         高科登入工具
// @namespace    https://github.com/takidog/NKUST_Login_Helper
// @version      1.5
// @description  自動辨識高科webap登入驗證碼，讓自己更像機器人
// @author       Takidog
// @match        *://webap0.nkust.edu.tw/nkust/index_main.html
// @match        *://webap0.nkust.edu.tw/nkust/index.html
// @match        *://webap0.nkust.edu.tw/nkust/
// @match        *://webap.nkust.edu.tw/nkust/index_main.html
// @match        *://webap.nkust.edu.tw/nkust/index.html
// @match        *://webap.nkust.edu.tw/nkust/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.24.0/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.12.0/dist/tf.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437865/%E9%AB%98%E7%A7%91%E7%99%BB%E5%85%A5%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/437865/%E9%AB%98%E7%A7%91%E7%99%BB%E5%85%A5%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

if (window.location.pathname == "/nkust/index.html" || window.location.pathname == "/nkust/") {
    // 奇怪的頁面，用一層iframe套起來不知道在幹嘛
    // 會導致document抓不到
    window.location = '/nkust/index_main.html';
}

function checkInput() {
    var struid = frm1.uid.value;
    var strpwd = frm1.pwd.value;
    if (struid == "") {
        alert("帳號不可空白。");
        frm1.uid.value = "請填入帳號";
        frm1.uid.select();
        return false;
    }
    if (strpwd == "") {
        alert("密碼不可空白。");
        frm1.pwd.select();
        return false;
    }
    return true;
}

function maxIndex(data) {
    var _maxValue = -1;
    var _maxIndex = -1;
    for (var i = 0; i < data.length; i++) {
        if (data[i] > _maxValue) {
            _maxValue = data[i];
            _maxIndex = i;
        }
    }
    return _maxIndex;
}

function login_parser(response_html) {
    if (response_html.indexOf("top.location.href='f_index.html'")) {
        return "success";
    }
    if (response_html.indexOf("驗證碼錯誤")) {
        return "captchaFail";
    }
    if (response_html.indexOf("或密碼不正確")) {
        return "passwordError";
    }

    return "Error";
}

async function request_login(captchaCode) {
    let res = await axios.post(
        "/nkust/perchk.jsp",
        new URLSearchParams({
            uid: frm1.uid.value,
            pwd: frm1.pwd.value,
            etxt_code: captchaCode,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return login_parser(res.data);

}

function login() {
    if (!checkInput()) {
        return false;
    }
    // reset retry count.
    window.retry = 0;
    captchaImage();
}

function captchaImage() {
    $.notify(`辨識中...`, { className: "info" });
    if (!checkInput()) {
        return false;
    }

    // create canvas
    if (document.getElementById("imageProcess")) {
        document.getElementById("imageProcess").remove();
    }
    let _c = document.createElement("canvas");
    _c.setAttribute("id", "imageProcess");
    document.getElementsByTagName("head")[0].appendChild(_c);

    let cnv = document.getElementById("imageProcess");
    cnv.width = 85;
    cnv.height = 40;
    let cnx = cnv.getContext("2d");
    let captchaImage = new Image();

    captchaImage.onload = async function () {
        cnx.drawImage(captchaImage, 0, 0);
        // convert grayscale
        let imgData = cnx.getImageData(0, 0, cnx.canvas.width, cnx.canvas.height);
        let pixels = imgData.data;
        let grayscaleImg = [];
        for (var i = 0; i < pixels.length; i += 4) {
            let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
            //pixels[i] = lightness;
            //pixels[i + 1] = lightness;
            //pixels[i + 2] = lightness;
            grayscaleImg.push(lightness / 255);
        }
        //cnx.putImageData(imgData, 0, 0);

        let charDataList = [[], [], [], []];
        let image = [];
        for (i = 0; i < grayscaleImg.length; i++) {
            if (image[Math.floor(i / 85)] === undefined) {
                image.push([]);
            }
            image[Math.floor(i / 85)].push(grayscaleImg[i]);
        }

        for (i = 0; i < image.length; i++) {
            for (var x = 0; x < image[i].length; x++) {
                if (x < 21) {
                    charDataList[0].push(image[i][x]);
                    continue;
                }
                if (x >= 21 && x < 42) {
                    charDataList[1].push(image[i][x]);
                    continue;
                }
                if (x >= 42 && x < 63) {
                    charDataList[2].push(image[i][x]);
                    continue;
                }
                if (x >= 63 && x < 84) {
                    charDataList[3].push(image[i][x]);
                    continue;
                }
            }
        }
        let charResult = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
        ];
        let captchaCode = "";
        for (i = 0; i < charDataList.length; i++) {
            let a = await window.model
                .predict(tf.tensor2d(charDataList[i], [40, 21]).reshape([1, 40, 21, 1]))
                .data();
            captchaCode += charResult[maxIndex(a)];
        }
        window.captchaProxy.captchaCode = captchaCode;
    };

    captchaImage.src = "/nkust/validateCode.jsp";
}

window.addEventListener(
    "load",
    async function () {
        // For debug used.
        window.axios = axios;
        let styleElement = document.createElement("style");
        styleElement.type = "text/css";
        styleElement.innerText = ".notifyjs-bootstrap-base {width: 200px;float: left;margin: 10px 0 0 10px;text-align: left;font-size: 16px;}";
        document.getElementsByTagName("head")[0].appendChild(styleElement);

        // use script tag add tf-lite
        // tf-tflite can't use @require. (tflite_web_api_cc_simd dependency problem)
        // let _scriptElement = document.createElement("script");
        //_scriptElement.setAttribute("src","https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.8/dist/tf-tflite.min.js");
        // document.getElementsByTagName("head")[0].appendChild(_scriptElement);

        // Remove verifyCode input and img element.
        // document.getElementById("verifyCode").parentNode.parentNode.replaceChildren();

        // Hidden verifyCode input and img element.

        document
            .getElementById("etxt_code")
            .parentNode.parentNode.setAttribute("hidden", true);


        window.model = await tf.loadLayersModel(
            "https://raw.githubusercontent.com/takidog/NKUST_Login_Helper/main/model.json"
        );

        // Replace login button action.
        window.login = login;
        window.chkvalue = login;
        window.retry = 0;

        document.getElementById("chk").setAttribute("onclick", "login();");

        $.notify("載入成功", { className: "success" });

        window.captchaProxy = new Proxy(
            {},
            {
                set: async function (target, key, value) {
                    window.retry++;
                    if (window.retry > 3){
                        $.notify(`失敗次數過多，稍後重整再試`, { className: "error" });
                        return false;
                    }
                    $.notify(`第${window.retry}次,嘗試登入中`, { className: "info" });
                    let status = await request_login(value);
                    if (status == "success") {
                        $.notify("登入成功", { className: "success" });
                        window.location = "f_index.html";
                    }

                    if (status == "captchaFail") {
                        captchaImage();
                        $.notify("辨識失敗，再次嘗試...", { className: "info" });
                        return true;
                    }
                    if (status == "passwordError") {
                        $.notify("帳號密碼錯誤", { className: "info" });
                        return true;
                    }

                    return true;
                },
            }
        );
    },
    false
);
