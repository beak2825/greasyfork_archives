// ==UserScript==
// @name         斗鱼自动发送弹幕脚本V3.4 none
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  V3.4
// @author       别问问就小白
// @match        https://www.douyu.com/*
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509245/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E5%BC%B9%E5%B9%95%E8%84%9A%E6%9C%ACV34%20none.user.js
// @updateURL https://update.greasyfork.org/scripts/509245/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E5%BC%B9%E5%B9%95%E8%84%9A%E6%9C%ACV34%20none.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let inter = setInterval(() => {
        if (document.querySelector('.Title-anchorNameH2') && document.querySelector('.Title-anchorNameH2').innerText != "") {
            clearInterval(inter);
            if (document.querySelector('.Title-anchorNameH2').innerText != "") {
                console.log('load author Huanian dy:别问问就小白')
                let eleObj = {};
                let readyList = [];
                let eleStyle = {
                    controlPanel: "font-size:12px;user-select:none;position: fixed; top:0; left:0; width:400px; background:#fff; border: 1px solid #aaa; z-index:99999;padding: 15px;border-radius: 20px;box-shadow: rgba(66, 66, 66, 0.2) 0px 2px 4px;",
                    closeBtn: "font-size:12px;transform:translate(390px);text-align: center;line-height: 40px;user-select:none;position: fixed; top:0; left:0; width:40px;height:40px;background:#fff; border: 1px solid #aaa; z-index:99999;border-radius: 50px;box-shadow: rgba(66, 66, 66, 0.2) 0px 2px 4px;",
                    danmuBox: 'font-size:12px;width:400px;position: relative;display: block;margin-top:10px;',
                    danmuText: "font-size:12px;width:400px;height: 100px;resize: none;outline: none;box-sizing: border-box;margin-bottom: 15px;",
                    checkboxList: 'font-size:12px;user-select:none;width:350px;',
                    checkboxLabel: 'font-size:12px;user-select:none;padding: 3px;display: inline-flex;align-items: center;',
                    checkbox: 'font-size:12px;user-select:none;margin-right: 5px;',
                    checkboxSpan: 'font-size:12px;user-select:none;margin-right: 15px;',
                    showDanmu: 'font-size:12px;user-select:none;width:230px;height: 24px;padding: 0;box-sizing: border-box;outline: none;',
                    timeInput: 'font-size:12px;user-select:none;width: 45px;text-align: center;height: 24px;padding: 0;box-sizing: border-box;outline: none;',
                    saveName:  'font-size:12px;user-select:none;width:100px;text-align: center;height: 24px;padding: 0;box-sizing: border-box;outline: none;margin:0 7.5px',
                    intervalStart: 'font-size:12px;user-select:none;height: 24px;cursor: pointer;padding:1px 2px;border: 1px solid #aaa;',
                    saveBtn: 'font-size:12px;user-select:none;height: 24px;cursor: pointer;padding:1px 2px;border: 1px solid #aaa;transition: all 0.5s;margin-left:5px;',
                    danmuListItem: 'font-size:12px;user-select:none;display: flex;justify-content: space-between;margin-top: 5px;',
                    danmuListRandomBtn:'font-size:12px;user-select:none;height: 24px;cursor: pointer;padding:1px 2px;border: 1px solid #aaa;float:right;margin-left:5px;transition: all 0.5s;',
                    danmuListRandomTime:'font-size:12px;user-select:none;width: 45px;text-align: center;height: 24px;padding: 0;box-sizing: border-box;outline: none;float:right',
                }
                let iO = {};
                let setStyle = (q,a,v,i) => {
                    let t = i || (new Date().getTime())+parseInt(Math.random()*1e11).toString();
                    let e = typeof q == "object" ? q : document.querySelector(q);
                    if (e) { e.style[a] = v; if (iO[t]) { clearInterval(iO[t]); delete iO[t]; }
                    } else { if (!iO[t]) iO[t] = setInterval(()=>{ setStyle(q,a,v,t) },100) }
                }
                let hiddenEle = query => {
                    setStyle(query,'display','none')
                }
                let showEle = query => {
                    setStyle(query,'display',null)
                }
                let toggleEle = (q) => {
                    let e = typeof q == "object" ? q : document.querySelector(q);
                    e.style.display == 'none'? setStyle(e,'display',null): setStyle(e,'display','none');
                }
                let removeCls = (query,cls) => {
                    document.querySelector(query).classList.remove(cls);
                }
                let toggleCls = (query,cls) => {
                    if (document.querySelector(query).classList.value.includes(cls)) {
                        document.querySelector(query).classList.remove(cls)
                    } else {
                        document.querySelector(query).classList.add(cls)
                    }
                }
                let setLocalStorage = (name,value) =>{
                    localStorage.setItem('danmu_localStorage_'+name, value)
                }
                let getLocalStorage = (name) =>{
                    return localStorage.getItem('danmu_localStorage_'+name) || null;
                }

                let info = {
                    fsj: {name: '关闭粉丝节悬浮', value: 1,sx:'my_fsj', fun: v => {setStyle('#js-room-activity','display',v?'none':null)}},
                    phb: {name: '移除排行榜和公告', value: 1, sx:'my_phb',
                          fun: v => {
                              toggleEle('.layout-Player-announce');
                              toggleEle('.layout-Player-rank');
                              if (document.querySelector('.layout-Player-barrage').style.top == '0'){
                                  setStyle('.layout-Player-barrage','padding-top','256px');
                              }else {
                                  setStyle('.layout-Player-barrage','top','0')
                              }
                          }
                         },
                    showDanmuBox: {name: '显示弹幕列表', value: 0,sx:'my_dmb', fun: v => {setStyle(eleObj.danmuBox,'display',v?null:'none');}},
                }
                let checkPosition = e => {
                    // console.log(e);
                    if (eleObj.closeBtn.style.left.slice(0,-2) < -390) {
                        eleObj.controlPanel.style.left = '-390px';
                        eleObj.closeBtn.style.left = '-390px';
                    } else if (eleObj.closeBtn.style.left.slice(0,-2) >document.body.offsetWidth-440) {
                        eleObj.controlPanel.style.left = document.body.offsetWidth-440 + 'px';
                        eleObj.closeBtn.style.left = document.body.offsetWidth-440 + 'px';
                    }
                    if (eleObj.closeBtn.style.top.slice(0,-2) < 0) {
                        eleObj.controlPanel.style.top = '0px';
                        eleObj.closeBtn.style.top = '0px';
                    } else if (eleObj.closeBtn.style.top.slice(0,-2) >document.body.offsetHeight-50) {
                        eleObj.controlPanel.style.top = document.body.offsetHeight-50 + 'px';
                        eleObj.closeBtn.style.top = document.body.offsetHeight-50 + 'px';
                    }
                }
                let creatControlPanel = () => {
                    let body = document.querySelector('body');

                    eleObj.controlPanel = document.createElement("div");
                    eleObj.controlPanel.id = 'controlPanel';
                    eleObj.controlPanel.style.cssText = eleStyle.controlPanel;

                    eleObj.closeBtn = document.createElement("div");
                    eleObj.closeBtn.id = 'closeBtn';
                    eleObj.closeBtn.style.cssText = eleStyle.closeBtn;
                    window.addEventListener('resize',checkPosition);
                    setStyle(eleObj.controlPanel,'top',getLocalStorage('my_top') || '0px');
                    setStyle(eleObj.controlPanel,'left',getLocalStorage('my_left') || '0px');
                    setStyle(eleObj.closeBtn,'top',getLocalStorage('my_top') || '0px');
                    setStyle(eleObj.closeBtn,'left',getLocalStorage('my_left') || '0px');
                    var x = 0,y = 0, l = 0,t = 0,isDown = false;
                    let canChange = true;
                    let onmousemove = e => {
                        if (isDown == false) { return }
                        var nx = e.clientX;
                        var ny = e.clientY;
                        var nl = nx - (x - l);
                        var nt = ny - (y - t);
                        if (canChange && (nx-x)*(nx-x) + (ny-y)*(ny-y) > 10) {
                            canChange = false;
                        }
                        eleObj.controlPanel.style.left = nl + 'px';
                        eleObj.controlPanel.style.top = nt + 'px';
                        eleObj.closeBtn.style.left = nl + 'px';
                        eleObj.closeBtn.style.top = nt + 'px';
                        setLocalStorage('my_left',nl + 'px');
                        setLocalStorage('my_top',nt + 'px');
                    }
                    let showOrHidden = e => {
                        if (canChange) {
                            toggleEle(eleObj.controlPanel);
                            if (eleObj.controlPanel.style.display == 'none'){
                                eleObj.closeBtn.innerText = '显示';
                                setLocalStorage('my_sb',1)
                            } else {
                                eleObj.closeBtn.innerText = '隐藏'
                                setLocalStorage('my_sb',0)
                            }
                        }
                    }

                    window.addEventListener('keydown', e => {
                        if (e.keyCode == 13 && e.ctrlKey) {
                            eleObj.controlPanel.style.left = '0px';
                            eleObj.closeBtn.style.left = '0px';
                            eleObj.controlPanel.style.top = '0px';
                            eleObj.closeBtn.style.top = '0px';
                            if (eleObj.controlPanel.style.display == 'none'){
                                showOrHidden();
                            }
                        }
                    })
                    let onmouseup = e => {
                        setTimeout(() => {canChange=true},1);
                        isDown = false;
                        eleObj.controlPanel.style.cursor = 'default';
                        eleObj.closeBtn.style.cursor = 'default';
                        window.removeEventListener('mousemove',onmousemove)
                        eleObj.controlPanel.removeEventListener('mouseup',onmouseup)
                        eleObj.closeBtn.removeEventListener('mouseup',onmouseup)
                        checkPosition()
                    }
                    let onmousedown = e => {
                        if (e.target.tagName == 'DIV') {
                            x = e.clientX;
                            y = e.clientY;
                            l = eleObj.closeBtn.offsetLeft;
                            t = eleObj.closeBtn.offsetTop;
                            isDown = true;
                            eleObj.controlPanel.style.cursor = 'move';
                            window.addEventListener('mousemove',onmousemove)
                            eleObj.controlPanel.addEventListener('mouseup',onmouseup)
                            eleObj.closeBtn.style.cursor = 'move';
                            eleObj.closeBtn.addEventListener('mouseup',onmouseup)
                        }
                    }
                    eleObj.controlPanel.onmousedown = onmousedown;
                    eleObj.closeBtn.onmousedown = onmousedown;
                    eleObj.closeBtn.innerText = '隐藏'
                    if (getLocalStorage('my_sb')=='1') {
                        toggleEle(eleObj.controlPanel);
                        eleObj.closeBtn.innerText = '显示'
                    }
                    eleObj.closeBtn.onclick = showOrHidden;
                    eleObj.danmuBox = document.createElement("div");
                    eleObj.danmuBox.style.cssText = eleStyle.danmuBox;
                    let isSend = false;
                    let sendDanmu = (v = null) => {
                        if (v) {
                            readyList.push(v);
                        }
                        if (!isSend && readyList.length != 0) {
                            isSend = true;
                            let sendValue = readyList.shift();
                            let a = document.querySelector('.ChatSend-txt').value;
                            document.querySelector('.ChatSend-txt').blur()
                            document.querySelector('.ChatSend-txt').value = sendValue;
                            document.querySelector('.ChatSend-button').click();
                            setTimeout(() => {
                                document.querySelector('.ChatSend-txt').value = a;
                                document.querySelector('.ChatSend-txt').focus();
                            },1)
                            let curInterval = setInterval(() => {
                                if (!document.querySelector('.ChatSend-button.is-gray')) {
                                    isSend = false;
                                    clearInterval(curInterval);
                                    sendDanmu()
                                }
                            },100)
                        }
                    }
                    let danmuvalue = [];
                    let danmuListAdd = (value,time,index) => {
                        if (value == 'null') value = null;
                        if (time == 'null') time = null;
                        let cur = {
                            ele: document.createElement("div"),
                            showDanmu: document.createElement("input"),
                            timeInput: document.createElement("input"),
                            intervalStart: document.createElement("button"),
                            nowStart: document.createElement("button"),
                            value: value,
                            interval: null,
                            tmpSec:0,
                            time: time,
                            isStart: false
                        }
                        cur.showDanmu.style.cssText = eleStyle.showDanmu;
                        cur.showDanmu.value = value;

                        cur.timeInput.style.cssText = eleStyle.timeInput;
                        cur.timeInput.placeholder = '间隔/秒';
                        if (cur.time) {
                            cur.timeInput.value = cur.time;
                        }
                        cur.showDanmu.onchange = e => {
                            cur.value = cur.showDanmu.value;
                            danmuvalue[index].value = cur.value;
                        };
                        cur.timeInput.onchange = e => {
                            if (isNaN(parseInt(cur.timeInput.value))) {
                                cur.timeInput.value = null;
                            } else {
                                if (parseInt(cur.timeInput.value) > 3600) {
                                    cur.timeInput.value = 3600;
                                } else if (parseInt(cur.timeInput.value)<3){
                                    cur.timeInput.value = 3;
                                }
                            }
                            cur.time = cur.timeInput.value;
                            danmuvalue[index].time = cur.time;
                        };

                        cur.intervalStart.style.cssText = eleStyle.intervalStart;
                        cur.intervalStart.innerText = '定时发送';
                        cur.intervalStart.onclick = e => {
                            if (cur.isStart) {
                                clearInterval(cur.interval);
                                cur.timeInput.value = cur.time;
                                cur.intervalStart.innerText = '定时发送';
                                cur.timeInput.disabled=false;
                                cur.showDanmu.disabled=false;
                            } else {
                                cur.tmpSec = cur.time || 60;
                                cur.interval = setInterval(()=> {
                                    if (cur.tmpSec-- == 0) {
                                        sendDanmu(cur.showDanmu.value);
                                        cur.tmpSec=cur.time;
                                    }
                                    cur.timeInput.value = cur.tmpSec;
                                },1000);
                                cur.intervalStart.innerText = '暂停发送';
                                cur.timeInput.disabled=true;
                                cur.showDanmu.disabled=true;
                            }
                            cur.isStart = !cur.isStart;
                        }
                        cur.nowStart.style.cssText = eleStyle.intervalStart;
                        cur.nowStart.innerText = '立即发送';
                        cur.nowStart.onclick = e => {
                            sendDanmu(cur.showDanmu.value);
                        }

                        cur.ele.style.cssText=eleStyle.danmuListItem;

                        cur.ele.appendChild(cur.showDanmu);
                        cur.ele.appendChild(cur.nowStart);
                        cur.ele.appendChild(cur.timeInput);
                        cur.ele.appendChild(cur.intervalStart);
                        eleObj.danmuBox.appendChild(cur.ele);
                        eleObj.danmuList[index] = cur;
                    }

                    eleObj.danmuListAddBtn = document.createElement("button");
                    eleObj.danmuListAddBtn.innerText = '增加弹幕';
                    eleObj.danmuListAddBtn.style.cssText = eleStyle.intervalStart;
                    eleObj.danmuListAddBtn.onclick = e => {
                        if (danmuvalue.length==0||(danmuvalue.length>0&&danmuvalue[danmuvalue.length-1].value)) {
                            danmuvalue.push({value: null, time: 60});
                            let index = danmuvalue.length -1;
                            danmuListAdd(null,60,index)
                        }
                    }
                    eleObj.danmuListSaveBtn = document.createElement("button");
                    eleObj.danmuListSaveBtn.innerText = '保存弹幕';
                    eleObj.danmuListSaveBtn.style.cssText = eleStyle.saveBtn;
                    eleObj.danmuListSaveBtn.onclick = e => {
                        setLocalStorage('danmuvalue',JSON.stringify(danmuvalue));
                        eleObj.danmuListSaveBtn.style.background = 'rgb(122,253,126)';
                        setTimeout(() => {
                            eleObj.danmuListSaveBtn.style.background = 'rgb(255,255,255)';
                        }, 1000)
                    }
                    eleObj.danmuListRandomTime = document.createElement("input");
                    let danmuListRandomTime = getLocalStorage('my_dlrt');
                    let danmuListRandomIsStart = false;
                    let danmuListRandomInterval = null;
                    let danmuListRandomTmpSec = null;
                    let danmuListOrderIsStart = false;
                    eleObj.danmuListRandomTime.style.cssText = eleStyle.danmuListRandomTime;
                    eleObj.danmuListRandomTime.placeholder = '间隔/秒';

                    if (danmuListRandomTime) {
                        eleObj.danmuListRandomTime.value = danmuListRandomTime;
                    }
                    eleObj.danmuListRandomTime.onchange = e => {
                        if (isNaN(parseInt(eleObj.danmuListRandomTime.value))) {
                            eleObj.danmuListRandomTime.value = null;
                        } else {
                            if (parseInt(eleObj.danmuListRandomTime.value) > 3600) {
                                eleObj.danmuListRandomTime.value = 3600;
                            } else if (parseInt(eleObj.danmuListRandomTime.value)<3){
                                eleObj.danmuListRandomTime.value = 3;
                            }
                        }
                        danmuListRandomTime = eleObj.danmuListRandomTime.value;
                        setLocalStorage('my_dlrt',eleObj.danmuListRandomTime.value)
                    };
                    eleObj.danmuListRandomBtn = document.createElement("button");
                    eleObj.danmuListRandomBtn.innerText = '列表随机发送';
                    eleObj.danmuListRandomBtn.style.cssText = eleStyle.danmuListRandomBtn;
                    eleObj.danmuListRandomBtn.onclick = e => {
                        if (danmuListRandomIsStart) {
                            clearInterval(danmuListRandomInterval);
                            eleObj.danmuListRandomTime.value = danmuListRandomTime;
                            eleObj.danmuListRandomBtn.innerText = '列表随机发送';
                            eleObj.danmuListRandomTime.disabled=false;
                            eleObj.danmuListOrderBtn.disabled=false;
                            eleObj.danmuListRandomBtn.style.background = 'rgb(255,255,255)';
                        } else {
                            eleObj.danmuListOrderBtn.disabled=true;
                            danmuListRandomTmpSec = danmuListRandomTime || 60;
                            danmuListRandomInterval = setInterval(()=> {
                                if (danmuListRandomTmpSec-- == 0) {
                                    let i = parseInt(Math.random()*danmuvalue.length);
                                    let lasti = getLocalStorage('lastsendIdx') || -1;
                                    if (lasti == i) {
                                        i++
                                    }
                                    if (i>=danmuvalue.length) {
                                        i = 0;
                                    }
                                    setLocalStorage('lastsendIdx', i)
                                    sendDanmu(danmuvalue[i].value);
                                    danmuListRandomTmpSec=danmuListRandomTime;
                                }
                                eleObj.danmuListRandomTime.value = danmuListRandomTmpSec;
                            },1000);
                            eleObj.danmuListRandomBtn.innerText = '暂停随机发送';
                            eleObj.danmuListRandomTime.disabled=true;
                            eleObj.danmuListRandomBtn.style.background = 'rgb(122,253,126)';
                        }
                        danmuListRandomIsStart = !danmuListRandomIsStart;
                    }

                    eleObj.danmuListOrderBtn = document.createElement("button");
                    eleObj.danmuListOrderBtn.innerText = '列表顺序发送';
                    eleObj.danmuListOrderBtn.style.cssText = eleStyle.danmuListRandomBtn;
                    eleObj.danmuListOrderBtn.onclick = e => {
                        if (danmuListOrderIsStart) {
                            clearInterval(danmuListRandomInterval);
                            eleObj.danmuListRandomTime.value = danmuListRandomTime;
                            eleObj.danmuListOrderBtn.innerText = '列表顺序发送';
                            eleObj.danmuListRandomTime.disabled=false;
                            eleObj.danmuListRandomBtn.disabled=false;
                            eleObj.danmuListOrderBtn.style.background = 'rgb(255,255,255)';
                        } else {
                            eleObj.danmuListRandomBtn.disabled=true;
                            danmuListRandomTmpSec = danmuListRandomTime || 60;
                            danmuListRandomInterval = setInterval(()=> {
                                if (danmuListRandomTmpSec-- == 0) {
                                    let i = getLocalStorage('lastsendIdx') || -1;
                                    i++
                                    if (i>=danmuvalue.length) {
                                        i = 0;
                                    }
                                    setLocalStorage('lastsendIdx', i)
                                    sendDanmu(danmuvalue[i].value);
                                    danmuListRandomTmpSec=danmuListRandomTime;
                                }
                                eleObj.danmuListRandomTime.value = danmuListRandomTmpSec;
                            },1000);
                            eleObj.danmuListOrderBtn.innerText = '暂停顺序发送';
                            eleObj.danmuListRandomTime.disabled=true;
                            eleObj.danmuListOrderBtn.style.background = 'rgb(122,253,126)';;
                        }
                        danmuListOrderIsStart = !danmuListOrderIsStart;
                    }

                    let danmulistChange = list => {
                        list.forEach((item,index)=>{
                            danmuListAdd(item.value.trim(),item.time,index)
                        })
                    }
                    eleObj.danmuList = [];


                    eleObj.checkboxList = document.createElement("div");
                    eleObj.checkboxList.style.cssText = eleStyle.checkboxList;

                    Object.keys(info).forEach(item => {
                        if (!info[item].hidden) {
                            eleObj[item+'label'] = document.createElement("label");
                            eleObj[item+'label'].style.cssText = eleStyle.checkboxLabel;
                            eleObj[item] = document.createElement("input");
                            let tmp = getLocalStorage(info[item].sx);
                            let checked = Boolean(info[item].value);
                            if (tmp != null) {
                                checked = Number(tmp)
                                info[item].value = Number(tmp)
                            }
                            eleObj[item].type = 'checkbox';
                            eleObj[item].value = checked;
                            eleObj[item].checked = checked;
                            eleObj[item].style.cssText = eleStyle.checkbox;
                            eleObj[item].onchange = e => {
                                e.preventDefault();e.stopPropagation();
                                info[item].value = eleObj[item].checked;
                                setLocalStorage(info[item].sx,eleObj[item].checked*1);
                                if (typeof info[item].fun =='function') {
                                    info[item].fun(info[item].value);
                                }
                            };
                            eleObj[item + 'span'] = document.createElement("span");
                            eleObj[item + 'span'].innerText = info[item].name;
                            eleObj[item + 'span'].style.cssText = eleStyle.checkboxSpan;

                            eleObj[item+'label'].appendChild(eleObj[item]);
                            eleObj[item+'label'].appendChild(eleObj[item + 'span']);
                            eleObj.checkboxList.appendChild(eleObj[item+'label']);
                        }
                    })

                    body.appendChild(eleObj.controlPanel);
                    body.appendChild(eleObj.closeBtn);
                    eleObj.controlPanel.appendChild(eleObj.checkboxList);

                    eleObj.controlPanel.appendChild(eleObj.danmuBox);
                    eleObj.danmuBox.appendChild(eleObj.danmuListAddBtn);
                    eleObj.danmuBox.appendChild(eleObj.danmuListSaveBtn);
                    eleObj.danmuBox.appendChild(eleObj.danmuListRandomBtn);
                    eleObj.danmuBox.appendChild(eleObj.danmuListOrderBtn);
                    eleObj.danmuBox.appendChild(eleObj.danmuListRandomTime);
                    danmulistChange(danmuvalue);
                    let list = JSON.parse(getLocalStorage('danmuvalue') || "[]");
                    list.forEach((item,index)=>{
                        danmuListAdd(item.value,item.time,index)
                        danmuvalue.push({value: item.value, time: item.time})
                    })
                    checkPosition();
                    let start = () => {
                        info.fsj.value        && hiddenEle('#js-room-activity');
                        setTimeout(() => {
                            info.phb.value        && hiddenEle('.layout-Player-announce');
                            info.phb.value        && hiddenEle('.layout-Player-rank');
                            info.phb.value        && setStyle('.layout-Player-barrage','top','0');

                            if (!getLocalStorage('firstShow')) {
                                alert('如果遇到按钮或面板拖动到角落或者无法找到插件按钮的时候，请点击页面任意空白位置，按下Ctrl+回车即可恢复面板位置。')
                                setLocalStorage('firstShow', 1)
                            }
                        },3000);


                    };
                    setTimeout(start, 200);
                }
                setTimeout(creatControlPanel, 1000);
            }
        }
    }, 100)
})();