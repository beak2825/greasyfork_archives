/* globals $ */
// ==UserScript==
// @name         快手小店脚本
// @namespace    https://gitee.com/muran888
// @version      6.17
// @description  禁止外传
// @author       小刘
// @match        https://s.kwaixiaodian.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @license      小刘
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/453875/%E5%BF%AB%E6%89%8B%E5%B0%8F%E5%BA%97%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/453875/%E5%BF%AB%E6%89%8B%E5%B0%8F%E5%BA%97%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
GM_registerMenuCommand('复制屏蔽地区', () => copy())
GM_registerMenuCommand('查询屏蔽地区个数', () => alert('当前屏蔽地区共：' + $('.ant-select.ant-select-enabled ul li.ant-select-selection__choice').length + '个'))
GM_registerMenuCommand('运费模板更新时间', () => getUpdate().then(e => alert('运费模板更新时间是\n' + e)))
GM_registerMenuCommand('修改运费模板', () => save())
GM_registerMenuCommand('批量确定拒收后退款', () => Process_refund())
GM_registerMenuCommand("已发货无物流订单仅退款处理", () => Nologistics_Refund())
GM_registerMenuCommand("已拒收订单批量退款", () => Refund_after_refusal())
GM_registerMenuCommand('查询订单限制', async () => {
    const data = await limitOrder()
    if (data.applyConditions[0].match && (data.limitOrderNum > 0)) {
        alert("限单中：" + data.limitOrderNum)
    } else alert("未限制")
    console.log(data)
})
GM_registerMenuCommand('学规减分', () => learn())
GM_registerMenuCommand('解除订单限制（无限单情况的请勿滥用）', () => Unlimit())

window.onkeydown = async function (KeyboardEvent) {
    switch (KeyboardEvent.keyCode) {
        case 13:
            if (KeyboardEvent.ctrlKey) {
                save()
            }; break;
        case 109: $('.ant-radio-wrapper:contains(其他)').click(); break;
        case 192:
            if (KeyboardEvent.ctrlKey) {
                copy()
            } else {
                alert('当前屏蔽地区共：' + $('.ant-select.ant-select-enabled ul li.ant-select-selection__choice').length + '个')
            }; break;
    }
}

window.onload = async function () {
    query_Violation().then(async data => {
        const len = data.length;
        alert('有' + len + '个待处理的违规')
        for (let i = 0; i < len; i++) {
            if (data[i].banType == 13) {
                if (confirm('脚本即将为你自动学习')) await study(data[i])
            } else if (data[i].banType == 12) {
                if (confirm('脚本即将为你自动考试')) await exam(data[i])
            } else if (data[i].status == 1) {
                if (!data[i].banTypeDescList.find(e => e.includes('违'))) {
                    if (confirm('脚本即将为你确认处罚：  ' + data[i].banTypeDescList + '\n\n' + data[i].governanceRuleName + '\n\n' + data[i].governanceRuleDesc + '\n\n' + data[i].punishReason)) {
                        const qqq = (await confirm_punishment(data[i].id)).result
                        if (qqq == 1) {
                            if (data[i].banTypeDescList.includes('强制考试')) {
                                if (confirm('脚本即将为你自动考试')) await exam(data[i])
                            } else if (data[i].banTypeDescList.includes('强制学习')) {
                                if (confirm('脚本即将为你自动学习')) await study(data[i]).then()
                            }
                        }
                    }
                }
            } else if (data[i].banTypeDescList.includes('强制考试') || data[i].banTypeDescList.includes('强制学习')) {
                const key = await getKey()
                const cookie = await getCookie(key)
                await query_Violation_info(data[i], key, cookie).then(async info => {
                    if (info.banType == 12) {
                        if (confirm('脚本即将为你自动考试')) await exam(data[i])
                    } else if (info.banType == 13) {
                        if (confirm('脚本即将为你自动学习')) await study(data[i])
                    }
                })
            }
        }
    })
}

function copy() {
    let a = ''
    for (let i = 0; i < $('.ant-select-selection__choice').length; i++) {
        let value = $('.ant-select-selection__choice').eq(i).text().replace(/[-]/g, "\t")
        a += value + '\r\n'
    }
    GM_setClipboard(a)
    alert('复制成功，共复制' + (a.split("\r\n").length - 1) + '个地区')
}

