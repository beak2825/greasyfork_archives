// ==UserScript==
// @name         Speedtest by Ookla fake Mbps
// @namespace    http://tampermonkey.net/
// @version      2024-12-27
// @description  Fake your Speedtest by Ookla Mbps values! If this gets enough installs i will update it!
// @author       DominusGabi
// @match        https://www.speedtest.net/run
// @icon         https://www.google.com/s2/favicons?sz=64&domain=speedtest.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522129/Speedtest%20by%20Ookla%20fake%20Mbps.user.js
// @updateURL https://update.greasyfork.org/scripts/522129/Speedtest%20by%20Ookla%20fake%20Mbps.meta.js
// ==/UserScript==

//---MAX-AND-MIN-MBPS-----

var max = 10000
var min = 8000

//-------------------------

var checkLoad = setInterval(function(){
    if(document.querySelector('.connecting-message').style.opacity==0){
        start()
        clearInterval(checkLoad)
    }
})


var number = parseFloat((Math.random()*(max-min)+min).toFixed(2))
function updateNumber(){
    var changeNumber = parseFloat(Math.random().toFixed(2))
    if(Math.random()>.99) changeNumber*=5
    if(Math.random()>.5) number+=changeNumber
    else number-=changeNumber
}

var next = 0;
function nextf() {
    if(!next){
        next=1
        number = parseFloat((Math.random()*(max-min)+min).toFixed(2))
    }
}

function start() {
    setInterval(function(){
        updateNumber()
        setMbps(parseFloat(number.toFixed(2)))
    },100)
    var updateUploadTxt = setInterval(function(){
        if(document.querySelector('.download-speed').innerHTML!="—"){
            clearInterval(updateUploadTxt)
            document.querySelector('.download-speed').innerHTML=number
        }
    },100)
    var downloadUploadTxt = setInterval(function(){
        if(document.querySelector('.upload-speed').innerHTML!="—"){
            clearInterval(downloadUploadTxt)
            document.querySelector('.upload-speed').innerHTML=number
        }
    },100)
}




window.setMbps = function(newMbps){

    var stage = "download"

    if(!document.querySelectorAll('.result-item')[3].classList.contains('inactive')){
        stage = "upload"
        nextf()
    }


    var speedTxtC = document.querySelector('.gauge-speed-text')
    var speedNeedleC = document.querySelector('.gauge-speed-needle')
    var gradientC = document.querySelector('.gauge-speed-arc')

    var speedTxt = speedTxtC.cloneNode()
    var speedNeedle = speedNeedleC.cloneNode()
    var gradient = gradientC.cloneNode()

    speedTxtC.parentElement.appendChild(speedTxt)
    speedNeedleC.parentElement.appendChild(speedNeedle)
    gradientC.parentElement.appendChild(gradient)

    speedNeedle.innerHTML=speedNeedleC.innerHTML
    speedNeedle.style.opacity="1"

    speedTxtC.remove()
    speedNeedleC.remove()
    gradientC.remove()


    var speedIncrements = [0, 1, 5, 10, 20, 30, 50, 75, 100]
    var speedDegrees = [-132, -99, -66, -33, 0, 33, 66, 99, 132]
    function _convertSpeedToDegrees(e, t, n) {
        var r = n.length;
        if (e >= t[r - 1])
            return n[r - 1];
        for (var i = 1; i < r; i++)
            if (e < t[i]) {
                var o = t[i - 1]
                , a = t[i]
                , s = n[i - 1];
                return (e - o) / (a - o) * (n[i] - s) + s
            }
        return n[r - 1]
    }

    let arcImg = {
        download: {
            multi: $(".gauge-speed-arc-img-dl-multi").get(0),
            single: $(".gauge-speed-arc-img-dl-single").get(0)
        },
        upload: {
            multi: $(".gauge-speed-arc-img-ul-multi").get(0),
            single: $(".gauge-speed-arc-img-ul-single").get(0)
        }
    }
    let arc = {
        arc: $("#arc-background"),
        bigcircle: $("#big-circle"),
        circleko: $("#circle-knockout"),
        arcko: $("#arc-knockout"),
        propsCircleToArc: false ? {
            scaleX: [1, 1],
            opacity: [1, 0]
        } : {
            scaleX: [1, 0],
            opacity: [1, 1]
        },
        propsArcToCircle: false ? {
            scaleX: [1, 1],
            opacity: [0, 1]
        } : {
            scaleX: [0, 1],
            opacity: [1, 1]
        },
        smallo: 1,
        bigo: .5,
        ringmaskstart: 0,
        ringmaskend: 308 / 2 - 308/12,
        yellow: "#fff38e",
        blue: "#232f4e"
    }

    var gradientctx = gradient.getContext("2d")

    var speedIncrements = [0, 1, 5, 10, 20, 30, 50, 75, 100]
    var speedDegrees = [-132, -99, -66, -33, 0, 33, 66, 99, 132]
    var radiansStart = (speedDegrees[0] - 90) * Math.PI / 180

    function isImageLoaded(e) {
        return !!e.complete && (void 0 === e.naturalWidth || 0 !== e.naturalWidth)
    }

    function _drawGradient(e){
        var n = radiansStart
        var r = (e - 90) * Math.PI / 180
        var i = gradientctx;
        i.clearRect(0, 0, gradient.width, gradient.height)
        i.save()
        i.beginPath()
        i.arc(gradient.width / 2, gradient.height / 2, gradient.width / 2, n, r)
        i.lineTo(gradient.width / 2, gradient.height / 2)
        i.clip();
        var o = arcImg[stage][OOKLA.globals.configs.connections.mode]
        var a = function() {
            i.drawImage(o, 0, 0, gradient.width, gradient.height)
            i.restore()
        }
        isImageLoaded(o) ? a() : o.onload = a
    }



    function setMbpsTxt(x){
        var speedTxtctx = speedTxt.getContext('2d')
        var gradient = document.querySelector('.gauge-speed-arc')
        var fontGuage = '80px gauge-mono, Montserrat, Montserrat-Fixed, Avenir, "Avenir Next LT Pro", Corbel, "URW Gothic", source-sans-pro, sans-serif'

        speedTxtctx.font = fontGuage
        speedTxtctx.textAlign = "center"
        speedTxtctx.textBaseline = "bottom"
        speedTxtctx.fillStyle = "white"
        speedTxtctx.save()
        speedTxtctx.clearRect(0, 0, gradient.width,  gradient.height)
        speedTxtctx.fillText(x, gradient.width / 2, gradient.height - gradient.height / 7.8)
        speedTxtctx.restore()
    }
    function setMbpsNeedle(x){
        var valueDeg = _convertSpeedToDegrees(x,speedIncrements,speedDegrees)
        speedNeedle.style.transform=`rotateZ(${valueDeg}deg)`
    }
    window.setMbpsArc = function(x){

        _drawGradient(_convertSpeedToDegrees(x,speedIncrements,speedDegrees))
    }




    setMbpsTxt(newMbps)
    setMbpsNeedle(newMbps)
    setMbpsArc(newMbps)

}