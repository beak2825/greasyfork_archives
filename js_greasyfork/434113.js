// ==UserScript==
// @name         裁决文书网自动脚本
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  自动搜索，自动保存搜索结果为PDF，命名：公司名.pdf
// @author       zh1q1
// @match        https://wenshu.court.gov.cn/website/wenshu/181217BMTKHNT2W0/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAABpElEQVR4nO3Vv2uUQRDG8c/ebSMWqay0trATAxrUSi1S2AiWFoJYpNCgoBjURsHWJKeNRfAvsDgFixQqKdPZ2ViEiCJYBOQu8f1hEXO59713j7MUfLZ6d2a/O8vMO0OzDnin9Ku2Mjvuaw07xgSAYEVXe2indMhj92zpKJLnBhF8MDeye9hn6zbN70eRiqCw02Bra3up8BBLu1FEBxsBucXqW4csz0ULe4jorSCMuPU89boRELDMHiI6Y8V65bbCUTccc70RkaOwKLOg0IkyXa9qTjOu2LAs6NZuD86hrdTyxRNTkUqqdhXlHrngGRVEZsMpJwex9DxIZSHYclesIb65LCoHgIs66UJq6btDBZHZrPh8V6YBOX66LbOkTGckBYimBW2FVTNeuOZNyrFJ236Yl4NSy5SbVm1PDvhodqgyMledTdRlAtDzqfL9tfkwUtyaRkv9LwFj9B/w7wPycXOhqlJ0yZHKPChMi5MCiM47XhsopbVJAUHfrYbmN/EToN+02eLPfz9OYyZhFJzW1Jn3lTsxaKQjCkp52jy45r1ZvSbTb9M0d4PBozGZAAAAAElFTkSuQmCCeye9
// @grant        none
// @note    2021.10-19-V1.0 支持一键导入xlsx文件
// @note    2021.10-19-V1.1 静默保存PDF
// @note    2021.10-21-V1.2 新增PDF页头页尾
// @downloadURL https://update.greasyfork.org/scripts/434113/%E8%A3%81%E5%86%B3%E6%96%87%E4%B9%A6%E7%BD%91%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434113/%E8%A3%81%E5%86%B3%E6%96%87%E4%B9%A6%E7%BD%91%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var search_input = null;
    var search_btn = null;
    var i = 0;

    //搜索列表
    var company_array = [];

    //create_open_div();
    import_scripr();
    create_modal();
    create_xlsx();

    var TestDiv = document.createElement('div');
    TestDiv.innerHTML = 'TEST'
    TestDiv.style.position = "absolute";
    TestDiv.style.top = "80px";
    TestDiv.style.left = "30px";
    TestDiv.style.border = "1px solid blue"
    TestDiv.style.display = "none"
    TestDiv.addEventListener("click", function(){ pdfMap() })
    document.body.appendChild(TestDiv)


    var modal = document.querySelector(".modal");

    function import_scripr() {
        var xlsxJs = document.createElement('script');
        xlsxJs.src="https://cdn.staticfile.org/xlsx/0.15.1/xlsx.core.min.js";
        document.body.appendChild(xlsxJs)

        var canvasJs = document.createElement('script');
        canvasJs.src="https://html2canvas.hertzen.com/dist/html2canvas.min.js";
        document.body.appendChild(canvasJs)

        var pdfJs = document.createElement('script');
        pdfJs.src="https://unpkg.com/jspdf@1.5.3/dist/jspdf.min.js";
        document.body.appendChild(pdfJs)

        var fontJs = document.createElement('script');
        fontJs.src="https://cdn.jsdelivr.net/npm/vxe-table-plugin-export-pdf/fonts/source-han-sans-normal.js";
        document.body.appendChild(fontJs)
    }

    //导入xlsx
    function create_xlsx() {
        /*         var meta = document.createElement('meta');
        meta.setAttribute("http-equiv", "Content-Security-Policy");
        meta.setAttribute("content", "upgrade-insecure-requests");
        document.querySelector("head").insertBefore(meta, document.querySelector("head").firstElementChild) */
        /*         var xlsxJs = document.createElement('script');
        xlsxJs.src="https://cdn.staticfile.org/xlsx/0.15.1/xlsx.core.min.js";
        document.body.appendChild(xlsxJs) */
        var importFile = document.createElement('input');
        importFile.style.position = "absolute";
        importFile.style.top = "50px";
        importFile.style.left = "30px";
        importFile.style.border = "1px solid red"
        importFile.setAttribute("type", "file");
        importFile.setAttribute("class", "file");
        importFile.addEventListener("change", function() {
            //console.log(document.querySelector(".file"))
            var obj = document.querySelector(".file");
            //alert("change")
            if(!obj.files) return
            // alert(obj.files[0].name);文件名
            var f = obj.files[0];
            var reader = new FileReader();

            reader.onload = function(e) {
                var data = e.target.result;
                var wb = XLSX.read(data, {
                    type: 'binary' //以二进制的方式读取
                });

                var sheet0=wb.Sheets[wb.SheetNames[0]];//sheet0代表excel表格中的第一页
                var str=XLSX.utils.sheet_to_json(sheet0);//利用接口实现转换。
                var templates=new Array();
                var str1=obj.files[0].name;
                templates=str1.split(".");//将导入文件名去掉后缀
                company_array = str.map((item) => item["名称"])
                console.log("导入的企业清单：", JSON.stringify(company_array))
                console.log("导入文件长度：", company_array.length)
                var isOpen = window.confirm(`检测到 ${company_array.length} 条数据，是否开启脚本？`)
                if(isOpen) {
                    obj.style.display = "none"
                    search()
                }
                //alert(JSON.stringify(str));
                //window.localStorage.setItem(templates[0],JSON.stringify(str))//存入localStorage 中

            }
            reader.readAsBinaryString(f);
        })
        document.body.appendChild(importFile)
    }

    function create_open_div() {
        var spModel = false;
        var innerText = "⚠ CLICK OPEN JS"
        var sp_bt = document.createElement('div');
        sp_bt.innerHTML = innerText
        sp_bt.style.position = "absolute";
        sp_bt.style.top = "40px";
        sp_bt.style.left = "30px";
        sp_bt.style.fontSize = "18px";
        sp_bt.style.color = "red";
        sp_bt.style.borderBottom = "1px solid red";
        sp_bt.setAttribute("class", "sp_bt");
        sp_bt.style.cursor = "grab";
        document.body.appendChild(sp_bt)
        sp_bt.addEventListener("click", function(){
            spModel = !spModel
            if(spModel) {
                innerText = "⚠ CLICK CLOSE JS"
                sp_bt.innerHTML = innerText
                search()
            }
            else {
                clearSearch()
                setTimeout(function(){
                    innerText = "⚠ CLICK OPEN JS"
                    sp_bt.innerHTML = innerText
                },0)
                //window.location.reload()
            }
        })
    }

    function create_modal() {
        var modal = document.createElement('div');
        var text = document.createElement('div');
        modal.style.backgroundColor= "rgba(0, 0, 0, 0.5)";
        modal.style.zIndex = "999";
        modal.style.position = "absolute";
        modal.style.top = "0";
        modal.style.height = "100%";
        modal.style.width = "100%";
        modal.style.display = "none";
        modal.setAttribute("class", "modal");
        text.innerHTML = "正在加载中..."
        text.style.textAlign = "center";
        text.style.fontSize = "18px";
        text.style.marginTop = "30%";
        text.style.color = "white";
        modal.appendChild(text)
        document.body.appendChild(modal)
    }

    function search() {
        console.group('当前公司名：', i, company_array[i])
        // 先清除原来的列表记录、搜索条件
        var LM_list = document.querySelectorAll(".LM_list")
        //console.log(LM_list)
        if(LM_list.length) {
            console.log("正在清除列表记录 start")
            LM_list.forEach(function(item) {
                item.remove()
            })
            console.log("正在清除列表记录 end")
        }
        if(document.querySelector(".con_right")) document.querySelector(".con_right").remove()
        openModal();
        setTimeout(function(){
            //填充并搜索
            document.querySelector(".searchKey").value = company_array[i];
            document.querySelector(".search-rightBtn").click();
            watchCallBack();
        })
    }

    /*
     侦听：当搜索结果返回并渲染到页面时，打印PDF
    */
    function watchCallBack() {
        var isCallBack = false;
        var interVal = null;
        console.log("侦听结果返回 start");
        interVal = setInterval(function(){
            //console.log(document.querySelector(".con_right"))
            isCallBack = !!document.querySelectorAll(".LM_list").length || !!document.querySelector(".con_right")
            console.log("搜索结果是否已返回：", isCallBack)
            if(isCallBack) {
                clearInterval(interVal);
                closeModal();
                console.log("准备打印");
                //pdfMap();
                //window.print();
                setTimeout(function(){ pdfMap();}, 0)
            }
        },1000)
    }

    function clearSearch() {
        console.log("清除搜索条件")
        var clear_btn = document.querySelector("#clear-Btn");
        //openModal();
        setTimeout(function(){ clear_btn.click(); })
    }

    /*
     打开遮罩
    */
    function openModal() {
        modal.style.display = "block";
        window.addEventListener("mousewheel", function(){});
        return true
    }

    /*
     关闭遮罩
    */
    function closeModal() {
        modal.style.display = "none";
        window.removeEventListener("mousewheel", function(){})
    }

    function pdfMap() {
        html2canvas(document.body).then(canvas => {
            //document.body.appendChild(canvas)
            // var contentWidth = canvas.width;
            // var contentHeight = canvas.height;
            // var pageHeight = contentWidth / 595.28 * 841.89;  //一页pdf显示html页面生成的canvas高度;
            // var leftHeight = contentHeight;  //未生成pdf的html页面高度
            // var position = 10;  //pdf页面偏移
            // //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
            // var imgWidth = 555.28;
            // var imgHeight = 555.28 / contentWidth * contentHeight;
            // var pageData = canvas.toDataURL('image/jpeg', 1.0);
            // console.log(pageData);
            // return
            // var pdf = new jsPDF('', 'pt', 'a4');
            // pdf.addFont('SourceHanSans-Normal.ttf', 'SourceHanSans-Normal', 'normal');
            // pdf.setFont('SourceHanSans-Normal');
            // pdf.setFontSize(6)
            // //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
            // //当内容未超过pdf一页显示的范围，无需分页
            // if (leftHeight < pageHeight) {
            //     pdf.text(20, 10, formatDate())
            //     pdf.text(280, 10, company_array[i] || 'TEST')
            //     pdf.text(20, 835, window.location.href)
            //     pdf.addImage(pageData, 'JPEG', 20, 15, imgWidth, imgHeight);
            // } else {
            //     while (leftHeight > 0) {
            //         pdf.text(20, 10, formatDate())
            //         pdf.text(280, 10, company_array[i] || 'TEST')
            //         pdf.text(20, 835, window.location.href)
            //         pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight - 500)
            //         leftHeight -= pageHeight;
            //         position -= 841.89;
            //         //避免添加空白页
            //         if (leftHeight > 0) {
            //             pdf.addPage();
            //         }
            //     }
            // }
            // pdf.save(`${company_array[i]}.pdf`);

            // v1.4
            var contentWidth = canvas.width;
            var contentHeight = canvas.height;
            //一页pdf显示html页面生成的canvas高度;
            var pageHeight = contentWidth / 595.28 * 841.89;
            //console.log(`canvas总高度：${contentHeight}, 一页渲染的高度：${pageHeight}`);

            var ctx = canvas.getContext("2d");
            // 裁剪- （获得像素数据）宽度跟原图一致，高度只截取一页pdf的渲染高度
            //var imgRgbData = ctx.getImageData(0, 0, contentWidth, pageHeight);
            // 新canvas控件- 保存裁剪后的图片
            var newCanvas = document.createElement("canvas");
            var newCtx = newCanvas.getContext("2d");
            // 把裁剪后的像素数据渲染到新canvas
            newCanvas.setAttribute("width", contentWidth)
            newCanvas.setAttribute("height", pageHeight)
            //newCtx.putImageData(imgRgbData, 0, 0)
            // document.body.appendChild(newCanvas)
            //console.log(newCanvas);
            // 获取裁剪后图片的base64数据
            //var imgBase64 = newCanvas.toDataURL("image/jpeg", 1.0)
            // 渲染pdf start
            // 定义插入图片的宽高，高度要等比例缩放
            var renderImgWidth = 570.28; // 根据pdf页面宽度决定
            // 固定的图片宽度 除以 渲染的canvas宽度 得出 宽度缩放比例，根据这个比例 乘以 渲染的canvas高度 得出 图片实际的高度
            // var renderImgHeight = (570.28 / contentWidth) * pageHeight;
            var renderImgHeight = null;
            // 截取图片高度偏移值
            var positionTop = 0;

            var doc = new jsPDF('', 'pt', 'a4');
            doc.addFont('SourceHanSans-Normal.ttf', 'SourceHanSans-Normal', 'normal');
            doc.setFont('SourceHanSans-Normal');
            doc.setFontSize(6)
            // for改造
            var pageSize = Math.ceil(contentHeight / pageHeight)
            console.log('计算分页数：', pageSize);
            for (let p = 0; p < pageSize; p++) {
                // 根据canvas高度动态变化
                renderImgHeight = (renderImgWidth / contentWidth) * ((contentHeight - positionTop) > pageHeight ? pageHeight : contentHeight - positionTop)
                console.log('打印page', p + 1, '/' + pageSize);
                doc.text(10, 8, formatDate())
                doc.text(280, 8, company_array[i] || 'TEST')
                doc.text(10, 835, window.location.href)
                doc.addImage(cropCanvas(ctx, newCanvas,newCtx, contentWidth, contentHeight, positionTop, pageHeight), 'JPEG', 10, 10, renderImgWidth, renderImgHeight);
                if (p + 1 < pageSize) {
                    doc.addPage()
                    positionTop += pageHeight
                    //renderImgHeight = (renderImgWidth / contentWidth) * ((contentHeight - positionTop) > pageHeight ? pageHeight : contentHeight - positionTop)
                }
            }
            doc.save(`${company_array[i]}.pdf`)

            setTimeout(function(){
                console.log("打印返回");
                if(i++ >= company_array.length - 1) {
                    //document.querySelector('.sp_bt').click();
                    return alert("已操作完毕！");
                }
                else {
                    clearSearch();
                    console.groupEnd()
                    setTimeout(function(){ search(); })
                }
            },0)
        });
    };

    // 裁剪canvas
    function cropCanvas(ctx, newCanvas, newCtx, contentWidth, contentHeight, positionTop, pageHeight) {
        //console.log(contentWidth, contentHeight, positionTop, pageHeight)
        // 裁剪- （获得像素数据）宽度跟原图一致，高度只截取一页pdf的渲染高度
        var imgRgbData = ctx.getImageData(0, positionTop, contentWidth, pageHeight);
        // 把裁剪后的像素数据渲染到新canvas
        newCanvas.setAttribute("width", contentWidth)
        newCanvas.setAttribute("height", (contentHeight - positionTop) > pageHeight ? pageHeight : contentHeight - positionTop)
        newCtx.putImageData(imgRgbData, 0, 0)
        // 获取裁剪后图片的base64数据
        var imgBase64 = newCanvas.toDataURL("image/jpeg", 1.0)
        return imgBase64
    };

    function formatDate() {
        const date = new Date()
        //console.log(date);
        const Y = date.getFullYear() + '/'
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
        const D = (date.getDate()  < 10 ? '0' + (date.getDate() ) : date.getDate() ) + ' '
        const h = date.getHours()
        const m = (date.getMinutes()  < 10 ? '0' + (date.getMinutes() ) : date.getMinutes() )
        const dates = Y + M + D + (h > 12 ? `下午${h - 12}:${m}` : `上午${h}:${m}`)
        console.log(dates)
        return dates
    }
})();