// ==UserScript==
// @name         QQ群群员数据导出
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  导出QQ群群员数据
// @author       You
// @match        https://qun.qq.com/member.html
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405790/QQ%E7%BE%A4%E7%BE%A4%E5%91%98%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/405790/QQ%E7%BE%A4%E7%BE%A4%E5%91%98%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function getXHROpenArgs(url) {
        const OriginXHR = XMLHttpRequest;
        return new Promise((resolve) => {
            const XHR = function() {
                let a = new OriginXHR();
                let originOpen = a.open;
                a.open = function(...args) {
                    if (args[1] && args[1].includes(url)) {
                        resolve(args);
                    }
                    return originOpen.apply(this, args);
                }
                return a;
            }
            XMLHttpRequest = XHR;
        });
    }

    function request(...args) {
        return new Promise((resolve) => {
            fetch(...args).then((resp) => {
                if (resp.status >= 200 && resp.status <= 300) {
                    resp.json().then(r => resolve({ d: r }));
                    return;
                }
                resolve({});
            }).catch((err) => resolve({ err }))
        });
    }
    request.get = (url) => {
        return request(url, {
            headers: {
                'x-requested-with': 'XMLHttpRequest',
            },
        });
    }
    request.post = (url, body) => {
        return request(url, {
            method: 'post',
            body,
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'x-requested-with': 'XMLHttpRequest',
            },
        });
    }

    async function wait(time) {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }

    function getProp(object, path, defaultVal) {
        const PATH = Array.isArray(path)
          ? path
          : path.split('.').filter(i => i.length);
        if (!PATH.length) {
          return object === undefined ? defaultVal : object;
        }
        if (object === null || object === undefined || typeof (object[PATH[0]]) === 'undefined') {
          return defaultVal;
        }
        return getProp(object[PATH.shift()], PATH, defaultVal);
    }

    async function getMemberByGroupId(groupId) {
        const requestLimit = 40;
        function getMember({ start, end }) {
            const details = {
                bkn,
                gc: groupId,
                sort: 0,
                st: start,
                end,
            };
            const formBody = [];
            Object.keys(details).forEach((k) => {
                var encodedKey = encodeURIComponent(k);
                var encodedValue = encodeURIComponent(`${details[k]}`);
                formBody.push(`${encodedKey}=${encodedValue}`);
            });
            return request.post('/cgi-bin/qun_mgr/search_group_members', formBody.join("&"));
        }

        let members = [];
        let currentMembers = [];
        let count = 0;
        do {
            // 每个请求间，添加随机等待时间
            await wait(Math.floor(Math.random() * 500) + 500);
            try {
                ({ d: { mems: currentMembers, count } } = await getMember({ start: members.length, end: members.length + requestLimit }));
            } catch (error) {
                console.log('error: ', groupId, error);
                return;
            }
            members = members.concat(currentMembers);
        } while (currentMembers && typeof count === 'number' && members.length < count);

        return members;
    }

    // 获取bkn参数，bkn参数是所有接口都需要的参数，每次登录都会改变，应该是腾讯用于校验的参数
    const [requestMethod, requestUrl] = await getXHROpenArgs('/cgi-bin/qunwelcome/myinfo');
    const matchResult = requestUrl.match(/bkn=([0-9]+)/);
    if (!matchResult || !matchResult[1]) {
        alert('获取请求参数失败');
        return;
    }
    const bkn = matchResult[1];

    // 获取所有群组
    const getGroups = (() => {
        let allGroups = [];
        return async () => {
            if (!allGroups || !allGroups.length) {
                const { d: groupsInfo } = await request.post('/cgi-bin/qun_mgr/get_group_list', `bkn=${bkn}`);
                if (!groupsInfo || (!Array.isArray(groupsInfo.join) && !Array.isArray(groupsInfo.manage))) {
                    alert('获取群列表失败');
                    return;
                }
                allGroups = [].concat(groupsInfo.manage).concat(groupsInfo.join);
            }
            return allGroups;
        }
    })();

    // 获取所有组的成员
    async function getAllGroupMembers() {
        const allGroups = await getGroups();
        if (!allGroups) return;
        const allMembers = [];
        for (let g = 0; g < allGroups.length; g++) {
            const groupInfo = allGroups[g];
            const members = await getMemberByGroupId(groupInfo.gc).catch(() => { });
            allMembers.push({
                groupInfo,
                members,
            });
        }
        return allMembers;
    }

    // 获取当前组的成员
    async function getCurrentMembers() {
        const [_, gid] = window.location.href.match(/gid=([0-9]+)/) || [];
        const members = await getMemberByGroupId(gid).catch(() => { });
        const allGroups = await getGroups();
        const currentGroup = (allGroups || []).find(e => `${e.gc}` === gid);
        return {
            groupInfo: currentGroup,
            members,
        };
    }

    function saveAsCsv(membersMap, groups, filename = '成员表') {
        const allMembers = [];
        groups.forEach((e) => {
            if (!e.members) {
                allMembers.push(e.groupInfo);
                return;
            }
            e.members.forEach((m) => {
                allMembers.push({
                    ...e.groupInfo,
                    ...m,
                });
            });
        });
        const headers = membersMap.reduce((result, curr, idx) => {
            return `${result ? `${result},` : ''}${curr.name}${idx === membersMap.length - 1 ? ',\n' : ''}`;
        }, '');
        const inValue = allMembers.reduce((result, curr) => {
            const r = membersMap.reduce((res, c, idx) => {
                let v = getProp(curr, c.dataIndex);
                if (c.translate) {
                    v = c.translate(v, curr);
                }
                return `${res ? `${res},` : ''}${v}${idx === membersMap.length - 1 ? ',\n' : ''}`;
            }, '');
            return `${result}${r}`;
        }, '');
        
        const blob = new Blob(['\uFEFF', `${headers}${inValue}`], {
            type: 'text/csv;charset=utf-8',
        });
        const uri = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = uri;
        link.download = `${filename}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(uri);
    }
    
    function saveAsJson(memberMap, groups, filename = '成员数据') {
        const jsonString = JSON.stringify({
            memberMap,
            groups,
        }, null, 0);
        const blob = new Blob([jsonString], {
            type: 'application/json;charset=utf-8',
        });
        const uri = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = uri;
        link.download = `${filename}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(uri);
    }

    let exporting = false;
    async function handleClick({ type } = {}) {
        if (exporting) {
            alert('正在导出，请不要重复点击');
            return;
        }
        exporting = true;
        const fileType = document.getElementById('fileTypeSelect').value;
        const saveFile = fileType === 'json' ? saveAsJson : saveAsCsv;
        const memberMap = [
            {
                name: '群名称',
                dataIndex: 'gn',
            },
            {
                name: '成员',
                dataIndex: 'nick',
            },
            {
                name: '成员类别',
                dataIndex: 'role',
                translate: (v) => {
                    const m = {
                        0: '群主',
                        1: '管理员',
                        2: '普通成员',
                    };
                    return m[v];
                }
            },
            {
                name: '群昵称',
                dataIndex: 'card',
            },
            {
                name: 'QQ号',
                dataIndex: 'uin',
            },
            {
                name: '性别',
                dataIndex: 'g',
                translate: (v) => {
                    const m = {
                        0: '男',
                        1: '女',
                        '-1': '未知',
                    };
                    return m[v];
                },
            },
            {
                name: 'Q龄',
                dataIndex: 'qage',
                translate: v => `${v}年`,
            },
            {
                name: '入群时间',
                dataIndex: 'join_time',
                translate: v => {
                    const d = new Date(v * 1000);
                    return `${d.getFullYear()}/${`${d.getMonth() + 1}`.padStart(2, '0')}/${`${d.getDate()}`.padStart(2, '0')}`;
                },
            },
            {
                name: '最后发言',
                dataIndex: 'last_speak_time',
                translate: v => {
                    const d = new Date(v * 1000);
                    return `${d.getFullYear()}/${`${d.getMonth() + 1}`.padStart(2, '0')}/${`${d.getDate()}`.padStart(2, '0')}`;
                },
            },
        ];
        if (type === 'all') {
            const allMembers = await getAllGroupMembers();
            console.log('全部群成员：', allMembers);
            saveFile(memberMap, allMembers, '全部群成员');
            exporting = false;
            return;
        }
        let currentGroup = await getCurrentMembers();
        console.log('当前群成员：', currentGroup);
        if (!currentGroup.members) {
            alert('获取当前群成员失败');
            exporting = false;
            return;
        }
        saveFile(memberMap, [currentGroup], `${getProp(currentGroup, 'groupInfo.gn')}群成员`);
        exporting = false;
    }

    const fileTypeSelect = document.createElement('select');
    fileTypeSelect.id = 'fileTypeSelect';
    fileTypeSelect.style.width = '120px';
    fileTypeSelect.style.height = '30px';
    fileTypeSelect.style.marginRight = '5px';
    const csvOption = document.createElement('option');
    csvOption.value = 'csv';
    csvOption.innerText = '导出为csv文件';
    fileTypeSelect.appendChild(csvOption);
    const jsonOption = document.createElement('option');
    jsonOption.value = 'json';
    jsonOption.innerText = '导出为json文件';
    fileTypeSelect.appendChild(jsonOption);

    const exportButton = document.createElement('button');
    exportButton.innerHTML = '导出当前组';
    exportButton.id = 'exportFile';
    exportButton.style.marginRight = '5px';
    exportButton.addEventListener('click', handleClick);

    const exportAllButton = document.createElement('button');
    exportAllButton.innerHTML = '导出全部组';
    exportAllButton.id = 'exportGroupsFile';
    exportAllButton.style.marginRight = '5px';
    exportAllButton.addEventListener('click', () => handleClick({ type: 'all' }));

    setInterval(addExportButton, 200);
    function addExportButton() {
        if (!document.getElementById('fileTypeSelect')) {
            document.getElementById('groupMemberTit').appendChild(fileTypeSelect);
        }
        if (!document.getElementById('exportFile')) {
            document.getElementById('groupMemberTit').appendChild(exportButton);
        }
        if (!document.getElementById('exportGroupsFile')) {
            document.getElementById('groupMemberTit').appendChild(exportAllButton);
        }
    }
})();
