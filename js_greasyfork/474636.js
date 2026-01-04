// ==UserScript==
// @name         广东省干部培训网络学院
// @namespace    cosil_gbpx.gd.gov.cn
// @version      1.2
// @description  广东省干部培训网络学院99
// @author       科西尔·
// @match        http*://gbpx.gd.gov.cn/gdceportal/Study/StudyCenter.aspx*
// @icon         https://gbpx.gd.gov.cn/gdceportal/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/js-sha1/0.6.0/sha1.min.js
// @grant        不安全窗口
// @grant        GM_xmlhttpRequest
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/474636/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%B9%B2%E9%83%A8%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/474636/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%B9%B2%E9%83%A8%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.meta.js
// ==/UserScript==

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// 指定Chrome WebDriver的路径
const chromeDriverPath = 'C:/Program Files/Google/Chrome/Application/chromedriver.exe';
const service = new chrome.ServiceBuilder(chromeDriverPath).build();
const driver = new Builder().forBrowser('chrome').setChromeService(service).build();

console.log("已加载");

if (unsafeWindow.location.pathname == '/gdceportal/Study/StudyCenter.aspx') {
    // 监测iframe加载
    new Promise((resolve, reject) => {
        let retry = 10;
        let dataMainLoadWatcher = setInterval(() => {
            console.log('等待#dataMainIframe加载', retry);
            let targetEle = document.querySelector('#secondIframe')?.contentDocument.querySelector('#thirdIframe')?.contentDocument.querySelector('#dataMainIframe')?.contentDocument.querySelector('a.courseware-list-reed');
            if (targetEle) {
                clearInterval(dataMainLoadWatcher);
                console.log('#dataMainIframe加载成功');
                resolve(targetEle);
                return;
            } else if (--retry < 0) {
                reject();
                return;
            }
        }, 1000);
    }).then(targetEle => {
        // 在iframe加载成功后执行自动化操作
        handleLearningCourse(targetEle);
    }).catch(err => {
        console.log(err);
        unsafeWindow.location.reload();
    });
}

function handleLearningCourse(targetEle) {
    const math = require('math');

    async function switchToFrame(driver) {
        await driver.switchTo().frame('secondIframe');
        await driver.switchTo().frame('thirdIframe');
        await driver.switchTo().frame('dataMainIframe');
    }

    async function runMain(videoUnstudyNum, driver) {
        if (parseInt(videoUnstudyNum) > 0) {
            console.log(`nonlocal--该目录下还有 ${videoUnstudyNum} 个视频未学习……`);
            await driver.executeScript("document.getElementsByClassName('courseware-list-reed')[0].click()");
            await driver.sleep(3000);

            // 获取所有窗口句柄
            const allHandles = await driver.getAllWindowHandles();
            const preWindowHandle = await driver.getWindowHandle();

            // 遍历窗口句柄，切换到新窗口
            for (const handle of allHandles) {
                if (handle !== preWindowHandle) {
                    await driver.switchTo().window(handle);
                    await driver.manage().setTimeouts({ implicit: 10000 });
                    await driver.sleep(2000);

                    // 切换到嵌套的iframe
                    await switchToFrame(driver);
                    await driver.sleep(10000);

                    // 检查视频是否暂停
                    const jsPaused = 'return document.getElementById("my-video_html5_api").paused;';
                    const viewPausedStatus = await driver.executeScript(jsPaused);
                    console.log('viewPaused：' + viewPausedStatus);

                    if (viewPausedStatus) {
                        const elem = await driver.findElement(By.className('vjs-play-control'));
                        await elem.click();
                    }
                    await driver.sleep(5000);

                    // 获取视频总时长
                    const jsDurationStr = 'return document.getElementById("my-video_html5_api").duration;';
                    const viewTime = await driver.executeScript(jsDurationStr);
                    console.log('viewTime:' + viewTime);
                    await driver.sleep(5000);

                    // 获取当前播放时间
                    const jsCurrentTimeStr = 'return document.getElementById("my-video_html5_api").currentTime;';
                    const viewCurrentTime = await driver.executeScript(jsCurrentTimeStr);
                    console.log('viewCurrentTime:' + viewCurrentTime);

                    if (Math.ceil(viewCurrentTime) >= Math.ceil(viewTime)) {
                        console.log('视频播放完毕');
                        await driver.switchTo().defaultContent();
                        const exitElem = await driver.findElement(By.id('btnexit'));
                        await exitElem.click();

                        await driver.switchTo().window(preWindowHandle);
                        await driver.navigate().refresh();
                        await driver.manage().setTimeouts({ implicit: 10000 });
                        await switchToFrame(driver);

                        const jsList = 'return document.getElementsByClassName("courseware-list-reed").length;';
                        videoUnstudyNum = await driver.executeScript(jsList);
                        await driver.sleep(3000);

                        // 递归调用runMain，处理下一个视频
                        await runMain(videoUnstudyNum, driver);
                    } else {
                        console.log('继续观看视频');
                        await driver.sleep(Math.ceil(viewTime) - Math.ceil(viewCurrentTime));
                        await driver.switchTo().defaultContent();
                        const exitElem = await driver.findElement(By.id('btnexit'));
                        await exitElem.click();

                        await driver.switchTo().window(preWindowHandle);
                        await driver.navigate().refresh();
                        await driver.manage().setTimeouts({ implicit: 10000 });
                        await switchToFrame(driver);

                        const jsList = 'return document.getElementsByClassName("courseware-list-reed").length;';
                        videoUnstudyNum = await driver.executeScript(jsList);
                        await driver.sleep(3000);

                        // 递归调用runMain，处理下一个视频
                        await runMain(videoUnstudyNum, driver);
                    }
                }
            }
        } else {
            console.log("该目录下还有视频已学习完毕……");
        }
    }

    async function main() {
        try {
            const studyUrl = "https://gbpx.gd.gov.cn/gdceportal/Study/StudyCenter.aspx";
            await driver.get(studyUrl);
            await driver.sleep(3000);
            await switchToFrame(driver);

            const jsList = 'return document.getElementsByClassName("courseware-list-reed").length;';
            let videoUnstudyNum = await driver.executeScript(jsList);
            await driver.sleep(3000);

            await runMain(videoUnstudyNum, driver);
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            await driver.quit();
            console.log("end......");
        }
    }

    // 在这里调用main函数以开始自动化操作
    main();
}