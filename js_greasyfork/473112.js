// ==UserScript==
// @name         彩票开奖历史数据下载神器，随机生成下期数据
// @namespace    wzs.com
// @version      4.1.1
// @description  在彩票历史开奖页面(http://www.cwl.gov.cn/ygkj/wqkjgg/ssq/)添加了一个下载数据按钮和一个随机生成下期号码按钮，如截图所示
// @author       1440972474@qq.com
// @match        https://www.cwl.gov.cn/ygkj/wqkjgg/ssq/*
// @icon         https://www.cwl.gov.cn/images/logo-top.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473112/%E5%BD%A9%E7%A5%A8%E5%BC%80%E5%A5%96%E5%8E%86%E5%8F%B2%E6%95%B0%E6%8D%AE%E4%B8%8B%E8%BD%BD%E7%A5%9E%E5%99%A8%EF%BC%8C%E9%9A%8F%E6%9C%BA%E7%94%9F%E6%88%90%E4%B8%8B%E6%9C%9F%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/473112/%E5%BD%A9%E7%A5%A8%E5%BC%80%E5%A5%96%E5%8E%86%E5%8F%B2%E6%95%B0%E6%8D%AE%E4%B8%8B%E8%BD%BD%E7%A5%9E%E5%99%A8%EF%BC%8C%E9%9A%8F%E6%9C%BA%E7%94%9F%E6%88%90%E4%B8%8B%E6%9C%9F%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==
 
 
 
 
(function() {

  
    let a=document.querySelector("body > div.main > div > div > div.ygkj_wqkjgg > div > div.body-content-item > div.table-hea > div > span")
    let btn=document.createElement("button")


    let tab=document.querySelector("body > div.main > div > div > div.ygkj_wqkjgg > div > div.body-content-item > div.table.ssq")

    let div=document.createElement("div")



    let btn2=document.createElement("button")
    btn2.innerText="随机下期"
    btn2.setAttribute("id","rangen")

    div.appendChild(btn2)

    let spa=document.createElement("span")
    div.appendChild(spa)




    tab.parentNode.insertBefore(div,tab)



    btn.innerText="下载数据"
    btn.setAttribute("id","downData")
    a.parentNode.insertBefore(btn,a)


       btn2.addEventListener("click",()=>{
       let res=genRandonResult()
       let span=div.querySelector("span")
       span.innerText=res.join(",")

        // console.log(res)
    })




    btn.addEventListener("click",async function(){


        // console.log("点击了按钮",data3)



        let endPage=document.querySelector("#layui-laypage-1 > a.layui-laypage-next").previousSibling.innerText//最后一页

        console.log("最后一页",+endPage)

        let results=[]

        for (let i=1;i<+endPage+1;i++){

            console.log(`正在下载${i}页`)

            let a= await fetch(`https://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=ssq&pageNo=${i}&pageSize=30&systemType=PC`, {
                "headers": {
                  "accept": "application/json, text/javascript, */*; q=0.01",
                  "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                  "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://www.cwl.gov.cn/ygkj/kjgg/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
              }).then(res=>res.json())


              results=[...results,...a.result.map(item=>{
                return {
                    code:item.code,
                    date:item.date,
                    red1:item.red.split(",")[0],
                    red2:item.red.split(",")[1],
                    red3:item.red.split(",")[2],
                    red4:item.red.split(",")[3],
                    red5:item.red.split(",")[4],
                    red6:item.red.split(",")[5],
                    blue:item.blue
                }
            })]

        }




        console.log("json数据",results)
        jsonToExcel(results, "期号,开奖日期,红1,红2,红3,红4,红5,红6,蓝","彩票开奖数据2023")

    })
 

    // Your code here...
})();




/**
 * 导出 json 数据为 Excle 表格
 * @param {json} data 要导出的 json 数据
 * @param {String} head 表头, 可选 参数示例：'名字,邮箱,电话'
 * @param {*} name 导出的文件名, 可选
 */
function jsonToExcel(data, head, name = '导出的文件名') {
    let str = head ? head + '\n' : '';
    data.forEach(item => {
    	// 拼接json数据, 增加 \t 为了不让表格显示科学计数法或者其他格式
        for(let key in item) {
            str = `${str + item[key] + '\t'},`
        }
        str += '\n'
    });
    console.log(str)
    // encodeURIComponent解决中文乱码
    const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
     // 通过创建a标签实现
     const link = document.createElement("a");
     link.href = uri;
     // 对下载的文件命名
     link.download = `${name + '.csv'}`;
     link.click();
}




function genRandonResult(){
    let arr=[]
let arr2=[]
for(let i=1;i<34;i++){
    arr.push(i)
}

for(let i=1;i<17;i++){
    arr2.push(i)
}

// console.log(arr,arr2)

let ressult=""
let res=[]
for(let i=0;i<6;i++){



    let index=Math.floor(Math.random()*arr.length)

    res.push(arr[index])
    arr.splice(index,1)






}




let index2=Math.floor(Math.random()*7)

res=res.sort((a,b)=>{
    return a-b
})

res.push(arr2[index2])


return res


}





