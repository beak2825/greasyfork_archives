// ==UserScript==
// @name 梨视频统计导出
// @namespace Violentmonkey Scripts
// @include      *://v.qq.com/s/videoplus/*
// @grant 梨视频统计导出
// @description       梨视频统计导出1.0
// @require https://greasyfork.org/scripts/414410-xlsx-core-min-js/code/xlsxcoreminjs.js?version=861273
// @version 0.0.1.20201023132315
// @downloadURL https://update.greasyfork.org/scripts/414413/%E6%A2%A8%E8%A7%86%E9%A2%91%E7%BB%9F%E8%AE%A1%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/414413/%E6%A2%A8%E8%A7%86%E9%A2%91%E7%BB%9F%E8%AE%A1%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==


// http://v.qq.com/s/videoplus/329353062


        var odom1 = document.createElement("div");
        odom1.id = "download";
       odom1.style.cssText =
          
       " table {" +
       "     border-collapse: collapse;" +
       "     text-align: center;" +
       "     vertical-align: middle;" +
       "     width: 800px;" +
       "     font-size: 20px;" +
       " }" +
        
       " button {" +
          "  height: 30px;" +
          "  width: 100px;" +
           " margin: 20px 20px;" +
           " background: yellowgreen;" +
          "  border-radius: 10px;" +
          "  outline: none;" +
       " }" +
        
        "input {" +
           " height: 30px;" +
           " padding-left: 10px;" +
           " margin: 10px;" +
        "}" +
    
            "top: 10px;" +
            "left: 10px;" +
            "padding: 10px 40px 10px 40px;" +
            "background: #fff;" +
            "border:1px solid #40A9FF;"+
            "border-radius: 1px;";




   var innerH1 = "" +   
       '<div id="wrap" style="width:900px;margin:20px auto;">'+
       ' <h3>js脚本 导出excel测试</h3>'+
      '  <table id="tb" border="1" cellspacing="0" cellpadding="0">'+
            '<thead>'+
                '<tr>'+
                    '<th>ID</th>'+
                    '<th>姓名'+
                      '  </th><th>年龄'+
                         '   </th><th>座右铭</th>'+
               ' </tr>'+
            '</thead>'+
            '<tbody>'+
               ' <tr>'+
                  '  <td>1</td>'+
                  '  <td>张三</td>'+
                   ' <td>18</td>'+
                   ' <td>走的人多了，变成了路。</td>'+
               ' </tr>'+
               ' <tr>'+
                  '  <td>2</td>'+
                  '  <td>李四</td>'+
                  '  <td>88</td>'+
                 '   <td>人人都有自己走的路，哪条属于自己呢？</td>'+
               ' </tr>'+
               ' <tr>'+
                '    <td>3</td>'+
                '    <td>王五</td>'+
                '    <td>81</td>'+
                '    <td>走别人的路，让他没道可走！</td>'+
              '  </tr>'+
           ' <tr><td>4</td><td>123</td> <td>123</td> <td>123</td></tr><tr><td>5</td><td>2323</td> <td>32323</td> <td>12332</td></tr></tbody>'+
       ' </table>'+

      '  <label>'+
      '      姓名：<input type="text" autocomplete="" id="name" placeholder="请输入您的姓名...">'+
      '  </label><br>'+
       ' <label>'+
        '    年龄：<input type="text" autocomplete="" id="age" placeholder="请输入您的年龄...">'+
       ' </label><br>'+
      '  <label>'+
         '   座右铭：<input type="text" autocomplete="" id="sex" placeholder="请输入您的座右铭...">'+
        '</label><br>'+

       ' <button id="add">添加信息</button>'+
       ' <button id="out" onclick="btn_export()">导出文件</button>'+
    '</div>'+

         '<input type="file" id="upfile" /><input type="button" οnclick="ReadExcel();" value="read"> '+
       '<textarea id="txtArea" cols=50 rows=10></textarea> '+
        "<div id='content'  >  " +
          '<div  style="width:60px;height:60px;overflow:auto;border:1px solid #40A9FF;border-radius: 1px;"  >'+

         '<a style="font-size: 30px;color:green;">导出'+
           "</a>" + 
            "</div>" + 
              "</div>" +   

            ""
        "";
        odom1.innerHTML = innerH1;
      $("#_banner_follow").after(odom1);    

 function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }); // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}

function openDownloadDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}      


        function btn_export() {
            var table = document.querySelector("#tb");
            var sheet = XLSX.utils.table_to_sheet(table); //将一个table对象转换成一个sheet对象
            openDownloadDialog(sheet2blob(sheet), 'excel.xlsx');
        }


        var id = $("input").length + 1;
        $(function() {
            $("#add").click(function() {
                var name = $("#name").val();
                var age = $("#age").val();
                var sex = $("#sex").val();
                $("tbody").append("<tr><td>" + id + "</td><td>" + name + "</td> <td>" + age + "</td> <td>" + sex + "</td></tr>");
                id++;
                $("input").val('');
            });
        })
    








       
 $("#upfile").click(function(){ 
 
     var tempStr = "";
     var filePath= document.all.upfile.value;
     var oXL = new ActiveXObject("Excel.application");
     var oWB = oXL.Workbooks.open(filePath);
     oWB.worksheets(1).select();
     var oSheet = oWB.ActiveSheet;
     try{
      for(var i=2;i<46;i++)
      {
       if(oSheet.Cells(i,2).value =="null" || oSheet.Cells(i,3).value =="null" )
        break;
       var a = oSheet.Cells(i,2).value.toString()=="undefined"?"":oSheet.Cells(i,2).value;
       tempStr+=("  "+oSheet.Cells(i,2).value+
        "  "+oSheet.Cells(i,3).value+
        "  "+oSheet.Cells(i,4).value+
        "  "+oSheet.Cells(i,5).value+
        "  "+oSheet.Cells(i,6).value+"/n");
      }
     }catch(e)
     {
          document.all.txtArea.value = tempStr;
     }
     document.all.txtArea.value = tempStr;
     oXL.Quit();
     CollectGarbage();  
   
   })

let arr = [],
    page = 2,
    sequence = 1;


    $("#content").click(function(){  
    $('.figure_detail').each(function (index, item) {
        let title = $(this).find('a').text().replace(/,/g, "，").replace(/:/g, "："),
            time = $(this).find('.figure_desc').text();
        arr.push({'id': sequence, 'title': title,'time': time});
        sequence++;
    });



    console.log(`正在导出数据`);
    //列标题，逗号隔开，每一个逗号就是隔开一个单元格
    let str = `序号,标题,播放次数\n`;
    //增加\t为了不让表格显示科学计数法或者其他格式
    for (let i = 0; i < arr.length; i++) {
        for (let item in arr[i]) {
            str += `${arr[i][item]},`;
        }
        str += '\n';
    }
    //encodeURIComponent解决中文乱码
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    //通过创建a标签实现
    let link = document.createElement("a");
    link.href = uri;
    //对下载的文件命名
    link.download = "数据表.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
})


