// ==UserScript==
// @name         石之家logs成分查询
// @name:en      stonesLogsViewer
// @namespace    Umi
// @version      1.0
// @description  一个通过石之家查询fflogs的小插件
// @description:en stonesLogsViewer--
// @author       Umi
// @match        *://ff14risingstones.web.sdo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482674/%E7%9F%B3%E4%B9%8B%E5%AE%B6logs%E6%88%90%E5%88%86%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/482674/%E7%9F%B3%E4%B9%8B%E5%AE%B6logs%E6%88%90%E5%88%86%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==
 
const delay = 500;
//api token 可以使用自己的token
const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YWUxMzk2ZC0xNmVmLTQ4NjEtOGIwZC05ZTc4NDRkM2JjMWMiLCJqdGkiOiJmZmVkMmI4ZTllNjUwNWI0ZTk4ZGNmN2Y0ZGZkZTlmZjg0MjE3YWIxMjE1ZDk1ZjhkNDBmYjIyMjlkNjE0MTQwODYwNjU1YTdmMzlmYjExMiIsImlhdCI6MTcwMjkyMTY1OS43MTIzNjIsIm5iZiI6MTcwMjkyMTY1OS43MTIzNjUsImV4cCI6MTczNDAyNTY1OS43MDMxOTcsInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXVzZXItcHJvZmlsZSIsInZpZXctcHJpdmF0ZS1yZXBvcnRzIl19.TQvn0mwLoEEppHcxuPnXINVLRjrLM0givJ-sltQfHEUFXVJj_r_QLS57ieDAlsjkzOH9ZMlrdBcK0fbMnDa93Jru95-CwNgjl261nYuBYmemAIkNWgVAwsOjXvNm4feoelRHtz8bpbZmCQ1S8FM8d0gwolueZp5t6Kku2Cpb2qaWv_cERh-uO44smPgiER4Z9j33JlfWvkC8brljVALcKjnu7i27R-qD6hBQhicZN7DJVnJkdZGceu9Kaoq0fJO0wr0E8s8BnWQTLJwW3uGSzXrQGUWATxrwALAqIa_2kjKnaC0sXGUnUGQZdckpW6VGHPnfCGslNarviK72n9kfIOlpJVhL-7T360-CgpEVpnFVxfQCTz0ZnRhqxwy9ixZ7OyAY8ZpQTerkGDb2HlZTTCBB-gOdrUmQvDDEfKnGPfuuHSL4TrY6Ndo-Ips8NAUy67nqGaqAUBmUi9MqA-ZL8oqtW3J_Q0HfbTVPk8RvpCelij9zQpC_LSc0kz46vnr47teiEd_4eY8zW6ataCRP4B7epp0aEp6e-UkJjZ05DBgzYwB-aromyrBB6cJPHOX61ywWoEJIYMb8RL6HdGE8vSxhYTrXZfcUBcmkvVZHFHkvmR4MIJ5zjpESr0gq8_gp1ol_FapBmt39Mpuk0GDRUsTCNJAtp6FRcAY8ul4PUJs";
const url = "https://cn.fflogs.com/api/v2/client";
const zones = [ 
    {
        "id": 54,
        "name": "万魔殿 荒天之狱",
        "difficulty": 101
    },
    {
        "id": 49,
        "name": "万魔殿 炼净之狱",
        "difficulty": 101
    },
    {
        "id": 44,
        "name": "万魔殿 边境之狱",
        "difficulty": 101
    },
    {
        "id": 53,
        "name": "欧米茄绝境验证战",
        "difficulty": 100
    },
    {
        "id": 45,
        "name": "幻想龙诗绝境战",
        "difficulty": 100
    },
    {
        "id": 43,
        "name": "绝境战（旧版本）",
        "difficulty": 100
    }
];
const defaultZone = 54;
 
