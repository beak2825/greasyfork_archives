// ==UserScript==
// @name         行政审批自动填写
// @namespace    xzsp
// @version      0.1
// @description  自动填写行政审批内容
// @author       陶志
// @match        *://192.150.194.61:8080/approval/index*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://unpkg.com/xlsx@0.13.2/dist/xlsx.full.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370433/%E8%A1%8C%E6%94%BF%E5%AE%A1%E6%89%B9%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/370433/%E8%A1%8C%E6%94%BF%E5%AE%A1%E6%89%B9%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var jsondata = '';
    let testbtn = '<div id="testbutton" style="right: 40px; top: 40px; display: block; position:fixed; z-index:1; background-color:rgba(0,0,0,0.5); -moz-border-radius:5px; -webkit-border-radius:5px; border-radius:5px; padding:25px;"; ></div>';
    let dropdiv = '<div id="drop" style = "border:2px dashed #bbb; -moz-border-radius:5px; -webkit-border-radius:5px; border-radius:5px; padding:25px; text-align:center; font:15pt bold ;color:#FFF">将文件拖拽到这里或<br/>点击下方的选择文件进行解析</div>';
    let selfile = '<div style="padding:5px;"><input type="file" name="xlfile" id="xlf"/></div>';
    let select = '<div style="padding:5px;"><select id="sel"><option  value="" >---请选择---</option></select></div>';
    let insertbutton = '<div style="padding:5px;"><button id="insert">插入数据</button></div>';
    var X = XLSX;

    //处理读取数据的类型转换
    var to_json = (workbook)=>{
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName], {header:0});
            if(roa.length) result["sheet1"] = roa;
        });
        return result;
    }

    //根据excel文件初始化拉菜单
    var initsel = (data)=>{
        let sel = $("#sel");
        sel.empty();
        sel.append(`<option value ="">---请选择---</option>`)
        data.sheet1.forEach((element,index) => {
            sel.append(`<option value ="${index}">${element.受理号}</option>`)
        });
    }

    //处理拖拽到excel文件
    function do_file(files) {
        var f = files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            if(typeof console !== 'undefined') console.log("onload", new Date());
            var data = e.target.result;
            //data = new Uint8Array(data);
            jsondata = to_json(X.read(data,{type:'array'}));
            $("#drop").text("数据解析成功!")
            initsel(jsondata);
        };
        reader.readAsArrayBuffer(f);
    };



    $(document).ready(function(){
        // alert("My First JavaScript");
        $("body").append(testbtn);
        $("#testbutton").append(dropdiv).append(selfile).append(select).append(insertbutton);

        $("#insert").click(()=>{
            let index = $("#sel").val();
            let d_fdqx = '15';
            let d_cnqx = '10';

            let {受理号:slid,登记类型:djlx,权利人:qlr,权利人2:qlr2,
                法人:fr,法人2:fr2,代理人:dlr,代理人2:dlr2,
                权利人证件编号:qlrzj,权利人证件编号2:qlrzj2,代理人证件编号:dlrzj,代理人证件编号2:dlrzj2,
                法人联系电话:frdh,法人联系电话2:frdh2,代理人联系电话:dlrdh,代理人联系电话2:dlrdh2
            } = jsondata.sheet1[index];

            let d_lxr ='';
            let lxrsfz = '';
            let lxrdh = '';
            let qlrs,qlrzjs;
            
            if(djlx.indexOf('抵押')>-1){d_cnqx = '10';d_fdqx = '15';}
            else if (djlx.indexOf('查封')>-1) {d_cnqx = '1';d_fdqx = '1';}
            else {d_cnqx = '15';d_fdqx = '20'; }


            if(djlx.indexOf('抵押')>-1||djlx.indexOf('查封')>-1){//判断登记类型是否为抵押或查封
                qlrs = qlr2.split('、');
                qlrzjs = qlrzj2.split('、');
                for(let i = 0;i<qlrs.length;i++)
                {
                    if(qlrs[i].length>3){
                        if (dlr2.length>0) {
                            d_lxr = dlr2;
                            lxrsfz = dlrzj2;
                            break;
                        }else{
                            if (fr2.length>0) {
                                lxr = fr2;
                                lxrsfz = "";
                                break;
                            }
                        }
                        $("#fr3").contents().find("#appPersonType").val("2");
                    }else{
                        d_lxr = qlrs[i];
                        lxrsfz = qlrzjs[i];
                        $("#fr3").contents().find("#appPersonType").val("1");
                    }
                }
                lxrdh = frdh2.length ? frdh2.split('、')[0] : dlrdh2.split('、')[0];
            }else{
                qlrs = qlr.split('、');
                qlrzjs = qlrzj.split('、');
                for(let i = 0;i<qlrs.length;i++)
                {
                    if(qlrs[i].length>3){
                        if (dlr.length>0) {
                            d_lxr = dlr;
                            lxrsfz = dlrzj;
                            break;
                        }else{
                            if (fr2.length>0) {
                                lxr = fr2;
                                lxrsfz = "";
                                break;
                            }
                        }
                        $("#fr3").contents().find("#appPersonType").val("2");
                    }else{
                        d_lxr = qlrs[i];
                        lxrsfz = qlrzjs[i];
                        $("#fr3").contents().find("#appPersonType").val("1");
                    }
                }
                lxrdh = frdh.length ? frdh.split('、')[0]: dlrdh.split('、')[0];
            }

            $("#fr3").contents().find("[name=business_name]").val(djlx);//申请项目名称
            $("#fr3").contents().find("[name=law_term]").val(d_fdqx);//法定时限
            $("#fr3").contents().find("[name=promise_term]").val(d_cnqx);//承诺时限
            $("#fr3").contents().find("[name=contact]").val(d_lxr);//联系人
            $("#fr3").contents().find("[name=mobile]").val(lxrdh);//联系人电话
            $("#fr3").contents().find("[name=phone]").val(lxrdh);//联系人手机
            $("#fr3").contents().find("[name=cardNum]").val(lxrsfz);//联系人身份证
            $("#fr3").contents().find("[name=applicant]").val(qlr);//申请人名称
            $("#fr3").contents().find("[name=project]").val(djlx);//项目(工程)名称
            if ($('#sel [value = "'+index+'"]').text().indexOf('已完成')===-1) {
                $('#sel [value = "'+index+'"]').text( $('#sel [value = "'+index+'"]').text()+'-已完成');
            }
            if ($("#fr3").contents().find("[name=mobile]").val() === '') {
                $("#fr3").contents().find("[name=mobile]").val('13333333333');//联系人电话
                $("#fr3").contents().find("[name=phone]").val('13333333333');//联系人手机
                $("#fr3").contents().find("[name=remarks]").val('本次登记无联系人电话,因此将电话设置为"13333333333"作为替代');//联系人电话
                
            }

        });

        //为div增加拖入文件的监听
        (function() {
            var drop = document.getElementById('drop');
            if(!drop.addEventListener) return;

            function handleDrop(e) {
                e.stopPropagation();
                e.preventDefault();
                //调用处理拖拽文件的方法
                do_file(e.dataTransfer.files);
            }

            function handleDragover(e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            }

            drop.addEventListener('dragenter', handleDragover, false);
            drop.addEventListener('dragover', handleDragover, false);
            drop.addEventListener('drop', handleDrop, false);
        })();

        (function() {
            var xlf = document.getElementById('xlf');
            if(!xlf.addEventListener) return;
            function handleFile(e) { do_file(e.target.files); }
            xlf.addEventListener('change', handleFile, false);
        })();
    });

})();