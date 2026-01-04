// ==UserScript==
// @name         Auto win
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  deuxsep
// @author       Deux Sept
// @match        https://game.heroestd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroestd.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446078/Auto%20win.user.js
// @updateURL https://update.greasyfork.org/scripts/446078/Auto%20win.meta.js
// ==/UserScript==
let mb_vente = true
pan = document.createElement('div')
pan.setAttribute('title', 'DEUX SEPT ZERO')
pan.setAttribute('id', 'panneau')
act = document.createElement('div')
act.setAttribute('id', 'act')
act.innerHTML = '&#10542;'
ven_text = document.createElement('div')
ven_text.setAttribute('id', 'vente_texte')
ven_text.innerText = 'Win :'

ven_false = document.createElement('div')
ven_false.setAttribute('id', 'vente_false')
ven_false.innerHTML = '&#10007;'

ven_true = document.createElement('div')
ven_true.setAttribute('id', 'vente_true')
ven_true.setAttribute('class', 'actif')
ven_true.innerHTML = '&#10003;'

robot = document.createElement('div')
robot.setAttribute('id', 'robot')
robot.innerHTML = '&#129302;'

notouch = document.createElement('div')
notouch.setAttribute('id', 'notouch')

aide = document.createElement('div')
aide.setAttribute('id', 'aide')
aide.innerHTML = '&#129302;'

aide2 = document.createElement('div')
aide2.setAttribute('id', 'aide2')
aide2.innerHTML = '&#129302;'

refresh = document.createElement('div')
refresh.setAttribute('id', 'refresh')
refresh.innerHTML = '&#10227;'

sta = document.createElement('div')
sta.setAttribute('id', 'start')
sta.innerText = 'QUEST'

wav = document.createElement('div')
wav.setAttribute('id', 'Wave')
wav.innerText = 'Match : '

use = document.createElement('div')
use.setAttribute('id', 'UserA')
use.innerText = 'Winrate : '

ses = document.createElement('div')
ses.setAttribute('id', 'Sess')
ses.innerText = 'WR % : '

input_match = document.createElement('input')
input_match.setAttribute('id', 'input_match')
input_match.setAttribute('type', 'number')
input_match.value = 65

document.body.appendChild(pan)
pan.appendChild(ven_true)
pan.appendChild(sta)
pan.appendChild(refresh)
pan.appendChild(use)
pan.appendChild(ses)
pan.appendChild(input_match)
pan.appendChild(wav)
pan.appendChild(act)
pan.appendChild(ven_false)
pan.appendChild(ven_text)
pan.appendChild(robot)

