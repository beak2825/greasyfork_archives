// ==UserScript==
// @name         训练营作业数据抓取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  训练营作业数据抓取 dddd
// @author       wjiec
// @match        https://xuexi.cyjiaomu.com/my/delivery/work/student/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cyjiaomu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480284/%E8%AE%AD%E7%BB%83%E8%90%A5%E4%BD%9C%E4%B8%9A%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/480284/%E8%AE%AD%E7%BB%83%E8%90%A5%E4%BD%9C%E4%B8%9A%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sleep = (seconds) => {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds*1000)
        })
    }

    const getClasses = () => {
        const groupIds = []
        const ps = $('.selectInput p')
        for (let i = 0; i < ps.length; i++) {
            const classId = ps[i].getAttribute('value')
            if (classId !== '0') groupIds.push({classId, name: ps[i].innerText})
        }
        return groupIds
    }

    const getGroups = async (classId) => {
        const res = await axios.get('/api/delivery/group/list', {
            params: {
                delivery_id: delivery_id,
                class_id: parseInt(classId),
            }
        })
        return res.data.data.list
    }

    const getGroupWorkInfo = async (group) => {
        const res = await axios.get(`${window.location.pathname}?c=${group.class_id}&g=${group.id}`)
        const workTit = $(res.data).find('.deliveryWorkTit span:nth-child(2)').text()
        return workTit.match(/\d+/)[0]
    }

    // -- main --

    const pluginMain = async (container) => {
        for (const cls of getClasses()) {
            const groups = await getGroups(cls.classId)
            for (const group of groups) {
                const groupInfo = await getGroupWorkInfo(group)

                $('<p>', {
                    text: `${cls.name}\t--\t${group.name}\t--\t${groupInfo}`
                }).appendTo(container)
            }
        }
    }

    // -- ui --

    const createContainer = () => {
        if ($('.deliveryWorkTit .full_data').length === 0) {
            $('<div>', {class: 'full_data'}).appendTo($('.deliveryWorkTit'))
            $('.deliveryWorkTit')[0].style.flexDirection = 'column'
        }

        const container = $('.deliveryWorkTit .full_data')
        container[0].innerHTML = ''
        return container
    }

    const createEntry = () => {
        $('<div>', {
            class: 'confirmation',
            text: '查询数据',
            on: {
                click: async () => {
                    const container = createContainer()
                    const data = pluginMain(container)
                    }
            }
        }).appendTo($('.deliveryWorkHead'))
    }

    createEntry()
})();