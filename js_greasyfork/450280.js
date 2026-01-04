// ==UserScript==
// @name         青书课堂第三学期下
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  qingshushuake
// @author       v-wei
// @match        *://degree.qingshuxuetang.com/bjkj/Student/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @include      *://degree.qingshuxuetang.com/bjkj/Student/Course/CourseShow/*
// @include      *://degree.qingshuxuetang.com/bjkj/Student/Course/*
// @include      *://degree.qingshuxuetang.com/bjkj/Student/*
// @include      *://degree.qingshuxuetang.com/bjkj/*
// @include      *://degree.qingshuxuetang.com/*
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/450280/%E9%9D%92%E4%B9%A6%E8%AF%BE%E5%A0%82%E7%AC%AC%E4%B8%89%E5%AD%A6%E6%9C%9F%E4%B8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/450280/%E9%9D%92%E4%B9%A6%E8%AF%BE%E5%A0%82%E7%AC%AC%E4%B8%89%E5%AD%A6%E6%9C%9F%E4%B8%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...
    let getLocation = document.querySelector(".breadcrumb").getElementsByTagName("a")[2].attributes["href"].nodeValue
    const getLocationCourseId = getLocation.match(/[0-9]+/)[0]
    // 马克思
    if (getLocationCourseId == 29) {

        if (!window.localStorage.getItem("GShapter") && !window.localStorage.getItem("GSections")) {
            console.log("已经有章数节数了")
            // 章数
            let GShapter = 1
            // 节数
            let GSections = 1
            window.localStorage.setItem("GShapter", GShapter)
            window.localStorage.setItem("GSections", GSections)
        }

        let a = setInterval(function () {
            try {

                let volumeLevel = document.querySelector(".vjs-volume-level")
                if (volumeLevel.style.height = "100%") {
                    document.querySelector(".vjs-vol-3").click()
                    volumeLevel.style.height = "0%"
                }

            } catch (error) {
                console.log(error)
            }
            try {
                let playDom = document.querySelector(".vjs-big-play-button")
                playDom.click()
            } catch (error) {
                console.log(error)
            }
            let playProgress = document.querySelector(".vjs-play-progress")
            if (playProgress.style.width == "100%") {
                let GShapter = window.localStorage.getItem("GShapter")
                let GSections = window.localStorage.getItem("GSections")
                try {
                    document.querySelector("#courseware-kcjs_" + GShapter + "_" + GSections).click()
                } catch (error) {
                    console.error(error)
                    ++GShapter
                    GSections = 0
                    console.log("章数增加了，章数为:" + GShapter)
                }
                ++GSections
                window.localStorage.setItem("GShapter", GShapter)
                window.localStorage.setItem("GSections", GSections)
                GShapter = window.localStorage.getItem("GShapter")
                GSections = window.localStorage.getItem("GSections")
            }
            console.log(playProgress.style.width)
        }, 500)
    }// 形式政策   
    else if (getLocationCourseId == 20) {

        if (!window.localStorage.getItem("SJJGhapter") && !window.localStorage.getItem("SJJGections")) {
            console.log("已经有章数节数了")
            // 章数
            let SJJGhapter = 2
            // 节数
            let SJJGections = 7
            window.localStorage.setItem("SJJGhapter", SJJGhapter)
            window.localStorage.setItem("SJJGections", SJJGections)
        }

        let a = setInterval(function () {
            try {
                let volumeLevel = document.querySelector(".vjs-volume-level")
                if (volumeLevel.style.height = "100%") {
                    document.querySelector(".vjs-vol-3").click()
                    volumeLevel.style.height = "0%"
                }

            } catch (error) {
                console.log(error)
            }
            try {
                let playDom = document.querySelector(".vjs-big-play-button")
                playDom.click()
            } catch (error) {
                console.log(error)
            }
            let playProgress = document.querySelector(".vjs-play-progress")
            if (playProgress.style.width == "100%") {
                let SJJGhapter = window.localStorage.getItem("SJJGhapter")
                let SJJGections = window.localStorage.getItem("SJJGections")
                try {
                    // debugger
                    document.querySelector("#courseware-kcjs_" + SJJGhapter + "_" + SJJGections).click()
                } catch (error) {
                    console.error(error)
                    ++SJJGhapter
                    SJJGections = 0
                    console.log("章数增加了，章数为:" + SJJGhapter)
                }
                ++SJJGections
                console.log("节数增加了，节数为:" + SJJGhapter)
                window.localStorage.setItem("SJJGhapter", SJJGhapter)
                window.localStorage.setItem("SJJGections", SJJGections)
                SJJGhapter = window.localStorage.getItem("SJJGhapter")
                SJJGections = window.localStorage.getItem("SJJGections")
            }
            console.log(playProgress.style.width)
        }, 500)
    }//关系代数
    else if (getLocationCourseId == 44) {

        if (!window.localStorage.getItem("javaShapter") && !window.localStorage.getItem("javaSections")) {
            console.log("已经有章数节数了")
            // 章数
            let javaShapter = 1
            // 节数
            let javaSections = 1
            window.localStorage.setItem("javaShapter", javaShapter)
            window.localStorage.setItem("javaSections", javaSections)
        }

        let a = setInterval(function () {
            try {

                let volumeLevel = document.querySelector(".vjs-volume-level")
                if (volumeLevel.style.height = "100%") {
                    document.querySelector(".vjs-vol-3").click()
                    volumeLevel.style.height = "0%"
                }

            } catch (error) {
                console.log(error)
            }
            try {
                let playDom = document.querySelector(".vjs-big-play-button")
                playDom.click()
            } catch (error) {
                console.log(error)
            }
            let playProgress = document.querySelector(".vjs-play-progress")
            if (playProgress.style.width == "100%") {
                let javaShapter = window.localStorage.getItem("javaShapter")
                let javaSections = window.localStorage.getItem("javaSections")
                try {
                    document.querySelector("#courseware-kcjs_" + javaShapter + "_" + javaSections).click()
                } catch (error) {
                    console.error(error)
                    ++javaShapter
                    javaSections = 0
                    console.log("章数增加了，章数为:" + javaShapter)
                }
                ++javaSections
                window.localStorage.setItem("javaShapter", javaShapter)
                window.localStorage.setItem("javaSections", javaSections)
                javaShapter = window.localStorage.getItem("javaShapter")
                javaSections = window.localStorage.getItem("javaSections")
            }
            console.log(playProgress.style.width)
        }, 500)
    }//java程序设计(专升本)
    else if (getLocationCourseId == 34) {
        if (!window.localStorage.getItem("javaShapter") && !window.localStorage.getItem("javaSections")) {
            console.log("已经有章数节数了")
            // 章数
            let javaShapter = 1
            // 节数
            let javaSections = 1
            window.localStorage.setItem("javaShapter", javaShapter)
            window.localStorage.setItem("javaSections", javaSections)
        }

        let a = setInterval(function () {
            try {

                let volumeLevel = document.querySelector(".vjs-volume-level")
                if (volumeLevel.style.height = "100%") {
                    document.querySelector(".vjs-vol-3").click()
                    volumeLevel.style.height = "0%"
                }

            } catch (error) {
                console.log(error)
            }
            try {
                let playDom = document.querySelector(".vjs-big-play-button")
                playDom.click()
            } catch (error) {
                console.log(error)
            }
            let playProgress = document.querySelector(".vjs-play-progress")
            if (playProgress.style.width == "100%") {
                let javaShapter = window.localStorage.getItem("javaShapter")
                let javaSections = window.localStorage.getItem("javaSections")
                try {
                    document.querySelector("#courseware-kcjs_" + javaShapter + "_" + javaSections).click()
                } catch (error) {
                    console.error(error)
                    ++javaShapter
                    javaSections = 0
                    console.log("章数增加了，章数为:" + javaShapter)
                }
                ++javaSections
                window.localStorage.setItem("javaShapter", javaShapter)
                window.localStorage.setItem("javaSections", javaSections)
                javaShapter = window.localStorage.getItem("javaShapter")
                javaSections = window.localStorage.getItem("javaSections")
            }
            console.log(playProgress.style.width)
        }, 500)
    }
    // 软件工程
    else if (getLocationCourseId == 64) {

        if (!window.localStorage.getItem("XSZCShapter") && !window.localStorage.getItem("XSZCSections")) {
            console.log("已经有章数节数了")
            // 章数
            let XSZCShapter = 1
            // 节数
            let XSZCSections = 1
            window.localStorage.setItem("XSZCShapter", XSZCShapter)
            window.localStorage.setItem("XSZCSections", XSZCSections)
        }

        let a = setInterval(function () {
            try {

                let volumeLevel = document.querySelector(".vjs-volume-level")
                if (volumeLevel.style.height = "100%") {
                    document.querySelector(".vjs-vol-3").click()
                    volumeLevel.style.height = "0%"
                }

            } catch (error) {
                console.log(error)
            }
            try {
                let playDom = document.querySelector(".vjs-big-play-button")
                playDom.click()
            } catch (error) {
                console.log(error)
            }
            let playProgress = document.querySelector(".vjs-play-progress")
            if (playProgress.style.width == "100%") {
                let XSZCShapter = window.localStorage.getItem("XSZCShapter")
                let XSZCSections = window.localStorage.getItem("XSZCSections")
                try {
                    document.querySelector("#courseware-kcjs_" + XSZCShapter + "_" + XSZCSections).click()
                } catch (error) {
                    console.error(error)
                    ++XSZCShapter
                    XSZCSections = 0
                    console.log("章数增加了，章数为:" + XSZCShapter)
                }
                ++XSZCSections
                window.localStorage.setItem("XSZCShapter", XSZCShapter)
                window.localStorage.setItem("XSZCSections", XSZCSections)
                XSZCShapter = window.localStorage.getItem("XSZCShapter")
                XSZCSections = window.localStorage.getItem("XSZCSections")
            }
            console.log(playProgress.style.width)
        }, 500)
    }// 计算机网络与通讯(专升本)
    else if (getLocationCourseId == 63) {

        if (!window.localStorage.getItem("JSJWLTXShapter") && !window.localStorage.getItem("JSJWLTXSections")) {
            console.log("已经有章数节数了")
            // 章数
            let JSJWLTXShapter = 1
            // 节数
            let JSJWLTXSections = 1
            window.localStorage.setItem("JSJWLTXShapter", JSJWLTXShapter)
            window.localStorage.setItem("JSJWLTXSections", JSJWLTXSections)
        }

        let a = setInterval(function () {
            try {

                let volumeLevel = document.querySelector(".vjs-volume-level")
                if (volumeLevel.style.height = "100%") {
                    document.querySelector(".vjs-vol-3").click()
                    volumeLevel.style.height = "0%"
                }

            } catch (error) {
                console.log(error)
            }
            try {
                let playDom = document.querySelector(".vjs-big-play-button")
                playDom.click()
            } catch (error) {
                console.log(error)
            }
            let playProgress = document.querySelector(".vjs-play-progress")
            if (playProgress.style.width == "100%") {
                let JSJWLTXShapter = window.localStorage.getItem("JSJWLTXShapter")
                let JSJWLTXSections = window.localStorage.getItem("JSJWLTXSections")
                try {
                    document.querySelector("#courseware-kcjs_" + JSJWLTXShapter + "_" + JSJWLTXSections).click()
                } catch (error) {
                    console.error(error)
                    ++JSJWLTXShapter
                    JSJWLTXSections = 0
                    console.log("章数增加了，章数为:" + JSJWLTXShapter)
                }
                ++JSJWLTXSections
                window.localStorage.setItem("JSJWLTXShapter", JSJWLTXShapter)
                window.localStorage.setItem("JSJWLTXSections", JSJWLTXSections)
                JSJWLTXShapter = window.localStorage.getItem("JSJWLTXShapter")
                JSJWLTXSections = window.localStorage.getItem("JSJWLTXSections")
            }
            console.log(playProgress.style.width)
        }, 500)
    }
    // 网页设计(专升本)
    else if (getLocationCourseId == 58) {

        if (!window.localStorage.getItem("WYSJShapter") && !window.localStorage.getItem("WYSJSections")) {
            console.log("已经有章数节数了")
            // 章数
            let WYSJShapter = 1
            // 节数
            let WYSJSections = 1
            window.localStorage.setItem("WYSJShapter", WYSJShapter)
            window.localStorage.setItem("WYSJSections", WYSJSections)
        }

        let a = setInterval(function () {
            try {

                let volumeLevel = document.querySelector(".vjs-volume-level")
                if (volumeLevel.style.height = "100%") {
                    document.querySelector(".vjs-vol-3").click()
                    volumeLevel.style.height = "0%"
                }

            } catch (error) {
                console.log(error)
            }
            try {
                let playDom = document.querySelector(".vjs-big-play-button")
                playDom.click()
            } catch (error) {
                console.log(error)
            }
            let playProgress = document.querySelector(".vjs-play-progress")
            if (playProgress.style.width == "100%") {
                let WYSJShapter = window.localStorage.getItem("WYSJShapter")
                let WYSJSections = window.localStorage.getItem("WYSJSections")
                try {
                    document.querySelector("#courseware-kcjs_" + WYSJShapter + "_" + WYSJSections).click()
                } catch (error) {
                    console.error(error)
                    ++WYSJShapter
                    WYSJSections = 0
                    console.log("章数增加了，章数为:" + WYSJShapter)
                }
                ++WYSJSections
                window.localStorage.setItem("WYSJShapter", WYSJShapter)
                window.localStorage.setItem("WYSJSections", WYSJSections)
                WYSJShapter = window.localStorage.getItem("WYSJShapter")
                WYSJSections = window.localStorage.getItem("WYSJSections")
            }
            console.log(playProgress.style.width)
        }, 500)
    }
    // 数字图像处理(专升本)
    else if (getLocationCourseId == 43) {

        if (!window.localStorage.getItem("SZTXCLShapter") && !window.localStorage.getItem("SZTXCLSections")) {
            console.log("已经有章数节数了")
            // 章数
            let SZTXCLShapter = 1
            // 节数
            let SZTXCLSections = 1
            window.localStorage.setItem("SZTXCLShapter", SZTXCLShapter)
            window.localStorage.setItem("SZTXCLSections", SZTXCLSections)
        }

        let a = setInterval(function () {
            try {

                let volumeLevel = document.querySelector(".vjs-volume-level")
                if (volumeLevel.style.height = "100%") {
                    document.querySelector(".vjs-vol-3").click()
                    volumeLevel.style.height = "0%"
                }

            } catch (error) {
                console.log(error)
            }
            try {
                let playDom = document.querySelector(".vjs-big-play-button")
                playDom.click()
            } catch (error) {
                console.log(error)
            }
            let playProgress = document.querySelector(".vjs-play-progress")
            if (playProgress.style.width == "100%") {
                let SZTXCLShapter = window.localStorage.getItem("SZTXCLShapter")
                let SZTXCLSections = window.localStorage.getItem("SZTXCLSections")
                try {
                    document.querySelector("#courseware-kcjs_" + SZTXCLShapter + "_" + SZTXCLSections).click()
                } catch (error) {
                    console.error(error)
                    ++SZTXCLShapter
                    SZTXCLSections = 0
                    console.log("章数增加了，章数为:" + SZTXCLShapter)
                }
                ++SZTXCLSections
                window.localStorage.setItem("SZTXCLShapter", SZTXCLShapter)
                window.localStorage.setItem("SZTXCLSections", SZTXCLSections)
                SZTXCLShapter = window.localStorage.getItem("SZTXCLShapter")
                SZTXCLSections = window.localStorage.getItem("SZTXCLSections")
            }
            console.log(playProgress.style.width)
        }, 500)
    }
    //论文文献
    else if (getLocationCourseId == 13) {
        if (!window.localStorage.getItem("countEnglish")) {
            let countEnglishEnglish1 = 1
            window.localStorage.setItem("countEnglish", countEnglishEnglish1)
        }

        let a = setInterval(function () {
            try {
                let volumeLevel = document.querySelector(".vjs-volume-level")
                if (volumeLevel.style.height = "100%") {
                    document.querySelector(".vjs-vol-3").click()
                    volumeLevel.style.height = "0%"
                }
            } catch (error) {
                console.log(error)
            }
            try {
                let playDom = document.querySelector(".vjs-big-play-button")
                playDom.click()
            } catch (error) {
                console.log(error)
            }
            let playProgress = document.querySelector(".vjs-play-progress")
            if (playProgress.style.width == "100%") {
                // 英语
                let countEnglish = window.localStorage.getItem("countEnglish")
                document.querySelector("#courseware-kcjs_" + countEnglish).click()
                ++countEnglish
                window.localStorage.setItem("countEnglish", countEnglish)
                countEnglish = window.localStorage.getItem("countEnglish")
            }
            console.log(playProgress.style.width)
        }, 500)
    } // 人工智能(专升本)
    else if (getLocationCourseId == 36) {
        if (!window.localStorage.getItem("countRGZN")) {
            let countRGZN = 1
            window.localStorage.setItem("countRGZN", countRGZN)
        }

        let a = setInterval(function () {
            try {
                let volumeLevel = document.querySelector(".vjs-volume-level")
                if (volumeLevel.style.height = "100%") {
                    document.querySelector(".vjs-vol-3").click()
                    volumeLevel.style.height = "0%"
                }
            } catch (error) {
                console.log(error)
            }
            try {
                let playDom = document.querySelector(".vjs-big-play-button")
                playDom.click()
            } catch (error) {
                console.log(error)
            }
            let playProgress = document.querySelector(".vjs-play-progress")
            if (playProgress.style.width == "100%") {
                // 英语
                let countRGZN = window.localStorage.getItem("countRGZN")
                document.querySelector("#courseware-kcjs_" + countRGZN).click()
                ++countRGZN
                window.localStorage.setItem("countRGZN", countRGZN)
                countRGZN = window.localStorage.getItem("countRGZN")
            }
            console.log(playProgress.style.width)
        }, 500)
    }
})();