var style = document.createElement('style')
style.type = 'text/css'
style.innerHTML = `#select_lvl{color: black;position: absolute;bottom: 192px;height: 20px;    left: 100px;border-radius: 5px; font-size: 12px;}
#select_type{color: black;position: absolute;top: 12px;height: 20px; width: 150px;   left: 70px;border-radius: 5px; font-size: 12px;}.actif{color:#67C23A;} .actif2{color:#67C23A;}    #next_true{font-size: 20px;    height: 20px;    line-height: 20px;    width: 20px;    position: absolute;    bottom: 104px; left:190px; cursor:pointer;}
#robot{
font-size: 20px;
    height: 20px;
    line-height: 20px;
    width: 20px;
    position: absolute;
    top: 10px;
    left: 120px;
    cursor: pointer;
    background-color: #092C6E;
    padding: 7px 12px;
    text-align: center;
    padding-left: 5px;
    border-radius: 50px;}
 #aide{
     font-size: 10px;
    height: 10px;
    display: none;
    line-height: 10px;
    width: 10px;
    position: absolute;
    bottom: 14%;
    left: 35%;
    cursor: pointer;
    background-color: #092C6E;
    padding: 5px 7px;
    text-align: center;
    padding-left: 4px;
    border-radius: 50px;}
 #aide2{
     font-size: 10px;
    height: 10px;
    display: none;
    line-height: 10px;
    width: 10px;
    position: absolute;
    bottom: 14%;
    left: 22%;
    cursor: pointer;
    background-color: #092C6E;
    padding: 5px 7px;
    text-align: center;
    padding-left: 4px;
    border-radius: 50px;}
 #notouch{
 font-size: 10px;
    height: 200px;
    display: none;
    line-height: 10px;
    width: 200px;
    position: absolute;
    bottom: 7%;
    left: 20%;
    cursor: pointer;
    background-color: #092C6E;
    padding: 5px 7px;
    text-align: center;
    padding-left: 4px;
    border-radius: 50px;
 }
 #vente_true{font-size: 20px;    height: 20px;    line-height: 20px;    width: 20px;    position: absolute;    top: 15px; left:80px; cursor:pointer;}    #next_false{font-size: 20px;    height: 20px;    line-height: 20px;    width: 20px;    position: absolute;    bottom: 104px; left:160px; cursor:pointer;}    #next_text{height: 10px;    line-height: 10px;        position: absolute;    bottom: 105px; left:20px;}    #vente_false{font-size: 20px;    height: 20px;    line-height: 20px;    width: 20px;    position: absolute;    top: 15px; left:55px; cursor:pointer;}#lvl_text{height: 10px;    line-height: 10px;        position: absolute;    bottom: 195px; left:20px;}    #vente_texte{height: 10px;    line-height: 10px;        position: absolute;    top: 20px; left:20px;}     #youtube{position: absolute;        bottom: 16px;        left: 24px;}    #k2a{position: absolute;    left: 310px;    bottom: 149px;    background-size: cover;    height: 75px;    border: 1px solid white;    width: 75px;    border-radius: 50%;    background-image: url('https://static1.purebreak.com/articles/3/16/31/23/@/641710-kaaris-condamne-apres-sa-bagarre-avec-bo-diapo-2.jpg');}    #save{    position: absolute;        left: 20px;        bottom: 104px;}#Recolte{position: absolute;        left: 20px;        bottom: 24px;  height:10px; line-height: 10px;     }
 #Info{position: absolute;        left: 20px;    height:10px; line-height:10px;    top: 15px;    }
 #Match{position: absolute;        left: 20px;    height:10px; line-height:10px;    top: 50px;    }
 #Oppo{position: absolute;        left: 20px;    height:10px; line-height:10px;    top: 85px;    }
 #Sess{position: absolute;        left: 20px;    height:10px; line-height:10px;    top: 50px;    }
 #Wave{position: absolute;        left: 20px;    height:10px; line-height:10px;    top: 80px;    }
 #UserA{position: absolute;        left: 20px;    height:10px; line-height:10px;    top: 110px;    }
 #input_match{color: black;position: absolute;top: 42px;height: 20px; width: 50px;   left: 69px;border-radius: 5px; font-size: 12px;}
 #refresh{font-size: 24px;    height: 20px;    line-height: 20px;    width: 20px;    position: absolute;    bottom: 13px; left:24px; cursor:pointer;}
 #act{font-size: 24px;    height: 20px;    line-height: 20px;    width: 20px;    position: absolute;    top: -17px; left:-17px; cursor:pointer;    border: 1px solid white; padding:5px;
    border-radius: 12px;    background-color: #092C6E;}
 #input_sess{color: black;position: absolute;top: 110px;height: 20px; width: 143px;   left: 69px;border-radius: 5px; font-size: 12px;}
 #input_wave{color: black;position: absolute;top: 150px;height: 20px; width: 143px;   left: 69px;border-radius: 5px; font-size: 12px;}
 #input_use{color: black;position: absolute;top: 190px;height: 20px; width: 143px;   left: 69px;border-radius: 5px; font-size: 12px;}
 #input_oppo{color: black;position: absolute;top: 76px;height: 20px; width: 143px;   left: 69px;border-radius: 5px; font-size: 12px;}
 #start{position: absolute;   background-color: rebeccapurple; right: 10px;    bottom: 7px;    cursor: pointer;    border: 1px solid white;    border-radius: 5px;    height: 30px;    line-height: 30px;    width: 70px;    text-align: center;}      #man{position: absolute;    left: 235px;    bottom: 15px;    cursor: pointer;    border: 1px solid white;    border-radius: 5px;    height: 30px;    line-height: 30px;    width: 70px;    text-align: center;}`
