// ==UserScript==
// @name         Webinar People Scanner
// @namespace    http://tampermonkey.net/
// @version      0.39
// @description  prints present and absent people
// @author       ashen hermit
// @match        https://events.webinar.ru/*
// @icon         https://www.google.com/s2/favicons?domain=webinar.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433483/Webinar%20People%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/433483/Webinar%20People%20Scanner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var setupRegistry = {}
    function SetupDeamon(func){
        this.func = func
        this.working = true
        this.update = function(){
            var result = this.func()
            if(result){
                this.working = false
                this.stop()
            }
        }
        this.interval = setInterval(this.update.bind(this), 100)
        this.stop = function(){clearInterval(this.interval)}
    }
    function registerSetupDeamon(deamonId, func){
        setupRegistry[deamonId] = new SetupDeamon(func)
    }

    var tabContentClassName = "StreamPeople__tabContent___ZQ7G6"
    var streamPeopleTabClassName = "StreamPeople__tab___EWMh4"

    window.HermitUI_PeopleCounter = function(instancePath, uiContainer, groupMembers){
        this.instancePath = instancePath
        this.fetchPeopleList = async function(){
            return new Promise((resolve, reject)=>{
                var content = document.getElementsByClassName(tabContentClassName)[0]
                var peopleList = content.children[0].children[1].children[1].children[0].children[0]
                var scanInterval = 0
                var people = {}

                function scanPeople(){
                    Array.from(peopleList.children).forEach(personEl=>{
                        people[personEl.innerText] = personEl.innerText
                    })
                }

                content.scrollTo(0,0)
                scanPeople()
                scanInterval = setInterval(()=>{
                    scanPeople()
                    //stop if scrolled to bottom
                    if(content.scrollTop+content.clientHeight+1 >= content.scrollHeight){
                        clearInterval(scanInterval)
                        resolve(Object.values(people))
                    }
                    content.scrollBy(0, content.clientHeight/2)
                }, 10)
            })
        }
        this.justifyName = function(personName){
            personName = personName.toLowerCase()
            personName = personName.replaceAll("ё","е")
            personName = personName.split(" ").map(x=>x.charAt(0).toUpperCase() + x.slice(1)).join(" ")
            return personName
        }
        this.justifyGroupMembers = function(groupMembers){
            var groupMembers = Array.from(groupMembers).map(x=>Object.assign({}, x))
            groupMembers.forEach(x=>{x.name=this.justifyName(x.name)})
            return groupMembers
        }
        this.groupMembers = this.justifyGroupMembers(groupMembers)
        this.webinarNameToNorimalized = function(personName){
            personName = personName.split("\n")[0]
            var personNameParts = personName.split(" ")
            var name = personNameParts[0]
            var surname = personNameParts[personNameParts.length-1]
            var normalizedName = `${surname} ${name}`
            return normalizedName
        }
        this.getPersonByName = function(personName){
            var person = this.groupMembers.find(x=>x.name == personName)
            if(person){
                return person
            }else{
                // strange case but still
                var reversedName = personName.split(" ").reverse().join(" ")
                var person = this.groupMembers.find(x=>x.name == reversedName)
                return person
            }
        }
        this.hasPersonInGroup = function(personName){
            var person = this.getPersonByName(personName)
            return person!=undefined
        }
        this.previousList = []
        this.countPeople = async function() {
            var peopleList = await this.fetchPeopleList()
            var presentList = peopleList.map(this.webinarNameToNorimalized).map(this.justifyName).filter(x=>this.hasPersonInGroup(x)).sort().map(this.getPersonByName.bind(this))
            var absendList = this.groupMembers.filter(x=>presentList.indexOf(x)==-1).sort()
            var addedItemsList = presentList.filter(x=>this.previousList.indexOf(x)==-1).sort()
            var removedItemsList = this.previousList.filter(x=>presentList.indexOf(x)==-1).sort()
            console.log(presentList, absendList, addedItemsList, removedItemsList)
            this.previousList = Array.from(presentList)
            this.renderUI(presentList, absendList, addedItemsList, removedItemsList)
        }
        this.uiContainer = uiContainer
        this.emptyOrText = function(text){
            if(text.trim().length==0) return '<div style="opacity: 0.5;">-пусто-</div>'
            else return text
        }
        this.generateVkIdsList = function(people){
            if(!people) return ""
            if(people.length==0) return ""
            return `<textarea rows=1 style="border:0; width:100%; opacity:0.7; font-size:0.6em; margin-bottom: 8px;">${
                this.emptyOrText(people.map(x=>"@"+x.vk_shortname).join(", "))
            }</textarea>`
        }
        this.renderUI = function(presentList=[], absentList=[], addedItemsList=[], removedItemsList=[]){
            var html =  `<h3>Счетчик присутствующих / отсутствующих</h3>
        <button style="border: 0; padding: 0.5em;" onclick='${this.instancePath}.countPeople();'>Сканировать</button>
        <br/><br/>

        <h3>Список присутствующих [${presentList.length}]</h3>
        ${this.generateVkIdsList(presentList)}
        <div>${this.emptyOrText(presentList.map(x=>x.name).join("<br/>"))}</div>

        <br/>
        <h3>Список отсутствующих [${absentList.length}]</h3>
        ${this.generateVkIdsList(absentList)}
        <div>${this.emptyOrText(absentList.map(x=>x.name).join("<br/>"))}</div>

        <br/>
        <br/>
        <h3>Пришли [${addedItemsList.length}]<br/><span style="opacity: 0.5; font-size: 0.8em;">(c момента последнего сканирования)</span></h3>
        <div>${this.emptyOrText(addedItemsList.map(x=>x.name).map(x=>"+ "+x).join("<br/>"))}</div>
        <br/>
        <h3>Ушли [${removedItemsList.length}]</h3>
        <div>${this.emptyOrText(removedItemsList.map(x=>x.name).map(x=>"- "+x).join("<br/>"))}</div>

        <br/>
        `
            this.uiContainer.innerHTML = html
        }
        this.run = function(){
            this.renderUI()
        }
    }
    function createUIContainer(){
        var uiContainer = document.createElement("DIV")
        uiContainer.style.overflowY = "auto"
        uiContainer.style.height = "calc(100%)"
        uiContainer.style.padding = "2em"
        uiContainer.style.boxShadow = "0 -10px 11px -10px rgb(0 0 0 / 5%)"
        return uiContainer
    }
    var groupMembers = []
    function setupUserInterface(){
        var container = document.getElementsByClassName(streamPeopleTabClassName)[0]
        if (container){
            container.style.height = "50%"
            var uiContainer = createUIContainer()
            container.appendChild(uiContainer)
            window.hermitUI_peopleCounterInstance = new HermitUI_PeopleCounter("window.hermitUI_peopleCounterInstance", uiContainer, groupMembers)
            window.hermitUI_peopleCounterInstance.run()
            return true
        }
        else{
            return false
        }
    }

    // TODO:
    // fetching groupMembers
    // should be done with fetch, but hosting is aggressive about such calls
    // var groupName = "ИНБО-12-21"
    //fetch(`http://ashen-hermit.42web.io/group-captain-tool/api/get_group.php?group_name=${groupName}`, {mode: "no-cors"}).then(req=>req.text()).then(console.log)
    // для сборки подобного массива можно использовать этот скрипт: https://pastebin.com/dK2YSi51
    groupMembers = [{"name":"Амелина Кристина","vk_shortname":"id188453892"},{"name":"Амирагян Эмануель","vk_shortname":"id475539675"},{"name":"Бабаев Николай","vk_shortname":"id207539407"},{"name":"Баторова Аяна","vk_shortname":"id101425599"},{"name":"Дубровский Владислав","vk_shortname":"id309556221"},{"name":"Зиннуров Эмиль","vk_shortname":"id336557871"},{"name":"Зотова Екатерина","vk_shortname":"id174329217"},{"name":"Казаков Денис","vk_shortname":"id71271737"},{"name":"Карандашов Дмитрий","vk_shortname":"id548559506"},{"name":"Каширин Евгений","vk_shortname":"id237039005"},{"name":"Кириленко Алексей","vk_shortname":"id392577017"},{"name":"Колпакова Полина","vk_shortname":"id305703963"},{"name":"Лапинский Максим","vk_shortname":"id299164852"},{"name":"Любимов Кирилл","vk_shortname":"id587774508"},{"name":"Марченко Иван","vk_shortname":"id273457784"},{"name":"Морозов Егор","vk_shortname":"id576828276"},{"name":"Пивкин Александр","vk_shortname":"id348657437"},{"name":"Прошкин Антон","vk_shortname":"id319583497"},{"name":"Савельева Анастасия","vk_shortname":"id274001204"},{"name":"Савостин Иван","vk_shortname":"id241713455"},{"name":"Смирнов Никита","vk_shortname":"id231862769"},{"name":"Толмаков Артем","vk_shortname":"id185127297"},{"name":"Фонин Дмитрий","vk_shortname":"id285423900"},{"name":"Чурилов Сергей","vk_shortname":"id372965114"},{"name":"Чурсина Юлия","vk_shortname":"id227805855"},{"name":"Шварц Никита","vk_shortname":"id464321956"},{"name":"Шириширенко Никита","vk_shortname":"id285710543"},{"name":"Ядикарян Доминик","vk_shortname":"id321066557"},{"name":"Ярастов Илья","vk_shortname":"id358797964"}]

    registerSetupDeamon("UI", setupUserInterface)

})();