// ==UserScript==
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @name         图书室自动借阅还书
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  这是一个图书室自动借阅还书脚本
// @author       tpc
// @match        https://lib.scjyzb.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454292/%E5%9B%BE%E4%B9%A6%E5%AE%A4%E8%87%AA%E5%8A%A8%E5%80%9F%E9%98%85%E8%BF%98%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/454292/%E5%9B%BE%E4%B9%A6%E5%AE%A4%E8%87%AA%E5%8A%A8%E5%80%9F%E9%98%85%E8%BF%98%E4%B9%A6.meta.js
// ==/UserScript==

(function() {
    var studentsNum=200;
    var booksNum=studentsNum*3;//图书数量是学生的三倍
    var borrowNum=0;//借书人数

    var studentsPageSize=50;
    var studentsPage=1;
    var studentsList=new Array();
    //加载学生信息
    function loadStudents(){
        if(studentsList.length>studentsNum){
            return;
        }
        //获取学生信息
        var reqData={};
        $.ajax({
            url:"https://lib.scjyzb.net/v1/bookReader/findReaderList?page="+studentsPage+"&pagesize="+studentsPageSize,
            type:"post",
            data:JSON.stringify(reqData),
            contentType:"application/json",
            success:function(data){
                let tempStu = data["rows"];
                for(let i =0;i<tempStu.length;i++){
                    if(tempStu[i]["bookLimit"]-tempStu[i]["borrowNumber"]>0){
                        studentsList.push(tempStu[i]);
                    }
                }
                if(studentsList.length<studentsNum){
                    studentsPage++;
                    loadStudents();
                }else{
                    console.log(studentsList);
                    alert("已成功加载"+studentsList.length+"位学生,等待图书信息加载完毕!点击一键借阅开始借书!");
                }
            }
        })
    }
    //图书批次
    var bookBatchIds1=[4918,4916,4915,4905,4903,4667,4953,4951,4950];
    var bookBatchIds2=[4832];
    //默认为岳池一中
    var bookBatchIds=bookBatchIds1;
    var bookBathIndex=0;
    var bookPageSize=50;
    var bookPage=1;
    var bookBarList=new Array();
    //加载图书
    function loadBookBarList(){

        if(bookBarList.length>booksNum){
            return;
        }
        let reqData={"state":"0","batchId":bookBatchIds[bookBathIndex%bookBatchIds.length]}
        $.ajax({
            url:"https://lib.scjyzb.net/v1/catalog/bookBar/bookBarListQuery?page="+bookPage+"&pagesize="+bookPageSize,
            type:"post",
            data:JSON.stringify(reqData),
            contentType:"application/json",
            success:function(data){
                let tempBooks = data["rows"];
                bookBarList=bookBarList.concat(tempBooks);
                bookBathIndex++;
                if(bookBathIndex%bookBatchIds.length==0){
                    bookPage++;
                }
                if(bookBarList.length<booksNum){
                    loadBookBarList();
                }else{
                    console.log(bookBarList);
                    alert("已成功加载"+bookBarList.length+"本书,等待学生信息加载完毕!点击一键借阅开始借书!");
                }
            }
        })
    }

    
    var successBorrowNum=0;
    //获取学生读书id和借书
    function getBorrowReader(i,student){
        let stuCode=student['userCode'];
        let reqData2={"code":stuCode};
        $.ajax({
            url:"https://lib.scjyzb.net/v1/circulation/getBorrowReader",
            type:"post",
            data:JSON.stringify(reqData2),
            contentType:"application/json",
            success:function(data2){
                console.log(data2);
                let readerId=data2["rows"][0]["readerInfo"]["readerId"];
                let code=stuCode;
                let barcode=bookBarList[i]["barcode"];
                let reqData3={
                    code:code,
                    readerId:readerId,
                    barcode:barcode
                };
                //借阅图书
                $.ajax({
                    url:"https://lib.scjyzb.net/v1/circulation/borrowBook",
                    type:"post",
                    data:JSON.stringify(reqData3),
                    contentType:"application/json",
                    success:function(data3){
                        if(data3["success"]==true){
                            successBorrowNum++;
                        }else{
                            console.log(stuCode+"   "+data3["message"]);
                        }
                        bookBarList[i]["state"]=1;
                        studentsList[i]["borrowNumber"]=studentsList[i]["borrowNumber"]+1;
                        borrowNum--;
                        //如果完成了借阅程序
                        if(borrowNum<=0){
                            alert("成功借出图书: "+successBorrowNum+" 本");
                            //初始化学生和图书信息
                            initBookAndStudent();
                            //借书完成后再次加载图书和学生信息
                            loadBookBarList();
                            loadStudents();
                            $("#yjjy").removeAttr("disabled");//恢复按钮状态
                        }
                    }
                })
            }
        })
    }
    //清空已借阅的图书和已达借阅上线的学生信息
    function initBookAndStudent(){
        successBorrowNum=0;
        for(let i = bookBarList.length-1;i>=0;i--){
            if(bookBarList[i]["state"]==1){
                bookBarList.splice(i,1);
            }
        }
        for(let i = studentsList.length-1;i>=0;i--){
            if(studentsList[i]["bookLimit"]-studentsList[i]["borrowNumber"]<=0){
                studentsList.splice(i,1);
            }
        }
        console.log(bookBarList);
        console.log(studentsList);
    }

    //一键借阅图书
    function borrowBook(){
        if(bookBarList.length<booksNum || studentsList<studentsNum){
            alert("请等待图书信息和学生信息加载完毕!");
            return;
        }


        borrowNum = prompt("请输入借出图书数量,不能大于学生数量.");

        if(borrowNum != null && borrowNum>0){
            if(borrowNum>studentsList.length){
                alert("所输入人数大于加载的人数,请重试!");
                return;
            }
            this.disabled=true;//开始借阅设置按钮不可用
            let stuRows = studentsList;
            let tempNum=borrowNum;
            for(let i=0;i<tempNum;i++){
                let student=stuRows[i];
                getBorrowReader(i,student);
            }

        }

    }

    //一键还书
    function returnBook(){

        let returnNum=prompt("请输入归还图书数量.");
        let sucessNum=0,num=0;
        if(returnNum != null && returnNum>0){
            this.disabled=true;//开始还书设置按钮不可用
            let reqData={"state":"1"};
            //查询已借阅图书
            $.ajax({
                url:"https://lib.scjyzb.net/v1/catalog/bookBar/bookBarListQuery?page=1&pagesize="+returnNum,
                type:"post",
                data:JSON.stringify(reqData),
                contentType:"application/json",
                success:function(data){
                    let tempBooks = data["rows"];
                    for(let i = 0;i<tempBooks.length;i++){
                        let reqData2={"barcode":tempBooks[i]["barcode"]};
                        $.ajax({
                            url:"https://lib.scjyzb.net/v1/circulation/returnBook",
                            type:"post",
                            data:JSON.stringify(reqData2),
                            contentType:"application/json",
                            success:function(data1){
                                num++;
                                if(data1["success"]==true){
                                    sucessNum++;
                                }
                                if(num>=returnNum){
                                    $("#yjhs").removeAttr("disabled");//恢复按钮状态
                                    alert("成功归还图书: "+sucessNum+" 本");
                                }
                            }
                        })
                    }
                }
            })
        }
    }
    //加载学生和图书
    function loadBooksAndStudents(){
        loadBookBarList();
        loadStudents();
    }
    //选择不同学校的事件
    function changeSchoolId(){
        var id = $("#xz_xx").val();
        if(id == 1){
            bookBatchIds=bookBatchIds1;
        }else if(id==2){
            bookBatchIds=bookBatchIds2;
        }
        //重置图书加载初始位置
        bookBathIndex=0;
        bookPageSize=50;
        bookPage=1;
        bookBarList=new Array();
        //重置学生数据加载初始位置
        studentsPageSize=50;
        studentsPage=1;
        studentsList=new Array();
    }
    var $button4 = $("<select id=\"xz_xx\" style=\"position: absolute;right: 60%;top: 10px;color: black;background: #FFFFBB!important;display: block;z-index: 999;\">\
                     <option value=1>岳池一中</option>\
                     <option value=2>断桥初中</option>\
                     </select>")
    $("body").append($button4)
    var $button3 = $("<button id=\"jz_data\" style=\"position: absolute;right: 50%;top: 10px;color: #ecdf24;background: #FFFFBB!important;display: block;z-index: 999;\">加载数据</button>")
    $("body").append($button3)
    var $button1 = $("<button id=\"yjjy\" style=\"position: absolute;right: 40%;top: 10px;color: #ecdf24;background: #FFFFBB!important;display: block;z-index: 999;\">一键借书</button>")
    $("body").append($button1)
    var $button2 = $("<button id=\"yjhs\" style=\"position: absolute;right: 30%;top: 10px;color: #ecdf24;background: #FFFFBB!important;display: block;z-index: 999;\">一键还书</button>")
    $("body").append($button2)
    $button1.click(borrowBook)
    $button2.click(returnBook)
    $button3.click(loadBooksAndStudents)
    $button4.change(changeSchoolId)
})();