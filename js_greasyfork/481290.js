// ==UserScript==
// @name        方案系统增强
// @namespace   cscec5b3.SchemeSystemEnhancement
// @match       https://bip.cscec5b.com.cn/mdf-node/meta/Voucher*
// @grant       none
// @version     1.5
// @author      chzq@cscec5b3
// @description 2023/10/26 16:00:12
// @require    https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/481290/%E6%96%B9%E6%A1%88%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/481290/%E6%96%B9%E6%A1%88%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

setTimeout(Act, 4000)
setTimeout(CatchEsc, 10000)

function CatchEsc() {
    if ($(':contains(方案编审详情)').length != 0) {
        document.addEventListener("keyup", function(event) {
            if (event.key == 'Escape') {
                event.stopImmediatePropagation()
                event.stopPropagation()
                event.preventDefault()
                console.log('Catch Esc')
            }
        })
    }
}

function Act() {
    a = 0
    content = ""
    t = setInterval(Check, 2000)
    if (a == 5) {
        clearInterval(t)
    }
}

function Check() {
    CheckDate()
    CheckBureau()
    alert(content)
}

function CheckDate() {
    if ($(':contains(方案编审详情)').length != 0) {
        show()
        clearInterval(t)
    } else {
        if ($(':contains(方案编审列表)').length != 0) {
            alert("这是方案编审列表页")
            clearInterval(t)
        } else {
            a = a + 1
        }

    }
}

function show() {
    fanganCate = $("div[id$='scheme_category']").find(".text-wrapper").text()
    updataDate =new Date($("div[class^='start-wrapper branch-repeatitem ']").find(".history-task-bottom").text())
    //updataDate = new Date("2023-" + ($("div[class^='start-wrapper branch-repeatitem ']")).find(".history-task-bottom").text())
    //updataDate.setHours(1)
    //updataDate.setMinutes(0)
    //updataDate.setSeconds(0)
    startDate = new Date($("div[id$='implement_start_time']").find(".text-wrapper").text())
    console.log(updataDate)
    console.log(startDate)
    date = Math.floor((startDate - updataDate) / (86400 * 1000))
    content += "方案等级为" + fanganCate + "，" + "提前报审" + date + "天。\r\n"

}

function CheckBureau() {
    var ProjectsList = [
        "中国建筑第五工程局有限公司天津地铁7号线一期工程6标项目经理部",
        "公安监管中心项目（三公司以局名义）",
        "公安监管中心项目",
        "天津嘉里中心二期项目总承包工程（三公司以局名义）",
        "天津嘉里中心二期项目总承包工程",
        "高新区电子芯片研发平台基础设施项目（以局名义）",
        "高新区电子芯片研发平台基础设施项目",
        "国家自主创新示范区—智芯港·滨海创新创业平台基础设施项目-西地块新建项目",
        "智芯港",
        "滨海高新区智能制造产业园工程项目",
        "海尔智造·未来创新中心项目",
        "海尔智造",
        "未来创新中心项目",
        "天津设计之都核心区柳林街区城市更新一期项目70号地块工程",
        "柳林",
        "金茂",
        "金茂天津东丽1、3号地项目施工总承包工程",



    ];
    IsChooseBureauControlText = $("div[id$='is_bureau_undertake']").find(".text-wrapper").text()
    var IsChooseBureauControl
    if (IsChooseBureauControlText == "是") {
        IsChooseBureauControl = true
    } else {
        IsChooseBureauControl = false
    }
    ProjectName = $("div[id$='project_vname']").find(".text-wrapper").text()
    var IsContain = ProjectsList.some(function(str) {
        return ProjectName.includes(str)
    })
    if (!IsChooseBureauControl && IsContain) {
        content += "以五局名义承接，系统中未选择正确。\r\n"
    }
    if (IsChooseBureauControl && IsContain) {
        content += "以五局名义承接，选择正确。\r\n"
    }


}