function query_Violation() {
    return new Promise(async (resovle, reject) => {
        let arr = []
        await fetch("https://s.kwaixiaodian.com/rest/pc/themis/punishhub/punishTicket/list?offset=0&limit=50&punishTicketStatus=0&roleType=2&punishTicketId=", {
            "method": "GET",
        }).then(e => e.json().then(v => {
            const data = qqq(v)
            if (data) arr.push(...data)
            if (arr[0]) resovle(arr)
            else reject()
        }))
        // await fetch("https://s.kwaixiaodian.com/rest/pc/themis/punishhub/punishTicket/list?offset=0&limit=10&punishTicketStatus=0&roleType=1&punishTicketId=", {
        //     "method": "GET",
        // }).then(e => e.json().then(v => {
        //     const data = qqq(v)
        //     if (data) arr.push(...data)
        // }))

    })
    function qqq(v) {
        const q = v.data.data.filter(e => e.banType != 0 || e.status == 1 || (e.status == 3 && e.banType != 0))
        if (q[0]) return q
        else return false
    }
}

function query_Violation_info(data, key, cookie) {
    return new Promise((resovle, reject) => {
        fetch(`https://s.kwaixiaodian.com/rest/pc/themis/punishhub/punishTicket/detail?id=${data.id}`, {
            "headers": {
                "accept": "application/json;charset=UTF-8",
                "accept-language": "zh-CN,zh;q=0.9",
                "ks-s-ctn": cookie,
                "merchantsessionkey": key,
            },
            "referrer": `https://s.kwaixiaodian.com/zone/violation/detail?page_code=VIOLATION_DETAIL&violation_id=${data.id}`,
            "method": "GET"
        }).then(e => e.json().then(r => {
            resovle(r.data.punishContent.find(v => (v.banType == 12 || v.banType == 13) && v.operation != 0))
        }))
    })
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

async function fet(cookie, key, detail, value) {
    fetch("https://s.kwaixiaodian.com/rest/app/tts/ks/express/template/update", {
        "headers": {
            "accept": "application/json;charset=UTF-8",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/json;charset=UTF-8",
            "ks-s-ctn": cookie,
            "merchantsessionkey": key,
        },
        "referrer": location.href,
        "body": `{"data":{"name":"${detail.name}","calType":${detail.calType},"sendProvinceCode":"${detail.sendProvinceCode}","sendProvinceName":"${detail.sendProvinceName}","sendCityCode":"${detail.sendCityCode}","sendCityName":"${detail.sendCityName}","sendDistrictCode":"${detail.sendDistrictCode}","sendDistrictName":"${detail.sendDistrictName}","config":{"type":${JSON.parse(detail.config).type},"content":{"includeProvinces":[${value.aid}],"provinceFees":[],"excludeProvinces":[{"codeList":[${value.Id}],"reasonCode":7}]}},"id":"${detail.id}"}}`,
        "method": "POST",
    }).then(e => e.json().then(v => {
        if (v.result == '1') {
            alert('保存成功')
            location.reload()
        } else {
            console.log(v)
            alert(v.errorMsg)
        }
    }))
}

async function getData() {
    return JSON.parse(
        (
            await (
                await fetch("https://w2.eckwai.com/udata/pkg/eshop/kwaishop-supply-pc-micro/static/js/main.2ea0d5da.chunk.js")
            ).text()
        ).split("JSON.parse('")[1].split("')},1588")[0]
    )
}

async function get_detail(cookie, key) {//获取页面信息
    return (
        await (
            await fetch(`https://s.kwaixiaodian.com/rest/pc/scm/api/ks/express/template/detail?id=${location.href.split('id=')[1]}`, {
                "headers": {
                    "accept": "application/json;charset=UTF-8",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "ks-s-ctn": cookie,
                    "merchantsessionkey": key,
                },
                "referrer": location.href,
                "method": "GET",
            })
        ).json()
    ).data
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
    id = [...new Set(id)]
    let aid = code.filter(e => ![...new Set(id.map(v => v.slice(0, 2)))].includes(e))
    console.log("aid", aid)

    return {
        'aid': aid,
        'Id': id,
        'adr': list
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

async function getKey() {//获取通行秘钥
    return (
        await (
            await fetch("https://s.kwaixiaodian.com/rest/app/tts/seller/login/info", {
                "method": "GET",
            })
        ).json()
    ).userInfo.merchantSessionKey
}

async function getCookie(key) {//获取cookie
    await fetch("https://s.kwaixiaodian.com/rest/app/tts/cs/ref", {//发送请求获取cookie
        "headers": {
            "accept": "application/json;charset=UTF-8",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/json;charset=UTF-8",
            "merchantsessionkey": key,
        },
        "referrer": location.href,
        "method": "POST",
    })
    if (await cookieStore.get('ks-s-ctn')) {
        const cookie = (await cookieStore.get('ks-s-ctn')).value
        return cookie
    } else alert('未获取到cookie，请联系作者反馈bug')
}

async function study(data) {
    return new Promise(async (resovle, reject) => {
        let key = await getKey()
        fetch("https://s.kwaixiaodian.com/rest/pc/themis/punishhub/punishTicket/learnComplete", {
            "headers": {
                "accept": "application/json;charset=UTF-8",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json;charset=UTF-8",
                "ks-s-ctn": await getCookie(key),
                "merchantsessionkey": key,
            },
            "referrer": `https://s.kwaixiaodian.com/zone/violation/study?id=${data.id}&banType=${data.banType}`,
            "body": `{"id":"${data.id}"}`,
            "method": "POST",
        }).then(e => e.json().then(v => {
            console.log(11111111, v)
            if (v.result == 1) alert('自动学习成功')
            else alert(v.error_msg)
            resovle()
        }))
    })
}

async function exam(data) {
    const key = await getKey()
    const cookie = await getCookie(key)
    const aaa = await (
        await fetch(`https://s.kwaixiaodian.com/rest/pc/themis/punishhub/punishTicket/queryLearnTest?id=${data.id}&banType=12`, {
            "headers": {
                "accept": "application/json;charset=UTF-8",
                "accept-language": "zh-CN,zh;q=0.9",
                "ks-s-ctn": cookie,
                "merchantsessionkey": key,
            },
            "method": "GET",
        })
    ).json();
    const questionnaireId = aaa.data.questionnaireId;
    //window.open(`https://s.kwaixiaodian.com/zone/exam/${questionnaireId}?extraInfo=${data.id}`)
    let questionAnswerList = []
    let test = await quer_questionnaire(questionnaireId)
    console.log(11111111, test)
    for (let i = 0; i < test.length; i++) {
        let answer = []
        for (let o = 0; o < test[i].answer.length; o++) {
            const answer_obj = {
                "answer": test[i].answer[o]
            };
            answer.push(answer_obj)
        }
        const obj = {
            "questionId": test[i].questionId,
            "questionSnapshotId": test[i].questionSnapshotId,
            "answer": answer
        };
        questionAnswerList.push(obj)
    }
    const dataobj = {
        "questionnaireId": questionnaireId,
        "questionAnswerList": questionAnswerList,
        "startTime": Date.now(),
        "extraInfo": data.id,
        "qrCodeMixId": ""
    };
    console.log(dataobj)
    await submit(questionnaireId, dataobj)
}

function answer(test, questionnaireId, extraInfo) {
    let questionAnswerList = []
    for (let i = 0; i < test.length; i++) {
        let answer = []
        for (let o = 0; o < test[i].answer.length; o++) {
            const answer_obj = {
                "answer": test[i].answer[o]
            };
            answer.push(answer_obj)
        }
        const obj = {
            "questionId": test[i].questionId,
            "questionSnapshotId": test[i].questionSnapshotId,
            "answer": answer
        };
        questionAnswerList.push(obj)
    }
    const dataobj = {
        "questionnaireId": questionnaireId,
        "questionAnswerList": questionAnswerList,
        "startTime": Date.now(),
        "extraInfo": extraInfo,
        "qrCodeMixId": ""
    };
    console.log(dataobj)
    return dataobj
}

async function confirm_punishment(id) {
    const key = await getKey()
    const cookie = await getCookie(key)
    return new Promise((resovle, reject) => {
        fetch("https://s.kwaixiaodian.com/rest/pc/themis/punishhub/punishTicket/confirm", {
            "headers": {
                "accept": "application/json;charset=UTF-8",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json;charset=UTF-8",
                "ks-s-ctn": cookie,
                "merchantsessionkey": key,
            },
            "referrer": `https://s.kwaixiaodian.com/zone/violation/detail?page_code=VIOLATION_DETAIL&violation_id=${id}`,
            "body": `{"punishTicketId":"${id}"}`,
            "method": "POST",
        }).then(e => e.json().then(v => {
            resovle(v)
        }))
    })
}

class Agree {
    constructor(type) {
        this.types = type
    }
    async query() {
        this.len = 100
        this.total = Math.ceil((await this.pagination(1, 10)).total / this.len)
    }
    async start() {
        this.err_length = this.agreeRefuseDelivery_list.length
        this.err = 0
        this.ok = 0
        //return new Promise(async(resovles) => {
        let obj_arr2 = []
        for (let i = 0; i < this.agreeRefuseDelivery_list.length; i++) {
            let res = await this.agreeRefuseDelivery(this.agreeRefuseDelivery_list[i].refundId)
            if (res.result == 1) {
                ++this.ok;
                --this.err_length;
                console.log("完成第" + this.ok + "个")
                this.createToast("完成第" + this.ok + "个")
            } else {
                ++this.err;
                console.log("有" + this.err_length + "个异常")
                console.log(res)
                this.createToast("有" + this.err_length + "个异常")
                //resovles()
                break
            }
            console.log(this.agreeRefuseDelivery_list[i].refundId)
            this.createToast(this.agreeRefuseDelivery_list[i].refundId)
            /*                 if(this.err) {
                    resovles()
                    break
                }
                await stop(200) */
            /*                 if (i && i % 20 == 0) {
                    const time = 2
                    this.createToast("朕乏了，让我歇" + time + "秒先")
                    console.time("休息时间")
                    await stop(time)
                    console.timeEnd("休息时间")
                    console.log("休息好了")
                    this.createToast("休息好了,接着开工")
                } */
            /*                 obj_arr2.push(new Promise((resovle) => {
                    this.agreeRefuseDelivery(this.agreeRefuseDelivery_list[i].refundId).then(res => {
                        if (res.result == 1) {
                            ++this.ok
                                --this.err_length
                            console.log("完成第" + this.ok + "个")
                            this.createToast("完成第" + this.ok + "个")
                        } else {
                            ++this.err
                            console.log("有" + this.err_length + "个异常")
                            console.log(res)
                            this.createToast("有" + this.err_length + "个异常")
                            resovles()
                        }
                        console.log(this.agreeRefuseDelivery_list[i].refundId)
                        this.createToast(this.agreeRefuseDelivery_list[i].refundId)
                        resovle()
                    })
                })) */
        }
        //resovles()
        /*             Promise.all(obj_arr2).then(() => {
                resovles()
            }) */
        //})
    }
    querydata() {
        return new Promise((resovles) => {
            this.agreeRefuseDelivery_list = []
            let obj_arr = []
            for (let i = 0; i < this.total; i++) {
                obj_arr.push(new Promise((resovle) => {
                    this.pagination((i + 1), this.len).then(data => {
                        console.log("第" + (i + 1) + "页")
                        this.createToast("查询第" + (i + 1) + "页")
                        const list = data.resultList.filter((e) => e.supportActions.includes("agreeRefuseDelivery"))
                        console.log(list)
                        //this.createToast(list)
                        this.agreeRefuseDelivery_list.push(...list)
                        resovle(data.resultList)
                    })
                }))
            }
            Promise.all(obj_arr).then(async values => {
                console.log("页面信息：");
                //this.createToast("页面信息：")
                console.log(values);
                //this.createToast(values)
                resovles()
            })
        })
    }
    querydata_Refund() {//查询已发货仅退款
        return new Promise((resovles, rejects) => {
            let Promise_arr = []
            let Shipped = []//已发货列表
            for (let i = 0; i < this.total; i++) {
                Promise_arr.push(new Promise((resovle, reject) => {
                    this.pagination(i + 1, this.len).then(data => {
                        const list = data.resultList.filter(e => e.expressLatestTraceState == "已发货")
                        Shipped.push(...list)
                        resovle()
                    }).catch(e => reject())
                }))
            }
            Promise.all(Promise_arr).then(e => {
                resovles(Shipped)
            }).catch(e => rejects())
        })
    }
    query_logistics(data) {//查询物流
        return new Promise((resovle, reject) => {
            fetch(`https://s.kwaixiaodian.com/rest/pc/aftersales/schema/refund/logistics/detail?refundId=${data.refundId}&expressCompanyCode=${data.expressCompanyCode}&expressNo=${data.expressNo}&reverseLogistics=${data.reverseLogistics}&logisticsTypeCode=${data.logisticsTypeCode}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                },
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            }).then(e => e.json()).then(e => {
                if (e.result === 1) {
                    //console.log(e.data.modules.logisticsDetailStep.data.itemList[0])
                    resovle(e.data.modules.logisticsDetailStep.data.itemList[0])
                } else reject()
            })
        })
    }
    aree_Refund(list) {//同意退款
        return new Promise((resovle, reject) => {
            let obj_obj = {
                "sellerApproveRefundParamList": []
            }
            for (const e of list) {
                const qqq = {
                    "refundId": e.refundId,
                    "refundHandlingWay": e.handlingWay,
                    "refundAmount": e.refundFee,
                    "status": e.refundStatus,
                    "negotiateStatus": e.negotiateStatus
                }
                obj_obj.sellerApproveRefundParamList.push(qqq)
            }
            const obj = {
                "approveParam": JSON.stringify(obj_obj)
            }
            fetch("https://s.kwaixiaodian.com/rest/app/tts/ks/seller/refund/order/batchApproveRefund/v2", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "content-type": "application/json",
                },
                "body": JSON.stringify(obj),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e => e.json()).then(e => {
                if (e.result) {
                    resovle(e.resultList)
                } else {
                    console(e)
                    alert("确定退款失败，请勿动浏览器并联系作者")
                    reject(e)
                }
            })
        })
    }
    pagination(number, len) {//0拒收后退款  1无物流仅退款   2已拒签退款或退货退款
        return new Promise((resovle, reject) => {
            let data
            if (this.types === 0) {//0拒收后退款
                data = {
                    "boolCondition": [],
                    "handlingWay": 10,
                    "limit": len,
                    "offset": (number - 1) * len,
                    "orderViewStatus": 3,
                    "sortWay": 2,
                    "type": 1
                }
            } else if (this.types === 1) {//1无物流仅退款 
                data = {
                    "boolCondition": [],
                    "handlingWay": 10,
                    "limit": len,
                    "offset": (number - 1) * len,
                    "orderViewStatus": 3,
                    "sortWay": 2,
                    "type": 1
                }
            } else if (this.types === 2) {//2已拒签退款或退货退款
                data = {
                    "boolCondition": [],
                    "limit": len,
                    "offset": (number - 1) * len,
                    "sortWay": 2,
                    "type": 1
                }
            }
            fetch("https://s.kwaixiaodian.com/rest/pc/aftersales/schema/refund/list/pagination",
                {
                    "headers": {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "content-type": "application/json",
                    },
                    "body": JSON.stringify(data),
                    "method": "POST",
                }
            ).then(e => e.json()).then(v => {
                if (v.result == 1) {
                    if (v.data.total == 0) {
                        alert("列表暂无订单")
                        reject()
                    }
                    console.log(v.data)
                    resovle(v.data)
                } else {
                    alert("获取列表失败")
                    reject()
                }
            })
        })
    }
    querydata_rejection() {//查询拒收的订单
        return new Promise((resovles, rejects) => {
            let Promise_arr = []
            let Shipped = []//已发货列表
            for (let i = 0; i < this.total; i++) {
                Promise_arr.push(new Promise((resovle, reject) => {
                    this.pagination(i + 1, this.len).then(data => {
                        const list = data.resultList.filter(e => e.expressLatestTraceState == "退回中" || e.expressLatestTraceState == "已退签" || e.expressLatestTraceState == "已签收")
                        Shipped.push(...list)
                        resovle()
                    }).catch(e => reject())
                }))
            }
            Promise.all(Promise_arr).then(e => {
                resovles(Shipped)
            }).catch(e => rejects())
        })
    }
    agreeRefuseDelivery(refundId) {
        return new Promise((resovle) => {
            fetch("https://s.kwaixiaodian.com/rest/pc/aftersales/refund/agreeRefuseDelivery", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "content-type": "application/json",
                },
                "body": `{"refundId":${refundId}}`,
                "method": "POST",
            }).then(e => e.json()).then(v => resovle(v))
        })
    }
    createToast(txt) {
        if (document.getElementById('toast')) {
            if (document.getElementById('toast').children[0].innerText.split('\n').length < 30) {
                document.getElementById('toast').children[0].innerText += "\n" + txt
            } else {
                document.getElementById('toast').children[0].innerText =
                    document.getElementById('toast').children[0].innerText.split('\n').slice(1).join('\n') + "\n" + txt
            }
        } else {
            let html = `<div style="
         position: fixed;
         top: 20px;
         background: #fff;
         padding:24px 40px;
         left: calc(50% - 150px);
         text-align: center;
         border-radius: 8px;z-index:9999999;box-shadow:0 0 5px 1px #999">${txt}</div>`
            let ele = document.createElement('div')
            ele.id = 'toast'
            ele.innerHTML = html
            document.body.appendChild(ele)
        }
        this.timeid
        if (this.timeid) clearTimeout(this.timeid)
        this.timeid = setTimeout(() => {
            if (document.getElementById('toast')) {
                document.getElementById('toast').remove()
            }
        }, 5000)
    }
}

async function Refund_after_refusal() {//已拒收退款
    var agree = new Agree(2);
    agree.createToast("开始查询")
    await agree.query()
    if (agree.total) {
        console.log("共有" + agree.total + "页")
        agree.createToast("共有" + agree.total + "页")
        let Shipped = await agree.querydata_rejection()
        if (Shipped) {
            console.log("Shipped", Shipped)
            if (Shipped.length == 0) {
                alert("暂无符合条件的订单")
                return
            }
            let list = []
            let list1 = Shipped.filter(e => e.expressLatestTraceState == "退回中" || e.expressLatestTraceState == "已退签")
            if (list1.length) {
                list.push(...list1)
            }
            let list2 = Shipped.filter(e => e.expressLatestTraceState == "已签收")
            if (list2.length) {
                for (const e of list2) {
                    agree.createToast("正在查询订单号：" + e.refundId + "-----物流号：" + e.expressNo)
                    const value = await agree.query_logistics(e)
                    if (value.desc.includes("退件") || value.desc.includes("退回")) {
                        list.push(e)
                    }
                }
            }
            console.log("list", list)
            if (list.length == 0) {
                alert("暂无符合条件的订单")
                return
            }
            if (!confirm("订单查询完毕，共有 " + list.length + "个订单需要处理\n点击确定开始批量退款并复制单号")) {
                return
            }
            agree.aree_Refund(list).then(e => {
                const expressNo = list.map(e => "订单编号：\t" + e.orderId + "\t物流单号：\t" + e.expressNo).toString().replace(/[,]/g, "\n")
                agree.createToast(expressNo)
                GM_setClipboard(expressNo)
                alert("已确认退款完成，物流单号已复制到剪贴板,请注意保存")
            }).catch(e => {
                alert(e)
            })
        }
    }
}

async function Nologistics_Refund() {//未发货仅退款
    let time = prompt("剩余时间小于多少小时的订单")
    if (time === null) {
        return
    }
    if (time === "") {
        alert("不能为空")
        return Nologistics_Refund()
    }
    if (isNaN(time)) {
        alert("必须为数字")
        return Nologistics_Refund()
    }
    if (!confirm("开始执行，过程中需花费几秒到几分钟不等，订单越多时间越久，请耐心等待")) {
        return
    }
    var agree = new Agree(1);
    agree.createToast("开始查询")
    await agree.query()
    if (agree.total) {
        console.log("共有" + agree.total + "页")
        agree.createToast("共有" + agree.total + "页")
        let Shipped = await agree.querydata_Refund()
        if (Shipped) {
            console.log("Shipped", Shipped)
            Shipped = Shipped.filter(e => e.expireTime && (e.expireTime <= Date.now() + 1000 * 60 * 60 * time))
            if (Shipped.length == 0) {
                alert("暂无符合条件的订单")
                return
            }
            console.log("Shipped", Shipped)
            agree.createToast("共有" + Shipped.length + "个已发货订单待查询物流")
            const list = []
            for (const e of Shipped) {
                agree.createToast("正在查询订单号：" + e.refundId + "-----物流号：" + e.expressNo)
                if ((await agree.query_logistics(e)).title == "未获取到物流轨迹，请复制单号自行查询") {
                    list.push(e)
                }
            }
            console.log("list", list)
            if (list.length == 0) {
                alert("暂无符合条件的订单")
                return
            }
            if (!confirm("订单查询完毕，共有 " + list.length + "个订单需要处理\n点击确定开始批量退款并复制单号")) {
                return
            }
            agree.aree_Refund(list).then(e => {
                const expressNo = list.map(e => "订单编号：\t" + e.orderId + "\t物流单号：\t" + e.expressNo).toString().replace(/[,]/g, "\n")
                agree.createToast(expressNo)
                GM_setClipboard(expressNo)
                alert("已确认退款完成，物流单号已复制到剪贴板,请注意保存")
            }).catch(e => {
                alert(e)
            })
        }
    }
}

async function Process_refund() {//确定拒收后退款
    if (confirm("开始执行，过程中需花费几秒到几分钟不等，订单越多时间越久，请耐心等待")) {
        var agree = new Agree(0);
        console.clear();
        console.time("总耗时(毫秒)")
        console.log("正在查询订单信息")
        agree.createToast("开始查询")
        console.time("查询耗时")
        await agree.query()
        if (agree.total) {
            console.log("共有" + agree.total + "页")
            agree.createToast("共有" + agree.total + "页")
            await agree.querydata()
            console.timeEnd("查询耗时")
            agree.createToast("查询完成")
            if (agree.agreeRefuseDelivery_list.length) {
                console.log("需处理的订单：");
                console.log(agree.agreeRefuseDelivery_list);
                //agree.createToast(agree.agreeRefuseDelivery_list)
                if (confirm("共有" + agree.agreeRefuseDelivery_list.length + "个\n点击确定开始处理")) {
                    console.time("确认订单耗时")
                    await agree.start()
                    console.log("任务结束")
                    agree.createToast("任务结束")
                    console.timeEnd("确认订单耗时")
                    console.timeEnd("总耗时(毫秒)")
                    if (!agree.err_length) alert("任务结束")
                    else alert("还剩" + agree.err_length + "个失败，请再试一次")
                }
            } else alert("暂无待处理订单")
        } else alert("暂无待处理订单")
    }
}

function stop(time) {
    return new Promise((resovle) => {
        setTimeout(() => {
            console.log("暂停" + time + "秒")
            resovle()
        }, time)
    })
}
function limitOrder() {//查询限单
    return new Promise((resovle) => {
        fetch("https://s.kwaixiaodian.com/rest/pc/hestia/performance/review/mainpage", {
            "headers": {
                "accept": "application/json;charset=UTF-8",
                "accept-language": "zh-CN,zh;q=0.9",
            },
            "body": null,
            "method": "POST",
        }).then(e => e.json()).then(v => {
            if (v.result === 1) {
                resovle(v.data)
            } resovle()
        })
    })
}


function get_Learning_List(id) {//获取课程列表
    let categoryId = id ? "categoryId=" + id + "&" : "";
    return new Promise((resovle) => {
        fetch(`https://s.kwaixiaodian.com/rest/pc/ecologic/themis/punishhub/learnRule/courseList?${categoryId}roleType=2`, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9",
            },
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json()).then(v => {
            if (v.result === 1) {
                resovle(v.data.courseInfoList)
            } else resovle(false)
        })
    })
}

function query_Learning_state(courseId) {//查询课程进度
    return new Promise((resovle) => {
        fetch(`https://s.kwaixiaodian.com/rest/pc/ecologic/themis/punishhub/learnRule/courseDetail?courseId=${courseId}&roleType=2`, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9",
            },
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json()).then(v => {
            console.log(v)
            if (v.result === 1) resovle(v.data)
            else resovle(false)
        })
    })
}
function learn_study(courseId, chapterId) {//完成学习
    return new Promise((resovle) => {
        fetch(`https://s.kwaixiaodian.com/rest/pc/ecologic/themis/punishhub/learnRule/chapterLearnComplete?courseId=${courseId}&chapterId=${chapterId}&roleType=2`, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9",
            },
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json()).then(v => {
            console.log(v)
            if (v.result === 1) resovle(v)
            else resovle(false)
        })
    })
}
function into_learn(courseId) {//进入学习状态
    return new Promise((resovle) => {
        fetch(`https://s.kwaixiaodian.com/rest/pc/ecologic/themis/punishhub/learnRule/courseLearn?courseId=${courseId}&roleType=2`, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9",
            },
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json()).then(v => {
            console.log(v)
            if (v.result === 1) resovle(v)
            else resovle(false)
        })
    })
}
function quer_questionnaire(questionnaireId) {//查询考题
    return new Promise((resovle) => {
        fetch(`https://s.kwaixiaodian.com/rest/pc/ecologic/questionnaire/query?questionnaireId=${questionnaireId}`, {
            "headers": {
                "accept": "application/json;charset=UTF-8",
                "accept-language": "zh-CN,zh;q=0.9",
            },
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json()).then(v => {
            console.log(v)
            if (v.result === 1) resovle(v.data.questionList)
            else resovle(false)
        })
    })
}
function quer_study(courseId) {//查询下一步
    return new Promise(async (resovle) => {
        fetch(`https://s.kwaixiaodian.com/rest/pc/ecologic/themis/punishhub/learnRule/chapterLearnComplete?courseId=${courseId}&roleType=2`, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9",
            },
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json()).then(v => {
            console.log(v)
            if (v.result === 1) resovle(v)
            else resovle(false)
        })
    })
}
function submit(questionnaireId, answerList) {//提交试卷
    return new Promise(async (resovle) => {
        fetch("https://s.kwaixiaodian.com/rest/pc/ecologic/questionnaire/submit", {
            "headers": {
                "accept": "application/json;charset=UTF-8",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json;charset=UTF-8",
                "merchantsessionkey": await getKey(),
            },
            "body": JSON.stringify(answerList),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json()).then(v => {
            console.log(v)
            if (v.result === 1) resovle(v)
            else resovle(false)
        })
    })
}

async function learn() {
    const id1 = [null, 19, 20];
    let categoryList = []
    for (let id of id1) {
        const data = await get_Learning_List(id)
        if (data) categoryList.push(...data)
        else break;
    }
    //console.log(categoryList)
    let learn_list = []
    if (categoryList[0]) {
        for (let list of categoryList) {
            const state = await query_Learning_state(list.courseId)
            if (state) {
                if (state.learnStatus != 5) learn_list.push(state)
            } else break;
        }
    } else return
    console.log(learn_list)
    if (learn_list[0]) {
        for (let list of learn_list) {
            console.log(11111111111)
            console.log(list)
            if (list.learnStatus == 1) {
                await into_learn(list.courseId)
            }
            for (let chapterInfo of list.chapterInfoList) {
                console.log(222222222222222)
                console.log(chapterInfo)
                if (chapterInfo.status === 1) break;
                if (chapterInfo.type == 1) {
                    const qqq = await learn_study(list.courseId, chapterInfo.chapterId)
                    if (qqq) {
                        console.log(list + "完成学习")
                        //return后续删除 目的只执行一次
                    }
                } else if (chapterInfo.type == 2) {
                    let questionnaireId, extraInfo
                    console.log("chapterInfo=")
                    console.log(chapterInfo)
                    if (chapterInfo.questionUrl != "") {
                        questionnaireId = chapterInfo.questionUrl.match(/(?<=\/)\d+(?=\?)/g)[0]
                        extraInfo = chapterInfo.questionUrl.match(/punishLearnRule_\d+/g)[0]
                    } else {
                        console.log(3333333333333333333)
                        const www = await quer_study(list.courseId)
                        if (www) {
                            questionnaireId = www.data.questionUrl.match(/(?<=\/)\d+(?=\?)/g)[0]
                            extraInfo = www.data.questionUrl.match(/punishLearnRule_\d+/g)[0]
                        } else break;
                    }
                    console.log("questionnaireId=" + questionnaireId)
                    const questionList = await quer_questionnaire(questionnaireId)
                    if (questionList[0]) {
                        const answerList = answer(questionList, questionnaireId, extraInfo)
                        const state = await submit(questionnaireId, answerList)
                        if (!state) return
                        //return后续删除 目的只执行一次
                    } else return
                } else break;

            }
        }
        alert("执行结束")
    } else return
}


function get_questionnaireId(url) {
    return new Promise(resovle => {
        GM_xmlhttpRequest({
            method: 'get',
            url: url,
            responseType: 'json',
            onload: (e) => {
                console.log(e)
                if (e.status === 200) {
                    console.log(e.finalUrl.match(/(?<=\/)\d+/g)[0])
                    resovle(e.finalUrl.match(/(?<=\/)\d+/g)[0])
                } resovle()
            }
        })
    })
}
async function Unlimit() {
    const limit = await limitOrder()
    if (limit) {
        const questionnaireId = await get_questionnaireId(limit.examUrl)
        if (questionnaireId) {
            const questionList = await quer_questionnaire(questionnaireId)
            if (questionList[0]) {
                const answerList = answer(questionList, questionnaireId, "")
                const q = await submit(questionnaireId, answerList)
                if (q) alert("解除限制成功")
            }
        }
    }
}