(function() {

    function ProcessLocationIcon(startingIcon,key)
    {
        let parentElement = startingIcon.parentElement.parentElement.parentElement;
 
        let usernameElement = FindUsernameElement(parentElement);
        //console.log(`获取的用户名: ${usernameElement ? usernameElement.innerText : '未找到'}`);
        let server = FindServer(startingIcon);
        //console.log(`获取的服务器: ${server}`);
 
        if (usernameElement && server) {
            InsertLogsIcon(usernameElement, server, key)
        }
    }
 
    function FindUsernameElement(parentElement)
    {
        // 非个人页：第一个能被鼠标点击、仅包含文本的 span 元素
        let elements = parentElement.querySelectorAll('span.cursor');
        //console.log("找到的元素数量（非个人页）: ", elements.length);
        for (let element of elements)
        {
            if (element.childNodes.length == 1 && element.innerText.length >= 1 && element.innerText.length <= 6)
            {
                return element;
            }
        }
 
        // 个人页
        elements = parentElement.querySelectorAll('span.ft24.ftw');
        for (let element of elements)
        {
            if (element.childNodes.length == 1 && element.innerText.length >= 1 && element.innerText.length <= 6)
            {
                return element;
            }
        }
 
        return null;
    }
 
    /*
     * 结构 1：
     *     <i>
     *     <span>
     *         <span>区</span>
     *         <span>服</span>
     *     </span>
     * 结构 2：
     *     <i>
     *     <span>区 服</span>
     * 结构 3：
     *    <i>
     *    <span>区</span>
     *    <span>服</span>
     */
    function FindServer(startingIcon)
    {
        let element = startingIcon.nextElementSibling;
        if (element && element.querySelector('span'))
        {
            element = element.querySelector('span:first-child');
        }
        let text = element.textContent.trim();
        if (text.includes(' '))
        {
            return text.split(' ')[1];
        }
        else
        {
            return element.nextElementSibling ? element.nextElementSibling.textContent : '';
        }
    }

    async function getData(name,server,zoneId){

        var difficulty = zones.find((zone) => {
            return zone.id == zoneId
        }).difficulty

        var graphqlQuery = `
            {
                characterData {
                    character(name: "${name}", serverRegion: "cn", serverSlug: "${server}") {
                        zoneRankings(zoneID: ${zoneId}, difficulty: ${difficulty})
                    }
                }
            }
        `

        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json charset=UTF-8',
                    'Authorization': 'Bearer '+ apiToken
                },
                body: JSON.stringify({ query: graphqlQuery }),
            })
            return await response.json();
          } catch (error) {
            console.log('Request Failed', error);
          }
    }

    function getRankColor(rank){
        if(rank == '-') return "#666"
        if (rank === 100) return "#e5cc80"; 
        if (rank >= 99) return "#e268a8"; 
        if (rank >= 95) return "#ff8000";
        if (rank >= 75) return "#a335ee"; 
        if (rank >= 50) return "#0070ff";
        if (rank >= 25) return "#1eff00";
        else return "#666";
    }

    function getBossUrl(bossId){
        return `https://assets.rpglogs.cn/img/ff/bosses/${bossId}-icon.jpg?v=2`
    }

    function getJobIconUrl(jobName){
        return `https://assets.rpglogs.cn/img/ff/icons/${jobName}.png`
    }

    function buildBossLogs(boosId,rank,jobName){
        var bossDiv = document.createElement('td');
        var bossNode = document.createElement('img');
        var rankNode = document.createElement('a');
        bossNode.setAttribute('src',getBossUrl(boosId));
        bossNode.style.width = '24px';
        bossNode.style.height = '24px';
        rankNode.innerText = rank?Math.round(rank):'-';;
        rankNode.style.color = getRankColor(rankNode.innerHTML);
        rankNode.style.textAlign = 'center'
        rankNode.style.marginLeft = '10px'
        bossDiv.style.display = 'flex'
        bossDiv.style.justifyContent = 'center'
        bossDiv.style.alignItems = 'center'
        bossDiv.style.textAlign = 'center'
        bossDiv.style.border = '2px solid #333'

        bossDiv.append(bossNode);
        bossDiv.append(rankNode);

        if(jobName){
            var jobNode = document.createElement('img');
            jobNode.setAttribute('src',getJobIconUrl(jobName));
            jobNode.style.width = '24px';
            jobNode.style.height = '24px';
            jobNode.style.marginLeft = '4px';
            jobNode.style.marginRight = '5px';
            jobNode.style.border = '1px solid #555555';
            bossDiv.append(jobNode);
        }

        return bossDiv
    }

    async function updateData(usernameElement,charaKey,server,zoneId){
        var data = await getData(usernameElement.innerText,server,zoneId)
        console.log(data)
        var rankings = data?.data?.characterData?.character?.zoneRankings.rankings
        var logsNode = document.getElementById('chara'+charaKey)
        logsNode.style.display = 'flex'
        console.log(rankings)
        logsNode.innerHTML = ''
        rankings?.forEach((ranking) => {
            var node = buildBossLogs(ranking.encounter.id,ranking.rankPercent,ranking.spec)
            logsNode.append(node);
        })
    }
 
    function InsertLogsIcon(usernameElement, server,key)
    {
        var viewerDiv = document.createElement('div')
        var selectNode = document.createElement('select')
        selectNode.setAttribute('id','chara-select'+key)
        selectNode.style.backgroundColor = '#000'
        selectNode.style.color = 'white'
        selectNode.style.border =  'none'
        selectNode.style.outline = 'none'
        selectNode.addEventListener('change', () => {
            console.log(selectNode.options[selectNode.selectedOptions])
            updateData(usernameElement,key,server,selectNode.options[selectNode.selectedIndex].value)
        })
        zones.forEach((zone) => {
            var zoneOption = document.createElement('option')
            zoneOption.text = zone.name
            zoneOption.value = zone.id
            selectNode.add(zoneOption)
            if(zone.id === defaultZone){
                selectNode.selectedIndex = defaultZone
            }
        })
        var logsNode = document.createElement('tr')
        logsNode.setAttribute('id','chara'+key)
        logsNode.style.borderCollapse = 'collapse'
        logsNode.style.borderTop = '2px solid #333'
        logsNode.style.borderBottom = '2px solid #333'
        logsNode.style.backgroundColor = '#000'
        updateData(usernameElement,key,server,defaultZone)
        viewerDiv.style.display = 'flex'
        viewerDiv.append(selectNode)
        viewerDiv.append(logsNode)

        var newNode = document.createElement('a');
        var username = usernameElement.innerText;
        newNode.id = 'ff-icon';
        newNode.href = `https://cn.fflogs.com/character/CN/${server}/${username}`;
        newNode.innerHTML = `<img src="https://assets.rpglogs.cn/img/ff/favicon.png" height="30px" width="30px">`;
        newNode.style.backgroundColor = '#000'
        newNode.border = '2px solid #333'
        
        viewerDiv.append(newNode);

        console.log(usernameElement.parentElement.parentElement.parentElement.children.length)
        if(usernameElement.parentElement.parentElement.parentElement.children.length == 2){
            usernameElement.parentElement.parentElement.insertAdjacentElement('afterend', viewerDiv);
        }
        else{
            usernameElement.parentElement.insertAdjacentElement('afterend', viewerDiv);
        }

       
        console.log(`FFLogs 图标已添加到：${username}@${server}`);
    }
 
    setInterval(function() {
        var elements = document.querySelectorAll('.icon-location.dwcolor'); // 搜索服务器前的图标作为定位特征
 
        elements.forEach(function(iconElement,key) {
            if (!iconElement.hasAttribute('data-logs-processed'))
            {
                ProcessLocationIcon(iconElement,key);
                iconElement.setAttribute('data-logs-processed', 'true'); // 标记已处理
            }
        });
    }, delay);
})();