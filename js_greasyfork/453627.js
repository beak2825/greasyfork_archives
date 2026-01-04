  var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {
        var mingzi=$('.header-m__operation-2lCUh').text()
        console.log(mingzi)
        if (arguments[1] == '/sub_procenter/prodcenter/customoOrderQuery/getCustomOrdersDetail'&&(mingzi=='大鹏|退出'||mingzi=='自营店铺打单|退出')) {
            console.log(arguments)
            const xhr = this;
            const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response').get;
            Object.defineProperty(xhr, 'responseText', {
                get: () => {
                    var result =eval('('+getter.call(xhr)+')')
                    //这里可以修改result
                    //   result.data.result.succList[0].remark=result.data.result.succList[0].vendorRemark
                    for(var i of result.data.result.succList){
                        console.log('////')
                        console.log(i)
                        i.remark=i.vendorRemark
                    }
                    //console.log('11111111111'+result.data.result.succList[0].remark)
                    console.log(result.data.result.succList[0])
                    return JSON.stringify(result);
                }
            });
        }
        open.call(this, method, uri, async, user, pass);
    };
    var font_size=24;
    setInterval(function(){
        if($(".ant-modal").length){
            $(".ant-row .ant-col-24:nth-child(10n)").hide()
            $(".ant-row .ant-col-24:nth-child(10n-1)").hide()
            $(".ant-row .ant-col-24:nth-child(10n-2)").hide()
            $(".ant-row .ant-col-24:nth-child(10n-3)").hide()

            $(".orderManage-m__printRemark-1pDFL").css("font-size",font_size+'px')
            $(".orderManage-m__printRemark-1pDFL>span").css("line-height",font_size*1.5+'px')

            console.log(2)
        }

    },1000)