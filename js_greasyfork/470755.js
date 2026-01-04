// ==UserScript==
// @name         Google Music Visualization
// @name:zh-TW   Google 音樂視覺化
// @name:zh-CN   Google 音乐视觉化
// @namespace    https://github.com/maplelan/Maplelan_Tampermonkey_Script/blob/main/Google%20%E8%A6%96%E8%A6%BA%E5%8C%96.user.js
// @version      1.0
// @description  Let Google's currency historical chart in the webpage to play music and display visualizations, unuseful tool.
// @description:zh-TW  讓Google頁面中的幣值歷史走線圖可以撥放音樂並顯示視覺化 沒有任何實際有用的功能
// @description:zh-CN  让Google页面中的币值历史走线图可以拨放音乐并显示视觉化 没有任何实际有用的功能
// @author       Maplelan
// @license      MIT
// @match        https://www.google.com/search?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470755/Google%20Music%20Visualization.user.js
// @updateURL https://update.greasyfork.org/scripts/470755/Google%20Music%20Visualization.meta.js
// ==/UserScript==

(function() {
    setTimeout(()=>{
        let svg = document.getElementsByClassName("uch-psvg");
        console.log(svg);
        for(let i=0;i<svg.length;i++){
            let svg_item = svg[i];
            let path = svg_item.getElementsByTagName("path");
            if(path.length >= 2){
                let main_path = path[1];
                let vb = svg_item.getAttribute("viewBox").split(" ");
                let vb_w = parseFloat(vb[2]),vb_h = parseFloat(vb[3]);
                let d = main_path.getAttribute("d");
                let L = d.split("L");
                let header = {},content = [],end = [];
                for(let j=0;j<L.length;j++){
                    if(L[j].startsWith("M")){
                        let M = L[j].trim().split(" ");
                        header.x = parseFloat(M[1]);
                        header.y = parseFloat(M[2]);
                    }else{
                        let C = L[j].trim().split(" ");
                        let item = {};
                        item.x = parseFloat(C[0]);
                        item.y = parseFloat(C[1]);
                        if(item.x <= vb_w && item.x >= 0){
                            content.push(item);
                        }else{
                            end.push(item);
                        }
                    }
                }
                console.log(d);
                let top = svg_item.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                let btpos = top.firstChild.firstChild;
                let numb_place = top.parentNode.firstChild.firstChild.lastChild.firstChild;
                const or_num = parseFloat(numb_place.innerText);

                console.log(or_num);
                console.log(btpos);
                const file = document.createElement('input');
                file.type = "file";
                file.accept="audio/*";
                btpos.append(file);

                const audio = document.createElement('audio');
                audio.controls = true;;
                btpos.append(audio);

                const select = document.createElement('select');
                select.innerHTML = `<option value="FloatFrequency">FloatFrequency</option>
                             <option value="FloatTimeDomain">FloatTimeDomain</option>
                             <option value="ByteFrequency">ByteFrequency</option>
                             <option value="ByteTimeDomain">ByteTimeDomain</option>`;
                btpos.append(select);

                let aniID = null;
                file.onchange = function() {
                    console.log("file");
                    if(aniID != null){
                        cancelAnimationFrame(aniID);
                    }
                    let files = this.files;
                    audio.src = URL.createObjectURL(files[0]);
                    audio.load();
                    audio.play();

                    let vis_type = "FloatFrequency";
                    let context = new AudioContext();
                    let src = context.createMediaElementSource(audio);
                    let analyser = context.createAnalyser();

                    src.connect(analyser);
                    analyser.connect(context.destination);

                    console.log(select.value);
                    vis_type = select.value;
                    switch(vis_type){
                        case "FloatFrequency":{
                            analyser.fftSize = 2048;

                            break;
                        }
                        case "ByteFrequency":{
                            analyser.fftSize = 128;

                            break;
                        }
                        case "FloatTimeDomain":
                        case "ByteTimeDomain":{
                            analyser.fftSize = 8192;

                            break;
                        }
                    }

                    let bufferLength = analyser.frequencyBinCount;
                    console.log(bufferLength);

                    let dataArray = new Uint8Array(bufferLength);
                    switch(vis_type){
                        case "FloatFrequency":
                        case "FloatTimeDomain":{
                            dataArray = new Float32Array(bufferLength);
                            break;
                        }
                        case "ByteFrequency":
                        case "ByteTimeDomain":{
                            dataArray = new Uint8Array(bufferLength);
                            break;
                        }
                    }

                    function renderFrame() {
                        requestAnimationFrame(renderFrame);

                        let start = 0,to_end = bufferLength;

                        switch(vis_type){
                            case "FloatFrequency":{
                                analyser.getFloatFrequencyData(dataArray);
                                break;
                            }
                            case "FloatTimeDomain":{
                                analyser.getFloatTimeDomainData(dataArray);

                                start = 512;
                                to_end = bufferLength-start;

                                break;
                            }
                            case "ByteFrequency":{
                                analyser.getByteFrequencyData(dataArray);
                                break;
                            }
                            case "ByteTimeDomain":{
                                analyser.getByteTimeDomainData(dataArray);

                                start = 1024;
                                to_end = bufferLength-start;

                                break;
                            }
                        }
                        //console.log(dataArray);


                        let evn = 0,a_max,a_min;
                        let H,C=[];
                        for (let i = start; i < to_end; i++) {
                            let barHeight = dataArray[i];
                            let item = {};
                            item.x = map_range(i,start,to_end-1,0,vb_w);

                            //console.log(i + " " + item.x);

                            switch(vis_type){
                                case "FloatFrequency":{
                                    item.y = vb_h - map_range(barHeight,-170,-10,0,vb_h);
                                    break;
                                }
                                case "FloatTimeDomain":{
                                    const v = dataArray[i] * 50;
                                    item.y = (vb_h / 2) + v;

                                    break;
                                }
                                case "ByteFrequency":{
                                    item.y = vb_h - map_range(barHeight,0,255,0,vb_h);
                                    break;
                                }
                                case "ByteTimeDomain":{
                                    const v = dataArray[i] / 128.0;
                                    item.y = vb_h - (v * (vb_h / 2));

                                    break;
                                }
                            }

                            evn += barHeight;
                            if(i==start){
                                H = item;
                                a_max = dataArray[i];
                                a_min = dataArray[i];
                            }else{
                                C.push(item);
                                if(dataArray[i] > a_max){
                                    a_max = dataArray[i];
                                }
                                if(dataArray[i] < a_min){
                                    a_min = dataArray[i];
                                }
                            }
                        }

                        switch(vis_type){
                            case "ByteFrequency":
                            case "ByteTimeDomain":{
                                evn = (evn/(to_end-start))/255;
                                a_max = a_max - 128;
                                a_min = a_min - 128;
                                break;
                            }
                            case "FloatFrequency":
                            case "FloatTimeDomain":{
                                evn = map_range(evn/(to_end-start),-150,-30,0,100);

                                a_max = a_max - ((a_max+a_min)/2);
                                a_min = a_min - ((a_max+a_min)/2);
                                break;
                            }
                        }

                        let svg_r = document.getElementsByClassName("uch-psvg");
                        for(let i_r=0;i_r<svg_r.length;i_r++){
                            let svg_item_r = svg_r[i_r];
                            let path_r = svg_item_r.getElementsByTagName("path");
                            if(path_r.length >= 2){
                                let main_path_r = path_r[1];
                                main_path_r.setAttribute("d",merg(H,C,end));
                                let top_r = svg_item_r.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                                let numb_place_r = top_r.parentNode.firstChild.firstChild.lastChild.firstChild;
                                const max = parseFloat(svg_item_r.parentNode.parentNode.firstChild.childNodes[2].lastChild.textContent);
                                const min = parseFloat(svg_item_r.parentNode.parentNode.firstChild.firstChild.lastChild.textContent);
                                //console.log(max);

                                let range = 0;

                                switch(vis_type){
                                    case "FloatFrequency":{
                                        range = (evn*(max-min));

                                        break;
                                    }
                                    case "FloatTimeDomain":{
                                        range = (((Math.abs(a_max) > Math.abs(a_min)) ? a_max : a_min)*(max-min))*8;

                                        break;
                                    }
                                    case "ByteFrequency":{
                                        range = (evn*100*(max-min))*0.7;

                                        break;
                                    }
                                    case "ByteTimeDomain":{
                                        range = (((Math.abs(a_max) > Math.abs(a_min)) ? a_max : a_min)*(max-min))*0.1;

                                        break;
                                    }
                                }

                                numb_place_r.textContent = (or_num+range).toFixed(2);
                                //console.log((or_num+range).toFixed(2));
                            }
                        }
                    }

                    audio.play();
                    aniID = window.requestAnimationFrame(renderFrame());
                };
                //console.log(header);
                //console.log(content);
                //console.log(end);
                //randC(header,content,vb_h);
                /*setTimeout(()=>{
                    console.log(merg(header,content,end));
                    main_path.setAttribute("d",merg(header,content,end));
                }, 3000);*/
            }
        }
    }, 1000);
})();

function merg(H,C,E){
    let str = "M " + xystr(H);
    C.forEach(item => {
        str += " L " + xystr(item);
    });
    E.forEach(item => {
        str += " L " + xystr(item);
    });
    return str;
}

function xystr(xy){
    return xy.x + " " + xy.y;
}

function randC(H,C,max){
    H.y = random(0,max,2);
    for(let i=0;i<C.length;i++){
        C[i].y = random(0,max,2);
    }
}

function random(min, max, dec = 0){//隨機函式 min=最小值 max=最大值 dec=小數點後的位數(預設為0)
    let usedec = Math.pow(10, dec);
    let maxc = Math.floor(max * usedec);
    let minc = min < max ? Math.floor(min * usedec) : 0;
    return (Math.floor(Math.random() * (maxc - minc + 1)) + minc) / usedec;
}

function map_range(value, low1, high1, low2, high2) {
    if(value < low1){
        return low2;
    }
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
