// ==UserScript==
// @name         Roster exchange filters
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Добавляет сортировку по балам, и ускоряет роботу фильтров
// @author       wandersher
// @match        https://st-roster.win/personal/vehicle-exchange
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430540/Roster%20exchange%20filters.user.js
// @updateURL https://update.greasyfork.org/scripts/430540/Roster%20exchange%20filters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.type = null
    window.levels = []
    window.order = 'asc'
    window.onChangeType = function(type) {
        type = type === window.type ? null : type
        document.querySelector(".row.filters .vehicle-type-5").className = type === "vehicle-type-5" ? "btn btn-default vehicle-type-5 btn-primary" : "btn btn-default vehicle-type-5"
        document.querySelector(".row.filters .vehicle-type-4").className = type === "vehicle-type-4" ? "btn btn-default vehicle-type-4 btn-primary" : "btn btn-default vehicle-type-4"
        document.querySelector(".row.filters .vehicle-type-1").className = type === "vehicle-type-1" ? "btn btn-default vehicle-type-1 btn-primary" : "btn btn-default vehicle-type-1"

        if (type) {
            Array.from(document.querySelectorAll('.col-md-3.vehicle-item.vehicle-type-5')).map(function(it){ it.style = type === "vehicle-type-5" ? "" : "display:none;"})
            Array.from(document.querySelectorAll('.col-md-3.vehicle-item.vehicle-type-4')).map(function(it){ it.style = type === "vehicle-type-4" ? "" : "display:none;"})
            Array.from(document.querySelectorAll('.col-md-3.vehicle-item.vehicle-type-1')).map(function(it){ it.style = type === "vehicle-type-1" ? "" : "display:none;"})
        } else {
            Array.from(document.querySelectorAll('.col-md-3.vehicle-item')).map(function(it){ it.style = "" })
        }
        document.querySelector('.row.vehicles').style = "position: relative;"
        window.type = type
    }
    window.onChangeLevel = (value) => {
        if (window.levels.includes(value)) {
            window.levels = window.levels.filter(it => it !== value)
        } else {
            window.levels = [...window.levels, value]
        }
        if (!window.levels.length) {
            window.onChangeType(null)
        } else {
            if (window.type !== 'vehicle-type-1') window.onChangeType('vehicle-type-1')
        }

        Array.from(new Array(10)).map((item, index) => {
            const level = index + 1
            const className = 'vehicle-level-' + level
            document.querySelector('.row.filters .' + className).className = window.levels.includes(level) ? ('btn btn-default ' + className + ' btn-primary') : ('btn btn-default ' + className)
            Array.from(document.querySelectorAll('.col-md-3.vehicle-item.' + className)).map(function(it){ it.style = window.levels.includes(level) ? "" : "display:none;"})
        })
    }
    window.onSort = (order) => {
        if (window.order != order) {
            window.order = order
            const parent = document.querySelector('.row.vehicles')
            console.log(parent.childNodes)
            for (let i = 1; i < parent.childNodes.length; i++) {
                parent.insertBefore(parent.childNodes[i], parent.firstChild);
            }
            const sort_asc = document.querySelectorAll('.vehicle-sort')[0]
            const sort_desc = document.querySelectorAll('.vehicle-sort')[1]

            sort_desc.className = order == 'desc' ? sort_desc.className + " btn-primary" : sort_desc.className.replace("btn-primary", "")
            sort_asc.className = order == 'asc' ? sort_asc.className + " btn-primary" : sort_asc.className.replace("btn-primary", "")
        }
    }
    window.onDisable = (nodes)=>{
        nodes = nodes ? nodes : document.querySelectorAll('.vehicles .vehicle-item')
        var json = localStorage.getItem('disabled')
        var disabled = JSON.parse(json ? json : '[]')
        Array.from(nodes).map(item => {
            item.style = ""
            item.id = disabled[item.querySelector('.title').innerText.trim()] ? "disabled" : ""
        })
    }

    const type_filter = document.querySelector(".row.filters").querySelectorAll('.button-group')[0]
    const all_types = [{ id: 1, title: 'Танки' }, { id: 4, title: 'Пакеты' }, { id: 5, title: 'Стили' }]
    type_filter.parentElement.parentElement.className = "col-md-4"
    type_filter.innerHTML = ""
    all_types.map(({ id, title }) => {
        const span = document.createElement('span')
        span.className = "btn btn-default vehicle-type-" + id.toString()
        span.setAttribute("onclick", "window.onChangeType('vehicle-type-" + id + "')");
        span.innerText = title
        type_filter.appendChild(span)
    })
    const level_filter = document.querySelector(".row.filters").querySelectorAll('.button-group')[1]
    const all_levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    level_filter.parentElement.parentElement.className = "col-md-6"
    level_filter.innerHTML = ""
    all_levels.map(level => {
        const span = document.createElement('span')
        span.className = "btn btn-default vehicle-level-" + level.toString()
        span.setAttribute("onclick", "window.onChangeLevel(" + level + ")");
        span.innerText = level.toString()
        level_filter.appendChild(span)
    })
    const container = document.querySelector(".row.filters")
    container.innerHTML += `<div class="col-md-2" style=""><div class="ui-group" style="align-items: center; display: flex; flex-direction: column;"><h3>Сортировка</h3><div class="button-group"><span class="btn btn-default vehicle-sort btn-primary" onclick="window.onSort('asc')"><span class="glyphicon glyphicon-arrow-up"></span></span><span class="btn btn-default vehicle-sort" onclick="window.onSort('desc')"><span class="glyphicon glyphicon-arrow-down"></span></span></div></div></div>`
    var timer = null
    var status = false
    function modify(){
        var nodes = document.querySelectorAll('.vehicles .vehicle-item')
        if(nodes.length == 0 || status) return
        status = true
        clearInterval(timer)
        window.onDisable(nodes)
    }
    timer = setInterval(modify, 5)
})();