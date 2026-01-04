// ==UserScript==
// @name         禅道需求工时
// @namespace    http://www.akuvox.com/
// @version      1.1
// @description  take on the world!
// @author       andy.wang
// @match        http://*/pages/viewpage.action?pageId=89301667
// @icon         https://www.google.com/s2/favicons?sz=64&domain=akubela.local
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/520583/%E7%A6%85%E9%81%93%E9%9C%80%E6%B1%82%E5%B7%A5%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/520583/%E7%A6%85%E9%81%93%E9%9C%80%E6%B1%82%E5%B7%A5%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    initTable()
    // Your code here...
})();

async function initTable (){
    let table

    const post = ({id,area,time,departType})=>{
        fetch('http://192.168.10.51:51081/api/TerminalController/udpateStory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                area,
                time,
                departType
            })
        })
    }

    const t = setInterval(()=>{
        table = document.querySelectorAll('table')[1]
        const thead = table?.querySelector('thead')

        if(thead){
            const tr = thead.querySelector('tr')
            const clonedChild1 = tr.lastElementChild.cloneNode(true);
            const clonedChild2 = tr.lastElementChild.cloneNode(true);
            const clonedChild3 = tr.lastElementChild.cloneNode(true);

            clonedChild1.querySelector('div').innerHTML = '区域'
            clonedChild2.querySelector('div').innerHTML = '测试天数'
            clonedChild3.querySelector('div').innerHTML = '操作'

            tr.appendChild(clonedChild1);
            tr.appendChild(clonedChild2);
            tr.appendChild(clonedChild3);

            const tbody = table?.querySelector('tbody')
            tbody.classList.add('chosen-container-multi')

            const childNodes = Array.from(tbody.childNodes)
            childNodes.forEach((item,index)=>{

                const td1 = document.createElement("td")
                const td2 = document.createElement("td")
                const td3 = document.createElement("td")

                td1.classList.add('confluenceTd')
                td2.classList.add('confluenceTd')
                td3.classList.add('confluenceTd')

                td1.innerHTML = `<input id="area-${index}" class="chosen-choices" style="padding: 7px;">`
                td2.innerHTML = `<input id="time-${index}" class="chosen-choices" style="padding: 7px;">`
                td3.innerHTML = `<button class="aui-button aui-button-primary" style="background-color: #ed8b05;">保存</button>`

                td3.querySelector('button').addEventListener('click',async ()=>{
                    const area = document.getElementById(`area-${index}`)?.value||''
                    const time = document.getElementById(`time-${index}`)?.value||''

                    let department = item.childNodes[0].textContent ||''

                    department = department.trim().toLowerCase()

                    const departMap = {
                        '家居终端软件部':0,
                        '家居云软件部':1,
                        'app':2
                    }

                    const departType = departMap[department]

                    const id = item.childNodes[1].textContent

                    const develop = +item.childNodes[6].textContent ||0

                    if(!id)return
                    if(!area&&!time){
                        return
                    }

                    try {


                        await post({id,area,time,departType})
                        if(area){
                            item.childNodes[5].innerHTML = area
                        }
                        if(time){
                            item.childNodes[7].innerHTML = (+time).toFixed(1)
                            item.childNodes[8].innerHTML =(+time + develop).toFixed(1)
                        }

                        showToast('编辑成功!','success')
                    } catch (e) {
                    }


                })

                item.appendChild(td1);
                item.appendChild(td2);
                item.appendChild(td3);
            })


            clearInterval(t)
            clearTimeout(tOut)
        }
    },100)

    const t2 = setInterval(()=>{
        let repeat = document.querySelectorAll('.p2_segmentMainLabel-outer')
        repeat = Array.from(repeat)
        if(repeat.length){
            const color = [
                "#FF0000",
                "#00FF00",
                "#00FFFF",
                "#FFA500",
                "#EE82EE",
                "#FF69B4",
                "#9400D3",
                "#00CED1",
                "#FFD700",
            ]

            const text = repeat.map(item=>item.textContent)
            const repeatText = getCountriesWithMinOccurrences(text)

            repeat.forEach(item=>{
                const textValue = item.textContent
                const index = repeatText.findIndex(_=>textValue.includes(_))
                if(~index){
                    let i=1
                    const t3 = setInterval(()=>{
                        item.style.fontWeight = 'bold'
                        item.style.fill = color[index]
                        if(i>=8){
                            clearInterval(t3)
                        }
                        i++
                    },1000)

                    }
            })

            clearInterval(t2)
        }

    })

    const tOut = setTimeout(()=>{
        clearInterval(t)
    },8000)
    }

function getCountriesWithMinOccurrences(data, minOccurrences = 2) {
    const extractCountries = (str) => {
        return str.split(/[^a-zA-Z\u4e00-\u9fa5]+/).filter(Boolean);
    };

    const countCountries = (arr) => {
        const countryCounts = {};
        arr.forEach(item => {
            const countries = extractCountries(item);
            countries.forEach(country => {
                countryCounts[country] = (countryCounts[country] || 0) + 1;
            });
        });
        return countryCounts;
    };

    const filterCountries = (counts) => {
        return Object.entries(counts)
            .filter(([country, count]) => count >= minOccurrences && !country.includes("重点"))
            .map(([country]) => country);
    };

    const countryCounts = countCountries(data);
    return filterCountries(countryCounts);
}

function showToast(message, type = "info", duration = 3000) {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.style.position = "fixed";
        toastContainer.style.top = "20px";
        toastContainer.style.right = "50%";
        toastContainer.style.zIndex = "9999";
        toastContainer.style.pointerEvents = "none";
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.marginBottom = "10px";
    toast.style.padding = "10px 20px";
    toast.style.color = "#fff";
    toast.style.fontSize = "14px";
    toast.style.borderRadius = "5px";
    toast.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.5s ease";
    toast.style.pointerEvents = "auto";

    const colors = {
        info: "#3498db",
        success: "#2ecc71",
        warning: "#f1c40f",
        error: "#e74c3c"
    };
    toast.style.backgroundColor = colors[type] || colors.info;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "1";
    }, 100);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, duration);
}

