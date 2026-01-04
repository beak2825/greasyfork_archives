// ==UserScript==
// @name         快手小店库
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自用
// @author       Mr Liu
// @match        *
// @grant        none
// ==/UserScript==
 
function copy() {
    let a = ''
    for (let i = 0; i < $('.ant-select-selection__choice').length; i++) {
        let value = $('.ant-select-selection__choice').eq(i).text().replace(/[-]/g, "\t")
        a += value + '\r\n'
    }

    GM_setClipboard(a)
    alert('复制成功，共复制' + (a.split("\r\n").length - 1) + '个地区')
}

async function getUpdate() {
    const e = await fetch("https://s.kwaixiaodian.com/rest/app/tts/ks/express/template/list?offset=0&limit=20&searchUsed=true", {
        "method": "GET",
    })
    const v = await e.json()
    if (v.data.total) {
        let date = new Date(v.data.content[0].updateTime).toLocaleString().replace(/[/]/g, '-')
        return date
    }
}

function arrangement(area) {//处理手动输入的屏蔽地区
    area = area.split("\r\n")
    area = [... new Set(area)]//去重
    let adr = area.map(e => {
        let v = e.split("\t")
        return {
            province: v[0],
            city: v[1] || "",
            area: v[2] || ""
        }
    })
    // area = area.replace(/[,，.。]/g, '、')//替换标点
    // area = area.replace(/[\n\r]/g, '、')//替换换行符
    // let adr = area.split('、')//变成数组
    // adr = adr.filter(function (s) {//去空值
    //     return s && s.trim();
    // });

    // adr = adr.map(v => v.replace(/(（).+(）)/g, ''))//去括号
    return adr
}

function getvalue(data, area) {//计算屏蔽id 返回对象{aid：包邮地区,Id：屏蔽地区}
    const code = data.map(e => e.code)
    let list = [], del_list = [];
    list = arrangement(area)
    console.log("list", list)
    console.log("data", data)
    let list1 = list.filter(e => e.area == "" && e.city == "")
    console.log("list1", list1)
    let id = []
    for (let e of list1) {
        if (data.some((v) => v.name.includes(e.province))) {
            const a = data.find(v => v.name.includes(e.province))
            id.push(a.code)
            console.log("删除", a)
            data.splice(data.indexOf(a), 1)
            del_list.push(e)
        }
    }
    if (del_list.length) {
        list = list.filter(e => !del_list.includes(e))
        del_list = []
    }
    let list2 = list.filter(e => e.area == "" && e.city != "")
    console.log("id", id)
    console.log("list1", list1)
    console.log("list", list)
    console.log("data", data)
    console.log(2222222222222222222)

    let data_children = data.map(e => e.children).flat()//把市提取出来
    console.log("data_children", data_children)
    console.log("list2", list2)
    for (let e of list2) {
        if (data_children.some(v => v.name.includes(e.city))) {
            const a = data_children.find(v => v.name.includes(e.city))
            id.push(a.code)
            console.log("删除", a)
            data_children.splice(data_children.indexOf(a), 1)
            del_list.push(e)
        }
    }
    if (del_list.length) {
        list = list.filter(e => !del_list.includes(e))
        del_list = []
    }
    let list3 = list.filter(e => e.area != "")
    console.log("id", id)
    console.log("list2", list2)
    console.log("list", list)
    console.log("data_children", data_children)

    console.log(33333333333333333)
    let data_children_children = data_children.map(e => e.children).flat()//把市提取出来
    console.log("data_children", data_children)
    console.log("list3", list3)
    for (let e of list3) {
        if (data_children_children.some(v => v.name.includes(e.area))) {
            const a = data_children_children.find(v => v.name.includes(e.area) && data.find(r => r.children.find(t => t.children.find(y => y == v))).name.includes(e.province))
            if (a) {
                id.push(a.code)
                console.log("删除", a)
                data_children_children.splice(data_children_children.indexOf(a), 1)
                del_list.push(e)
            }
        } else if (["区", "县", "市"].includes(e.area.slice(-1))) {
            const b = data.find(v => v.name.includes(e.province))
            const c = b && b.children.find(v => v.name.includes(e.city))
            const a = c && c.children.find(v => v.name.includes(e.area.slice(0, -1)))
            if (a) {
                id.push(a.code)
                console.log("删除111111111111111111", a)
                data_children_children.splice(data_children_children.indexOf(a), 1)
                del_list.push(e)
            }
        }
    }
    if (del_list.length) {
        list = list.filter(e => !del_list.includes(e))
        del_list = []
    }
    console.log("id", id)
    console.log("list3", list2)
    console.log("list", list)
    console.log("data_children_children", data_children_children)

    let aid = code.filter(e => ![...new Set(id.map(v => v.slice(0, 2)))].includes(e))
    console.log("aid", aid)

    return {
        'aid': aid,
        'Id': id,
        'adr': list
    }

}

async function save() {
    let area = prompt('输入要屏蔽的地区')
    if (area) {
        let value = getvalue(await getData(), area)
        if (!value.adr.length) {
            console.log('全部添加完成')
            if (confirm('已匹配所有地区，点击确定开始保存')) {
                go(value)
            }
        } else {
            let data = String(value.adr.map(e => e.province + "\t" + e.city + "\t" + e.area + "\r\n")).replace(/[,]/g, "")
            console.log(data)
            GM_setClipboard(data)
            if (confirm('未匹配成功的地区：\n' + data + '\n点击确定开始保存')) {
                go(value)
            }
        }

    }
    async function go(value) {
        let key = await getKey()
        let cookie = await getCookie(key)
        let detail = await get_detail(cookie, key)
        fet(cookie, key, detail, value)
    }
}