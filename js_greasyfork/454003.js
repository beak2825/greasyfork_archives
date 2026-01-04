// ==UserScript==
// @name         DianpingToolTest
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Tool for Dianping
// @author       unknown
// @match        http://www.dianping.com/shop*
// @match        https://www.dianping.com/shop*
// @icon         https://www.google.com/s2/favicons?domain=dianping.com
// @require      https://greasyfork.org/scripts/435146-html2canvas-132/code/html2canvas132.js?version=986217
// @require      https://unpkg.com/tesseract.js@2.1.0/dist/tesseract.min.js
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/454003/DianpingToolTest.user.js
// @updateURL https://update.greasyfork.org/scripts/454003/DianpingToolTest.meta.js
// ==/UserScript==
/* global html2canvas Tesseract */

// console.log(GM_info);
const moreBtnClass = '.fold';
const lessBtnClass = '.unfold';
const commentClass = '.review-words';
const nextBtnClass = '.NextPage';
const toCSVClass = '.ToCsv';
//评论发布时间
const reviewPublishTime = '.time';
//评论发布用户名
const reviewPublisher = '.name';

const ppocrUrl = 'https://www.paddlepaddle.org.cn/paddlehub-api/image_classification/chinese_ocr_db_crnn_mobile';

(function () {
    'use strict';

    const $ = document.querySelectorAll.bind(document);

    const renderCmt = elm => {
        return new Promise((resolve, reject) => {
            // console.log('elm', elm)
            html2canvas(elm, {
                allowTaint: true,
                scale: 1,
                useCORS: true,
                width: elm.offsetWidth * 1.2,
                height: elm.offsetHeight * 1.2,
                x: -elm.offsetWidth * 0.1,
                y: -elm.offsetHeight * 0.16
            }).then(canvas => {
                const data = canvas.toDataURL().split(',')[1];
                // console.log('data', data);
                // document.body.append(canvas);
                GM.xmlHttpRequest({
                    method: 'POST',
                    url: ppocrUrl,
                    responseType: 'json',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({ image: data }),
                    onload: response => {
                        // console.log('response', response);
                        const res = response.response.result[0].data.map(r => r.text).join('');
                        return resolve(res);
                    }
                });
                // return resolve(canvas);
                // console.log('start to recognize');
                // Tesseract.recognize(canvas, 'chi_sim', {
                // langPath: 'https://raw.githubusercontent.com/naptha/tessdata/gh-pages/4.0.0_best/',
                // }).then(res => {
                // console.log(res);
                // const { text } = res.data;
                // return resolve(text);
                // })
            })
        });
    }

    const getAllCommentCanvas = async () => {
        let comments = $(commentClass);
        // comments = [comments[0]];
        let tasks = [];
        let ret = [];
        //for(let i = 0;i <= comments.length; i++) {
        //const cmt = comments[i];
        //const res = await renderCmt(cmt)
        //console.log('res', i, res);
        //}
        comments.forEach((cmt, idx) => {
            const imgs = cmt.querySelectorAll('img');
            imgs.forEach(img => cmt.removeChild(img));
            tasks.push(renderCmt(cmt));
        });
        ret = await Promise.all(tasks);
        return ret;
    }

    const getResult = async () => {
        const $ = document.querySelectorAll.bind(document);
        const documentTxt = new XMLSerializer().serializeToString(document);
        const getCssUrl = () => {
            const bar = documentTxt.matchAll(/href=\"(\/\/s3plus\.meituan\.net\/v1\/.*?)\"/g);
            const baz = [...bar];
            return baz.map(b => 'https:' + b[1]);
        }

        const getSvgUrl = (content) => {
            const bar = content.matchAll(/\[class\^=\"(.*?)\"\].*?url\((\/\/s3plus.meituan.net\/v1\/.*?)\)/g);
            const baz = [...bar];
            return baz;
        }

        const getFileViaUrl = url => {
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'text',
                    headers: {
                        'Content-Type': 'text/css'
                    },
                    onload: response => {
                        if (response.status === 200) return resolve(response.response)
                        else return resolve('');
                    }
                });
            });
        };

        const cssNameMap = {};
        const svgMap = {};
        const urls = getCssUrl();
        let svgUrls = [];
        for (let i = 0; i < urls.length; i += 1) {
            const cssContent = await getFileViaUrl(urls[i]);
            const matchs = cssContent.matchAll(/.(.*?)\{background:-(.*?)px -(.*?)px;}/mg);
            const matchNames = [...matchs];
            matchNames.forEach(name => {
                if (!name[0].includes('[')) {
                    cssNameMap[name[1]] = [+Number(name[2]).toFixed(0), +Number(name[3]).toFixed(0)]
                }
            });
            const svgUrl = getSvgUrl(cssContent);
            svgUrls = [...svgUrl, ...svgUrls];

        }
        console.log(svgUrls);
        for (let i = 0; i < svgUrls.length; i += 1) {
            const svgContent = await getFileViaUrl(svgUrls[i][2]);
            console.log(svgContent);
            const fontLocMap = [...svgContent.matchAll(/<text x=\".*?\" y=\"(.*?)\">(.*?)<\/text>/mg)];
            console.log(fontLocMap)
            let fontHeightOffset = 0;
            let fontWeightOffset = 0;
            if (svgContent.includes('#333')) {
                fontHeightOffset = 23;
                fontWeightOffset = 0;
            }
            if (svgContent.includes('#666')) {
                fontHeightOffset = 15;
                fontWeightOffset = 0;
            }
            const fontLoc = {};
            fontLocMap.forEach((fl, idx) => {
                fontLoc[fl[1]] = idx + 1;
            });
            console.log(fontLoc);
            svgMap[svgUrls[i][1]] = {};
            svgMap[svgUrls[i][1]]['fontLocMap'] = fontLocMap;
            svgMap[svgUrls[i][1]]['fontHeightOffset'] = fontHeightOffset;
            svgMap[svgUrls[i][1]]['fontWeightOffset'] = fontWeightOffset;
            svgMap[svgUrls[i][1]]['fontLoc'] = fontLoc;
        }
        console.log('svgMap', svgMap);
        console.log('cssNameMap', cssNameMap);
        Object.keys(cssNameMap).forEach((key, idx) => {
            const arr = cssNameMap[key];
            const keys = Object.keys(svgMap);
            const foo = keys.find(k => key.includes(k));
            const fontMap = svgMap[foo];
            if (!fontMap) return;
            const locX = arr[0];
            const locY = arr[1];
            const fontHeightOffset = fontMap.fontHeightOffset;
            const fontWeightOffset = fontMap.fontWeightOffset;
            const fontLoc = fontMap.fontLoc;
            const fontLocMap = fontMap.fontLocMap;
            const locXLine = Math.floor((locX + fontWeightOffset) / 14);
            const locYLine = fontLoc[locY + fontHeightOffset];
            let val = '';
            console.log('fontLocMap', fontLocMap);
            if (fontLocMap[locYLine - 1]) val = fontLocMap[locYLine - 1][2][locXLine];
            cssNameMap[key].push(val);
        });
        console.log('cssMap', cssNameMap)
        const comments = [...$(commentClass)];
        const result = [];
        // const result = [['time','text']];
        const rankDivs = [...$('.review-rank')];//提取用户评分（1到5颗星）

        const times = [...$('.time')];//发布时间集合
        var timeIndex = 0;
        const names = [...$('.name')];//包含点评网登录用户名，每页15个评论的话，返回16个，其中第一个是登录用户名（有匿名用户）
        var nameIndex = 1;//从第2个开始提取发布评论的用户名
        comments.forEach(cmt => {
            const imgs = cmt.querySelectorAll('img');
            imgs.forEach(img => cmt.removeChild(img));
            const nodes = [...cmt.childNodes];
            let foo = '';
            nodes.forEach(node => {
                const cls = node.className;
                if (cls) {
                    const bar = cssNameMap[cls];
                    if (bar) foo += bar[2];
                } else foo += node.textContent;
            });
            var time = times[timeIndex].textContent;
            var name = names[nameIndex].textContent;
            var namehref = "";
            //记录用户主页url；后续再访问用户主页，获取注册信息
            namehref = names[nameIndex].href;
            var rank = 0.0;//初始化评分制
            //提取用户评价星级（span的class属性值为“sml-rank-stars sml-str50 star”，str50即为5颗星，str30为3颗星）
            if (rankDivs[timeIndex].getElementsByTagName("span").length > 0) {//div没有span子节点的话，说明该条评论中没有星级打分数据，打分值设为0;如果有的话，提取第1个子节点的数据即可；
                var rankstring = parseFloat(rankDivs[timeIndex].firstElementChild.className.split(' ')[1].split('-')[1].substring(3, 5));
                rank = rankstring / 10.0;
            }
            console.log(time);
            //评论中如果有英文逗号，在导出为CSV时会被视为列分隔符，导致一条评论内容被截断为多列。
            //因此，需要替换为中文逗号，保证一条评论内容被当作一列处理。
            foo = foo.replace(/,/ig, '，');
            result.push([time, name, foo.trim(), rank, namehref]);
            timeIndex++;
            nameIndex++;
        });

        return result;
    }


    // const getResult2 = async () => {
    //     const $ = document.querySelectorAll.bind(document);
    //     const documentTxt = new XMLSerializer().serializeToString(document);
    //     const getCssUrl = () => {
    //         const bar = documentTxt.matchAll(/href=\"(\/\/s3plus\.meituan\.net\/v1\/.*?)\"/g);
    //         const baz = [...bar];
    //         return baz.map(b => 'https:' + b[1]);
    //     }

    //     const getSvgUrl = (content) => {
    //         const bar = content.matchAll(/\[class\^=\"(.*?)\"\].*?url\((\/\/s3plus.meituan.net\/v1\/.*?)\)/g);
    //         const baz = [...bar];
    //         return baz;
    //     }

    //     const getFileViaUrl = url => {
    //         return new Promise((resolve, reject) => {
    //             GM.xmlHttpRequest({
    //                 method: 'GET',
    //                 url: url,
    //                 responseType: 'text',
    //                 headers: {
    //                     'Content-Type': 'text/css'
    //                 },
    //                 onload: response => {
    //                     if (response.status === 200) return resolve(response.response)
    //                     else return resolve('');
    //                 }
    //             });
    //         });
    //     };

    //     const cssNameMap = {};
    //     const svgMap = {};
    //     const urls = getCssUrl();
    //     let svgUrls = [];
    //     for (let i = 0; i < urls.length; i += 1) {
    //         const cssContent = await getFileViaUrl(urls[i]);
    //         const matchs = cssContent.matchAll(/.(.*?)\{background:-(.*?)px -(.*?)px;}/mg);
    //         const matchNames = [...matchs];
    //         matchNames.forEach(name => {
    //             if (!name[0].includes('[')) {
    //                 cssNameMap[name[1]] = [+Number(name[2]).toFixed(0), +Number(name[3]).toFixed(0)]
    //             }
    //         });
    //         const svgUrl = getSvgUrl(cssContent);
    //         svgUrls = [...svgUrl, ...svgUrls];//通常有3个SVG文件，最后一个是字体加密的SVG文件
    //     }
    //     console.log(cssNameMap);
    //     for (let i = 0; i < svgUrls.length; i += 1) {
    //         const svgContent = await getFileViaUrl(svgUrls[i][2]);
    //         console.log(svgContent);
    //         let fontHeightOffset = 0;
    //         let fontWeightOffset = 0;
    //         if (svgContent.includes('#333')) {
    //             fontHeightOffset = 23;
    //             fontWeightOffset = 0;
    //         }
    //         if (svgContent.includes('#666')) {
    //             fontHeightOffset = 15;
    //             fontWeightOffset = 0;
    //         }
    //         //第一种字体加密模式，SVG格式为<text x="" y="">汉字列表</text>
    //         const fontLocMap = [...svgContent.matchAll(/<text x=\".*?\" y=\"(.*?)\">(.*?)<\/text>/mg)];
    //         const fontLoc = {};
    //         fontLocMap.forEach((fl, idx) => {
    //             fontLoc[fl[1]] = idx + 1;
    //         });
    //         if (fontLoc.length == 0) {// 更换另一种文件格式解析，SVG格式为<path>和<textpath>组合起来进行字体映射           
    //             const re_font_loc = [...svgContent.matchAll(/<path id="(.*?)" d="M0 (.*?) H600">/mg)];
    //             const fontLoc = {};
    //             const fontLocMap = [];
    //             for (let j = 0; j < re_font_loc.length; j += 1) {
    //                 fontLoc[int(re_font_loc[j][1])] = j + 1;
    //             }
    //             console.log(fontLoc);
    //             font_list = [...svgContent.matchAll(/\>\(.*?)\<\/textPath>/mg)];//特殊字符前后需要加上\表示转义，例如\>\
    //             console.log(font_list);
    //             for (let k = 0; k < re_font_loc.length; k += 1) {
    //                 fontLocMap[k] = [re_font_loc[k][0], re_font_loc[k][1], font_list[k]];
    //             }
    //         }
    //         svgMap[svgUrls[i][1]] = {};
    //         svgMap[svgUrls[i][1]]['fontLocMap'] = fontLocMap;
    //         svgMap[svgUrls[i][1]]['fontHeightOffset'] = fontHeightOffset;
    //         svgMap[svgUrls[i][1]]['fontWeightOffset'] = fontWeightOffset;
    //         svgMap[svgUrls[i][1]]['fontLoc'] = fontLoc;
    //     }

    //     Object.keys(cssNameMap).forEach((key, idx) => {
    //         const arr = cssNameMap[key];
    //         const keys = Object.keys(svgMap);
    //         const foo = keys.find(k => key.includes(k));
    //         const fontMap = svgMap[foo];
    //         if (!fontMap) return;
    //         const locX = arr[0];
    //         const locY = arr[1];
    //         const fontHeightOffset = fontMap.fontHeightOffset;
    //         const fontWeightOffset = fontMap.fontWeightOffset;
    //         const fontLoc = fontMap.fontLoc;
    //         const fontLocMap = fontMap.fontLocMap;
    //         const locXLine = Math.floor((locX + fontWeightOffset) / 14);
    //         const locYLine = fontLoc[locY + fontHeightOffset];
    //         let val = '';
    //         // console.log('fontLocMap', fontLocMap);
    //         if (fontLocMap[locYLine - 1]) val = fontLocMap[locYLine - 1][2][locXLine];
    //         cssNameMap[key].push(val);
    //     });
    //     console.log('cssMap', cssNameMap)
    //     const comments = [...$(commentClass)];
    //     const result = [];
    //     // const result = [['time','text']];
    //     const rankDivs = [...$('.review-rank')];//提取用户评分（1到5颗星）

    //     const times = [...$('.time')];//发布时间集合
    //     var timeIndex = 0;
    //     const names = [...$('.name')];//包含点评网登录用户名，每页15个评论的话，返回16个，其中第一个是登录用户名（有匿名用户）
    //     var nameIndex = 1;//从第2个开始提取发布评论的用户名
    //     comments.forEach(cmt => {
    //         const imgs = cmt.querySelectorAll('img');
    //         imgs.forEach(img => cmt.removeChild(img));
    //         const nodes = [...cmt.childNodes];
    //         let foo = '';
    //         nodes.forEach(node => {
    //             const cls = node.className;
    //             if (cls) {
    //                 const bar = cssNameMap[cls];
    //                 if (bar) foo += bar[2];
    //             } else foo += node.textContent;
    //         });
    //         var time = times[timeIndex].textContent;
    //         var name = names[nameIndex].textContent;
    //         var namehref = "";
    //         //记录用户主页url；后续再访问用户主页，获取注册信息
    //         namehref = names[nameIndex].href;
    //         var rank = 0.0;//初始化评分制
    //         //提取用户评价星级（span的class属性值为“sml-rank-stars sml-str50 star”，str50即为5颗星，str30为3颗星）
    //         if (rankDivs[timeIndex].getElementsByTagName("span").length > 0) {//div没有span子节点的话，说明该条评论中没有星级打分数据，打分值设为0;如果有的话，提取第1个子节点的数据即可；
    //             var rankstring = parseFloat(rankDivs[timeIndex].firstElementChild.className.split(' ')[1].split('-')[1].substring(3, 5));
    //             rank = rankstring / 10.0;
    //         }
    //         console.log(time);
    //         foo = foo.replace(/,/ig, '，');
    //         result.push([time, name, foo.trim(), rank, namehref]);
    //         timeIndex++;
    //         nameIndex++;
    //     });

    //     return result;
    // }//    测试能够处理SVG加密字体文件格式为<path>和<textpath>组合出现的情况；代码不可用；

    const showResult = (pics) => {
        let foo = document.createElement('p');
        foo.id = "comments";
        foo.innerHTML = pics.map(p => '<div style="margin-top: 20px;">' + p + '</div>').join(` `);
        foo.style.position = 'fixed';
        foo.style.width = '400px';
        foo.style.height = '400px';
        foo.style.left = '10px';
        foo.style.bottom = '50px';
        foo.style.padding = '20px';
        foo.style.background = '#61ffff';
        foo.style.overflow = 'auto';
        document.body.appendChild(foo);
        //JS选中p标签中的所有文本内容
        var selection = window.getSelection();
        selection.removeAllRanges();
        var range = document.createRange();
        range.selectNodeContents(foo);
        selection.addRange(range);
        // document.execCommand('copy');
    }

    // 导出数据模块
    function data_to_csv(data, name) {
        const blob = new Blob(["\ufeff" + data], { type: 'text/csv,charset=utf-8' });
        const uri = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = uri;
        downloadLink.download = (name + ".csv") || "temp.csv";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    let next = document.createElement('button');
    // let getCommentTime = document.createElement('button');
    // let getUserCommentTime = document.createElement('button');
    let getUserTimeCommentScoreUrl = document.createElement('button');
    let getUserTimeCommentScoreUrl2 = document.createElement('button');

    // getCommentTime.innerHTML = '采集时间和评论';
    // getCommentTime.style.position = 'fixed';
    // getCommentTime.style.right = '20px';
    // getCommentTime.style.bottom = '80px';
    // getCommentTime.id = "comTime";

    // getUserCommentTime.innerHTML = '采集用户名、时间和评论';
    // getUserCommentTime.style.position = 'fixed';
    // getUserCommentTime.style.right = '20px';
    // getUserCommentTime.style.bottom = '100px';
    // getUserCommentTime.id = "UserComTime";

    next.innerHTML = '下一页';
    next.style.position = 'fixed';
    next.style.right = '20px';
    next.style.bottom = '140px';

    getUserTimeCommentScoreUrl.innerHTML = '采集用户名、时间、评论和打分';
    getUserTimeCommentScoreUrl.style.position = 'fixed';
    getUserTimeCommentScoreUrl.style.right = '20px';
    getUserTimeCommentScoreUrl.style.bottom = '170px';
    getUserTimeCommentScoreUrl.id = "UserTimeCommentScoreUrl";

    getUserTimeCommentScoreUrl2.innerHTML = '采集用户名、时间、评论和打分(加密模式2测试)';
    getUserTimeCommentScoreUrl2.style.position = 'fixed';
    getUserTimeCommentScoreUrl2.style.right = '20px';
    getUserTimeCommentScoreUrl2.style.bottom = '200px';
    getUserTimeCommentScoreUrl2.id = "UserTimeCommentScoreUrl2";

    document.body.appendChild(next);
    // document.body.appendChild(getCommentTime);
    // document.body.appendChild(getUserCommentTime);
    document.body.appendChild(getUserTimeCommentScoreUrl);
    document.body.appendChild(getUserTimeCommentScoreUrl2);


    next.onclick = () => {
        const nextBtn = $(nextBtnClass)[0];
        if (nextBtn) nextBtn.click();
    }

    getUserTimeCommentScoreUrl.onclick = async () => {
        const moreBtns = $(moreBtnClass);
        moreBtns.forEach(b => {
            b.click();
            b.style.opacity = 0;
        });
        const lessBtns = $(lessBtnClass);
        lessBtns.forEach(l => l.style.opacity = 0);
        const res = await getResult();
        console.log('res', res);
        showResult(res);

        var parkname = document.querySelector(".shop-name").textContent;//获取公园名称
        var url = window.location.href; // 返回完整 URL (https://www.runoob.com/html/html-tutorial.html)
        url = url.substring(url.lastIndexOf('/') + 1, url.length);//获取url中最后一个单词
        if (url == "review_all") {
            url = "p1";//第一页特殊处理
        }
        //https://www.dianping.com/shop/H8sOT7dhpFprpFAZ/review_all 第一页评论的url
        //https://www.dianping.com/shop/H8sOT7dhpFprpFAZ/review_all/p101 第1页以后的评论页面的url
        var ptext = document.getElementById("comments").innerText;
        data_to_csv(ptext, parkname + url);
    }

    // getUserTimeCommentScoreUrl2.onclick = async () => {
    //     const moreBtns = $(moreBtnClass);
    //     moreBtns.forEach(b => {
    //         b.click();
    //         b.style.opacity = 0;
    //     });
    //     const lessBtns = $(lessBtnClass);
    //     lessBtns.forEach(l => l.style.opacity = 0);
    //     const res = await getResult2();
    //     console.log('res', res);
    //     showResult(res);

    //     var parkname = document.querySelector(".shop-name").textContent;//获取公园名称
    //     var url = window.location.href; // 返回完整 URL (https://www.runoob.com/html/html-tutorial.html)
    //     url = url.substring(url.lastIndexOf('/') + 1, url.length);//获取url中最后一个单词
    //     if (url == "review_all") {
    //         url = "p1";//第一页特殊处理
    //     }
    //     //https://www.dianping.com/shop/H8sOT7dhpFprpFAZ/review_all 第一页评论的url
    //     //https://www.dianping.com/shop/H8sOT7dhpFprpFAZ/review_all/p101 第1页以后的评论页面的url
    //     var ptext = document.getElementById("comments").innerText;
    //     data_to_csv(ptext, parkname + url);
    // }

})();