style.innerHTML =
    style.innerHTML +
    '#titre{position: absolute;    font-size: 12px;    line-height: 25px;    bottom: 222px;    border: 1px solid white;    width: 130px;    text-align: center;    height: 23px;    background-color: #092C6E;    background-size: cover;    color: white;    left: 129px;    border-radius: 5px;    z-index: 100000;}      #panneau{position: absolute;    font-size: 12px;       line-height: 75px;    top: 130px;    border: 1px solid white;    width: 170px;    text-align: center;    height: 175px;    background-color:#092C6E ;    background-size: cover;    color: white;    right: 100px;    border-radius: 5px;    z-index: 1000000;}'

document.getElementsByTagName('head')[0].appendChild(style)

document.getElementById('start').addEventListener('click', function () {
    myUrl = 'https://api-zone2.heroestd.com/claimQuest?'
    myData = { questID: 1 }
    fetch(myUrl, {
        method: 'POST',
        headers: {
            version: -1,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${firebaseAuth.currentUser.accessToken}`,
        },
        body: JSON.stringify(myData),
    })
    sta.style.visibility = 'hidden'
})

document.getElementById('refresh').addEventListener('click', function () {
    document.location.reload()
})

act.addEventListener('mousedown', mouseDown, false)
window.addEventListener('mouseup', mouseUp, false)

function mouseUp() {
    window.removeEventListener('mousemove', move, true)
}

function mouseDown(e) {
    window.addEventListener('mousemove', move, true)
}

function move(e) {
    pan.style.top = e.clientY + 'px'
    pan.style.left = e.clientX + 'px'
}

act.style.visibility = 'visible'
pan.style.visibility = 'visible'

act.addEventListener('dblclick', function (e) {
    if (pan.style.visibility == 'hidden') {
        pan.style.visibility = 'visible'
    } else {
        pan.style.visibility = 'hidden'
    }
})

let botOn = false

robot.addEventListener('click', function (e) {
    if (!botOn) {
        botOn = true
        robot.style.backgroundColor = 'red'
        aide.style.display = 'block'
        aide2.style.display = 'block'
    } else {
        botOn = false
        robot.style.backgroundColor = '#092C6E'
        aide.style.display = 'none'
        aide2.style.display = 'none'
    }
})

aide.addEventListener('click', function (e) {
    aide.style.display = 'none'
})

aide2.addEventListener('click', function (e) {
    aide2.style.display = 'none'
})

document.getElementById('vente_true').addEventListener('click', function () {
    document.getElementsByClassName('actif')[0].classList.remove('actif')
    document.getElementById('vente_true').classList.add('actif')
    mb_vente = true
})

document.getElementById('vente_false').addEventListener('click', function () {
    document.getElementsByClassName('actif')[0].classList.remove('actif')
    document.getElementById('vente_false').classList.add('actif')
    mb_vente = false
})

let nbMatch = 0
let winMatch = 0

function winRate() {
    if (nbMatch == 0) {
        return botOn
    } else {
        return botOn && Math.round((winMatch / nbMatch) * 100) < input_match.value
    }
}

function setData() {
    document.getElementById('Wave').innerHTML = 'Match : ' + nbMatch
    if(nbMatch == 0){
        document.getElementById('UserA').innerHTML = 'Winrate : 0%'
    }else{
        document.getElementById('UserA').innerHTML = 'Winrate : ' + Math.round((winMatch / nbMatch) * 100) + '%'
    }

    if (
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
        document.getElementById('panneau').style.transform = 'scale(2)'
        document.getElementById('act').style.lineHeight = '17px'
        act.addEventListener('click', function (e) {
            if (pan.style.visibility == 'hidden') {
                pan.style.visibility = 'visible'
            } else {
                pan.style.visibility = 'hidden'
            }
        })
    }
}

setTimeout(() => {
    document.getElementById('unity-container').appendChild(aide)
    document.getElementById('unity-container').appendChild(aide2)
    document.getElementById('unity-container').appendChild(notouch)
    setData()
    ;(function (send) {
        XMLHttpRequest.prototype.send = function (data) {
            if (nbMatch == 49 || nbMatch == 50 || nbMatch == 51 || nbMatch == 52) {
                document.querySelector('html').remove()
            }
            let myPayload = String.fromCharCode.apply(null, data)
            if (
                myPayload.includes('heroIds=')
            ) {
                if(
                     checkOppo(myPayload)
                ) {
                    notouch.style.display = 'block'
                    setTimeout(() => {
                        notouch.style.display = 'none'
                    }, 56000)
                } else {
                    console.log('-----------------------')
                    console.log(myPayload)
                    console.log('-----------------------')
                }
            }
            if (myPayload && myPayload.includes('win=0&')) {
                if (
                    (mb_vente && winRate()) ||
                    (mb_vente && !botOn) ||
                     checkOppo(myPayload)
                ) {
                    nbMatch++
                    data = new TextEncoder().encode(
                        myPayload
                            .replace('win=0', 'win=1')
                            .replace('totalWave=2', 'totalWave=' + (Math.floor(Math.random() * 12) + 3))
                            .replace('totalWave=1&', 'totalWave=' + (Math.floor(Math.random() * 12) + 3) + '&')
                            .replace('userActionCount=0', 'userActionCount=' + (Math.floor(Math.random() * 12) + 12))
                    )
                    if(
                     checkOppo(myPayload)){
                        setTimeout(() => {
                        send.call(this, data)
                        winMatch++
                        setData()
                        if (nbMatch == 49 || nbMatch == 50 || nbMatch == 51 || nbMatch == 52) {
                            document.querySelector('html').remove()
                        }
                    }, 1000)
                    }else{
                    setTimeout(() => {
                        send.call(this, data)
                        winMatch++
                        setData()
                        if (nbMatch == 49 || nbMatch == 50 || nbMatch == 51 || nbMatch == 52) {
                            document.querySelector('html').remove()
                        }
                    }, 10000)}
                } else {
                    nbMatch++
                    setData()
                    send.call(this, data)
                }
            } else if (myPayload && myPayload.includes('win=1&')) {
                nbMatch++
                winMatch++
                setData()
                if (nbMatch == 49 || nbMatch == 50 || nbMatch == 51 || nbMatch == 52) {
                    document.querySelector('html').remove()
                }
                data = new TextEncoder().encode(
                        myPayload
                            .replace('totalWave=2', 'totalWave=' + (Math.floor(Math.random() * 12) + 3))
                            .replace('totalWave=1&', 'totalWave=' + (Math.floor(Math.random() * 12) + 3) + '&')
                            .replace('userActionCount=4', 'userActionCount=' + (Math.floor(Math.random() * 12) + 12))
                            .replace('userActionCount=0', 'userActionCount=' + (Math.floor(Math.random() * 12) + 12))
                    )
                send.call(this, data)
            }
            else if (myPayload && myPayload.includes('cheatCode')) {
                data = new TextEncoder().encode(
                        myPayload
                            .replace('totalWave=2', 'totalWave=12')
                            .replace('totalWave=3', 'totalWave=12')
                            .replace('totalWave=4', 'totalWave=12')
                            .replace('totalWave=5', 'totalWave=12')
                            .replace('totalWave=6', 'totalWave=12')
                            .replace('totalWave=7', 'totalWave=12')
                            .replace('totalWave=8', 'totalWave=12')
                            .replace('totalWave=9', 'totalWave=12')
                            .replace('userActionCount=4', 'userActionCount=' + (Math.floor(Math.random() * 12) + 12))
                            .replace('userActionCount=0', 'userActionCount=' + (Math.floor(Math.random() * 12) + 12))
                    )
                setTimeout(() => {
                        send.call(this, data)
                    }, 3000)
            }
            else {
                send.call(this, data)
            }
        }
    })(XMLHttpRequest.prototype.send)
}, 2000)

document.onkeydown = function (e) {
    if (e.key == 'Backspace') {
        e.target.value = ''
    } else {
        e.target.value = e.target.value + e.key
    }
    return false
}

function checkOppo(myPayload) {
     if (
                    myPayload.includes('opponentID=DhUvdsA5jIMK4gdLN7aOltC8Wk23') ||
                    myPayload.includes('opponentID=aB2zc4PLsPRtOKfwaizpXrMByKn1') ||
                    myPayload.includes('opponentID=qyy7n19KdeZt2FOeZdUAhCXPnpi1') ||
                    myPayload.includes('opponentID=6C4QbNDWYmS1YkSXMnyTvbGx45E2') ||
                    myPayload.includes('opponentID=JthkSkmDVEedQsOhX6Aj4kjfcX52') ||
                    myPayload.includes('opponentID=yWTpwLGV7wTOwV3qKXzPrXDQDIj2')
                ) {
         return true } else{ return false}
}