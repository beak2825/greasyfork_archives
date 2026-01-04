
// ==UserScript==
// @name         ZhitiJ
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to help you for your report
// @author       You
// @match        http://111.51.123.233:8088/stj-web/index/inspect/report/toReportInput.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=123.233
// @grant        none
// ==/UserScript==


(function () {
    'use strict';
    var div = document.createElement('button');
    div.innerText = "CHECK";
    Object.assign(div.style, {
        position: 'fixed',
        right: '50px',
        bottom: '50px',
        fontSize: '5px',
        zIndex: 59,
        borderRadius: '10%',
        backgroundColor: 'yellow',
        padding: '10px',
        cursor: 'pointer'
    })
    document.body.appendChild(div);
    div.onclick = function (e) {

        main()
    }
    var input = document.createElement("TEXTAREA");
    input.id = "information";
    input.name = "information";
    input.style.width = '320px';
    input.style.height = '400px';
    document.body.appendChild(input);
    Object.assign(input.style, {
        position: 'fixed',
        right: '1180px',
        bottom: '60px',
        fontSize: '16px',
        zIndex: 0,
        borderRadius: '5%',
        backgroundColor: 'white',
        padding: '1px',
        cursor: 'pointer'
    })


    var strtip=''
    var tipnum=0
    var enable=true
    var strinput=''



    function main() {
        //当前日期
        var curdate = new Date()
        var curyear=curdate.getFullYear()//获取完整的年份(4位)
        var curmonth=curdate.getMonth()//获取完整的月份(2位)

        var fenxiangs=[]
        var fenxiangmap=new Map()
        var fenxiangjlmap=new Map()
        var sbtezhengshebeijianchengmap=new Map()
        sbtezhengshebeijianchengmap.set('电梯','梯')
        //sbtezhengshebeijianchengmap.set('起重机械','起')
        //sbtezhengshebeijianchengmap.set('场(厂)内专用机动车辆','车')
        var sheqvshizimudaihaomap=new Map()
        sheqvshizimudaihaomap.set('银川市','A')

        //sheqvshizimudaihaomap.set('石嘴山市','B')
        //sheqvshizimudaihaomap.set('吴忠市','C')
        sheqvshizimudaihaomap.set('固原市','D')
        sheqvshizimudaihaomap.set('中卫市','E')
        var sbtezhengdaihaomap=new Map()
        sbtezhengdaihaomap.set('曳引驱动乘客电梯','11')
        sbtezhengdaihaomap.set('曳引驱动载货电梯','12')
        //sbtezhengdaihaomap.set('强制驱动载货电梯','13')
        //sbtezhengdaihaomap.set('液压乘客电梯','21')
        //sbtezhengdaihaomap.set('液压载货电梯','22')
        //sbtezhengdaihaomap.set('自动扶梯','31')
        //sbtezhengdaihaomap.set('自动人行道','32')
        //sbtezhengdaihaomap.set('防爆电梯','41')
        //sbtezhengdaihaomap.set('消防员电梯','42')
        //sbtezhengdaihaomap.set('杂物电梯','43')
        var sbfenleimap=new Map()
        sbfenleimap.set('曳引式客梯','3110')
        sbfenleimap.set('强制式客梯','3120')
        sbfenleimap.set('无机房客梯','3130')
        //sbfenleimap.set('消防客梯','3140')
        sbfenleimap.set('观光客梯','3150')//校验玻璃轿门
        //sbfenleimap.set('防爆客梯','3160')
        sbfenleimap.set('病床客梯','3170')
        sbfenleimap.set('曳引式货梯','3210')
        sbfenleimap.set('强制式货梯','3220')
        sbfenleimap.set('无机房货梯','3230')
        //sbfenleimap.set('汽车电梯','3240')
        //sbfenleimap.set('防爆货梯','3250')
        //sbfenleimap.set('液压客梯','3310')
        //sbfenleimap.set('防爆液压客梯','3320')
        //sbfenleimap.set('液压货梯','3330')
        //sbfenleimap.set('防爆液压货梯','3340')
        //sbfenleimap.set('杂物电梯','3400')
        //sbfenleimap.set('自动扶梯','3500')
        //sbfenleimap.set('自动人形道','3600')
        var xingzhenqvhuamap=new Map()
        xingzhenqvhuamap.set('兴庆区','640104')
        xingzhenqvhuamap.set('西夏区','640105')
        xingzhenqvhuamap.set('金凤区','640106')
        xingzhenqvhuamap.set('永宁县','640121')
        xingzhenqvhuamap.set('贺兰县','640122')
        xingzhenqvhuamap.set('灵武市','640181')
        xingzhenqvhuamap.set('石嘴山市','640200')
        xingzhenqvhuamap.set('大武口区','640202')
        xingzhenqvhuamap.set('惠农区','640205')
        xingzhenqvhuamap.set('平罗县','640221')
        xingzhenqvhuamap.set('利通区','640302')
        xingzhenqvhuamap.set('红寺堡区','640303')
        xingzhenqvhuamap.set('盐池县','640323')
        xingzhenqvhuamap.set('同心县','640324')
        xingzhenqvhuamap.set('青铜峡市','640381')
        xingzhenqvhuamap.set('原州区','640402')
        xingzhenqvhuamap.set('西吉县','640422')
        xingzhenqvhuamap.set('隆德县','640423')
        xingzhenqvhuamap.set('泾源县','640424')
        xingzhenqvhuamap.set('彭阳县','640425')
        xingzhenqvhuamap.set('沙坡头区','640502')
        xingzhenqvhuamap.set('中宁县','640521')
        xingzhenqvhuamap.set('海原县','640522')
        var usemap=new Map()
        usemap.set(1,'640104')
        usemap.set(2,'640105')
        usemap.set(3,'640106')
        usemap.set(4,'640121')
        usemap.set(5,'640122')
        usemap.set(6,'640181')
        usemap.set(7,'640200')
        usemap.set(8,'640202')
        usemap.set(9,'640205')
        usemap.set(10,'640221')
        usemap.set(11,'640302')
        usemap.set(12,'640303')
        //resetHilightFields()

        /*var [reportDateEl, reportDate] = getCoverFieldValueByLabel('检验日期:')
        reportDate = reportDate.replace(/年|月|日/g, '-').slice(0, -1).slice(-10)
        if (!reportDate) {
            addstrtip('没有找到检验日期！')
            return
        }
        var reportTime = new Date(reportDate)
        var [nextReportDateEl, nextReportDate] = getTableFieldValueByLabel('下次检验时间')
        nextReportDate = nextReportDate.match(/\d{4}年\d{2}月\d{2}日/)[0].replace(/年|月|日/g, '-').slice(0, -1)
        if (!nextReportDate) {
            return
        }
        console.log(reportTime, reportDate)
        var nextReportTime = new Date(nextReportDate)

        if (reportTime.getFullYear() + 1 === nextReportTime.getFullYear() && reportTime.getMonth() === nextReportTime.getMonth()) {
            // 一年一检
            console.log('检验时间校验正确?')
        } else {
            console.log(reportTime.getFullYear() + 1, nextReportTime.getFullYear(), reportTime.getMonth())
            highlightedFields.push(reportDateEl)
            highlightedFields.push(nextReportDateEl)
            addstrtip('检验时间有误！')
        }*/

        //封面
        var username = document.getElementById('1581261202417784a').textContent.trim().slice(6)

        if(username==='')
        {
            addstrtip('注意封面使用单位名称！')
        }
        var sbdm = document.getElementById('15812612267239b62').textContent.trim().slice(4)
        if(sbdm.trim()==='')
        {
            addstrtip('注意封面设备代码！')
        }
        var sblb = document.getElementById('15812612661633124').textContent.trim().slice(12)
        if(sblb!='曳引与强制驱动电梯')
        {
            addstrtip('注意封面设备类别！')
        }
        var sbpz = document.getElementById('15812612904775e8a').innerText.trim()
        //alert(sbpz)


        if(!(sbpz==='曳引驱动乘客电梯'||sbpz==='曳引驱动载货电梯'))
        {
            addstrtip('注意封面设备品种！')
        }
        var sglb = document.getElementById('1581475038385c79e').textContent.trim().slice(4);
        if(!(sglb==='安装'||sglb==='改造'||sglb==='重大修理'))
        {
            addstrtip('注意封面施工类别！')
        }
        var sgdanweiname = document.getElementById('1622474646779d247').textContent.trim().slice(6)
        if(sgdanweiname==='')
        {
            addstrtip('注意封面施工单位名称！')
        }

        var jyrq = document.getElementById('16449067367889ff9').textContent.trim().slice(4).replace(/年|月|日/g, '-').slice(0, -1)//封面检验日期
        jyrq=YearMonthToYearMonthDay(jyrq)

        //仪器
        /*var yqwanyong1 = document.getElementById('16225989609296d4').innerText.trim()
        var yqwanyong2 = document.getElementById('16225989609292ee').innerText.trim()
        var yqqianxing1 = document.getElementById('1622598960929825').innerText.trim()
        var yqqianxing2 = document.getElementById('1622598960929dcd').innerText.trim()
        var yqyoubiao1 = document.getElementById('1622598960930ba1').innerText.trim()
        var yqyoubiao2 = document.getElementById('1622598960930fc7').innerText.trim()
        var yqgangzhi1 = document.getElementById('1622598960930c1d').innerText.trim()
        var yqgangzhi2 = document.getElementById('162259896093082e').innerText.trim()

        var yqgangjuan1 = document.getElementById('1622598960930078').innerText.trim()
        var yqgangjuan2 = document.getElementById('1622598960930b0d').innerText.trim()
        var yqsaichi1 = document.getElementById('1622598960930cd0').innerText.trim()
        var yqsaichi2 = document.getElementById('1622598960930710').innerText.trim()
        var yqcili1 = document.getElementById('16225989609307a8').innerText.trim()
        var yqcili2 = document.getElementById('162259896093063f').innerText.trim()
        var yqchangyong1 = document.getElementById('162259896093043b').innerText.trim()
        var yqchangyong2 = document.getElementById('1622598960930056').innerText.trim()

        var yqzhaodu1 = document.getElementById('16225989609309e4').innerText.trim()
        var yqzhaodu2 = document.getElementById('1622598960930c7d').innerText.trim()
        var yqjishi1 = document.getElementById('16225989609307e8').innerText.trim()
        var yqjishi2 = document.getElementById('1622598960930ced').innerText.trim()
        var yqceli1 = document.getElementById('1622598960930045').innerText.trim()
        var yqceli2 = document.getElementById('1622598960930a03').innerText.trim()
        var yqbianxiedeng1 = document.getElementById('1622598960930fd4').innerText.trim()
        var yqbianxiedeng2 = document.getElementById('16225989609308bc').innerText.trim()

        var yqdaogui1 = document.getElementById('1622598960930e90').innerText.trim()
        var yqdaodui2 = document.getElementById('16225989609309ae').innerText.trim()
        var yqbianxietan1 = document.getElementById('162259896093026b').innerText.trim()
        var yqbianxietan2 = document.getElementById('1622598960930eca').innerText.trim()
        var yqfama1 = document.getElementById('1622598960930d03').innerText.trim()
        var yqfama2 = document.getElementById('1622598960930a6f').innerText.trim()
        var yqjueyuan1 = document.getElementById('162259896093080e').innerText.trim()
        var yqjueyuan2 = document.getElementById('1622598960930d0b').innerText.trim()

        var yqjiedi1 = document.getElementById('16225989609317e3').innerText.trim()
        var yqjiedi2 = document.getElementById('162259896093167e').innerText.trim()
        var yqshengji1 = document.getElementById('16225989609319b5').innerText.trim()
        var yqshengji2 = document.getElementById('1622598960931038').innerText.trim()
        var yqjiasu1 = document.getElementById('16225989609316ea').innerText.trim()
        var yqjiasu2 = document.getElementById('16460339482180a54').innerText.trim()
        var yqwengshi1 = document.getElementById('16457724618037a52').innerText.trim()
        var yqwengshi2 = document.getElementById('16457725202218512').innerText.trim()

        var yqzhuansu1 = document.getElementById('1676366333158646c').innerText.trim()
        var yqzhuansu2 = document.getElementById('1676361947114369f').innerText.trim()*/
        var yqjueyuan1 = document.getElementById('1622475382488cbb').innerText.trim()
        var yqjueyuan2 = document.getElementById('16224753824888eb').innerText.trim()
        if(yqjueyuan1==='-'||yqjueyuan2==='-')
        {
            addstrtip('应勾选绝缘电阻测试仪986456！')
        }


        var yqwengshi1 = document.getElementById('1648629583354ff66').innerText.trim()
        var yqwengshi2 = document.getElementById('1622475382488bf3').innerText.trim()
        if(yqwengshi1==='-'||yqwengshi2==='-')
        {
            addstrtip('应勾选温湿度计39258856！')
        }


        //现场条件
        var tj11 = document.getElementById('162247611255838c').innerText.trim()
        var tj12 = document.getElementById('1622476112558697').innerText.trim()
        var tj21 = document.getElementById('1622476112558d7a').innerText.trim()
        var tj22 = document.getElementById('162247611255885b').innerText.trim()
        var tj31 = document.getElementById('16224761125582de').innerText.trim()
        var tj32 = document.getElementById('1622476112558ff5').innerText.trim()
        var tj41 = document.getElementById('1622476112558abc').innerText.trim()
        var tj42 = document.getElementById('1622476112558d86').innerText.trim()
        var tj51 = document.getElementById('1622476112558d1f').innerText.trim()
        var tj52 = document.getElementById('1622476112558915').innerText.trim()

        //现场检验条件记录验证
        if(tj11!='√'||tj21!='√'||tj31!='√'||tj41!='√'||tj51!='√'
           ||tj12!='-'||tj22!='-'||tj32!='-'||tj42!='-'||tj52!='-')
        {
            addstrtip('注意现场检验条件是否确认，填写是否合理！')
        }

        //检验人员
        var jyrengyuan = document.getElementById('16224769268825925').textContent.trim()
        var jyrengyuanriqi = document.getElementById('1622600497260dd5e').textContent.trim().slice(4).replace(/年|月|日/g, '-').slice(0, -1)//检验人员日期
        jyrengyuanriqi=YearMonthToYearMonthDay(jyrengyuanriqi)

        //受检人员
        var shoujianren = document.getElementById('1622476966093c772').innerText.trim()
        var shoujianrenriqi = document.getElementById('162260051182972d0').textContent.trim().slice(6).replace(/年|月|日/g, '-').slice(0, -1)//受检单位签字日期
        shoujianrenriqi=YearMonthToYearMonthDay(shoujianrenriqi)
        //设备概况
        //使用登记证编号
        var gkshiyongdengji = document.getElementById('16224772829930225').textContent.trim().slice(5)
        //制造日期
        var gkzhizaoriqi = document.getElementById('16224772931847c12').textContent.trim().slice(4).replace(/年|月|日/g, '-').slice(0, -1)
        gkzhizaoriqi=YearMonthToYearMonthDay(gkzhizaoriqi)

        //设备名称
        var gkshebeiname = document.getElementById('16224761125583fb').textContent.trim().slice(4)

        if(!(gkshebeiname.trim()==='曳引驱动乘客电梯'||gkshebeiname.trim()==='曳引驱动载货电梯'))
        {
            addstrtip('注意概况设备名称！')
        }

        if(gkshebeiname.trim()!=sbpz.trim())
        {
            addstrtip('注意封面与概况中设备名称是否一致！')
        }
        var gkxinghao = document.getElementById('16224773063527e89').textContent.trim().slice(4)//型号

        if(gkxinghao.trim()==='')
        {
            addstrtip('注意型号！')
        }
        var gkchanpingbianhao = document.getElementById('1622477318006ec87').textContent.trim().slice(10)//产品编号
        if(gkchanpingbianhao.trim()==='')
        {
            addstrtip('注意产品编号！')
        }

        var gkyonghusbbianhao = document.getElementById('1622476112558923').textContent.trim().slice(6)//用户设备编号
        if(gkyonghusbbianhao.trim()==='')
        {
            addstrtip('注意用户设备编号！')
        }

        var gktishenggaodu = document.getElementById('1622477346371b42a').textContent.trim().slice(6)//提升高度
        var gaoduright=false
        if(!isNaN(Number(gktishenggaodu)))
        {
            if(parseFloat(gktishenggaodu)>0)
            {
                gaoduright=true
            }
        }
        if(!gaoduright)
        {
            addstrtip('注意提升高度是否正确！')
        }

        var gkanzhuangdidian = document.getElementById('16224773692617c8d').textContent.trim().slice(10)//安装地点
        if(gkanzhuangdidian.trim()==='')
        {
            addstrtip('注意安装地点！')
        }
        var gkedinzaizhongliang = document.getElementById('1622477385830b0af').textContent.trim().slice(6)//额定载重量
        if(!isNormalInteger(gkedinzaizhongliang))
        {
            addstrtip('注意额定载重量是否正确！')
        }
        var gkedinsudu = document.getElementById('1622477404019add4').textContent.trim().slice(4)//额定速度parseFloat()
        var suduright=false
        if(!isNaN(Number(gkedinsudu)))
        {
            if(parseFloat(gkedinsudu)>0)
            {
                suduright=true
            }
        }
        if(!suduright)
        {
            addstrtip('注意额定速度是否正确！')
        }

        var gkcengshu = document.getElementById('16224774529643ebc').textContent.trim().slice(4)//层数
        if(!isNormalInteger(gkcengshu))
        {
            addstrtip('注意层数是否正确！')
        }
        var gkzhanshu = document.getElementById('1622477484482fac5').textContent.trim().slice(4)//站数
        if(!isNormalInteger(gkzhanshu))
        {
            addstrtip('注意站数是否正确！')
        }

        var gkmenshu = document.getElementById('1622477497037eebe').textContent.trim().slice(4)//门数
        if(!isNormalInteger(gkmenshu))
        {
            addstrtip('注意门数是否正确！')
        }

        var gkkongzhifangshi = document.getElementById('16224761125588f1').textContent.trim().slice(5)//控制方式,默认有空格隔开

        if(!(gkkongzhifangshi==='集选控制'||gkkongzhifangshi==='并联控制'||gkkongzhifangshi==='群控'||gkkongzhifangshi==='集选'||gkkongzhifangshi==='并联'))
        {
            addstrtip('注意控制方式是否正确！')
        }
        var gkyeyinjixinghao = document.getElementById('1622476112558ed9').innerText.trim()//曳引机型号
        if(gkyeyinjixinghao.trim()==='')
        {
            addstrtip('注意曳引机型号！')
        }

        var gkyeyinjibianhao = document.getElementById('1622477519272f1d6').textContent.trim().slice(7)//曳引机编号
        if(gkyeyinjibianhao.trim()==='')
        {
            addstrtip('注意曳引机编号！')
        }

        //var gksubi = document.getElementById('1622476112558245').textContent.trim().slice(3);//alert(gksubi)//曳引速比,系统默认'-'
        var gksubi = document.getElementById('1622476112558245').innerText
        var gksubif=1
        //alert(gksubi.length)
        //alert(gksubi.search(':'))
        if(gksubi.length>=3&&((gksubi.search(':')!=-1)||(gksubi.search('：')!=-1)))
        {
            var gksubiarr
            if(gksubi.search(':')!=-1)
            {
                gksubiarr=gksubi.split(':')
            }
            else
            {
                gksubiarr=gksubi.split('：')
            }
            if(!(isNormalInteger(gksubiarr[0].trim()) && isNormalInteger(gksubiarr[1].trim())))
            {
                addstrtip('注意速比格式！')
            }
            else
            {
                gksubif=parseInt(gksubiarr[0].trim())/parseInt(gksubiarr[1].trim())
            }
        }
        else if(gksubi!='-')
        {
            addstrtip('注意速比格式！')
        }

        var gkduizhongkuai = document.getElementById('1622477564115fa82').textContent.trim().slice(5)//对重块数量或高度
        var dzright=false
        if(gkduizhongkuai.search('块')!=-1)
        {
            var kuaishu=gkduizhongkuai.substr(0,gkduizhongkuai.search('块')).trim()
            if(isNormalInteger(kuaishu)&&gkduizhongkuai.length===(gkduizhongkuai.search('块')+1))
            {
                dzright=true
            }
        }
        else if(gkduizhongkuai.search('mm')!=-1)
        {
            kuaishu=gkduizhongkuai.substr(0,gkduizhongkuai.search('mm')).trim()
            if(isNormalInteger(kuaishu)&&gkduizhongkuai.length===(gkduizhongkuai.search('mm')+2))
            {
                dzright=true
            }
        }
        else if(gkduizhongkuai.search('cm')!=-1)
        {
            kuaishu=gkduizhongkuai.substr(0,gkduizhongkuai.search('cm')).trim()
            if(isNormalInteger(kuaishu)&&gkduizhongkuai.length===(gkduizhongkuai.search('cm')+2))
            {
                dzright=true
            }
        }
        if(!dzright)
        {
            addstrtip('注意对重块数量或高度填写是否正确！')
        }

        var gkyeyinshengshugangdaishu = document.getElementById('16224779141556940').textContent.trim().slice(4)//曳引绳数/钢带数

        if(!isNormalInteger(gkyeyinshengshugangdaishu))
        {
            addstrtip('注意曳引绳数/钢带数！')
        }
        var gkyeyinshengzhijingangdaikuandu = document.getElementById('16224779390265fa7').textContent.trim().slice(5)//曳引绳直径/钢带宽度

        if(!isNormalInteger(gkyeyinshengzhijingangdaikuandu))
        {
            addstrtip('注意曳引绳直径/钢带宽度！')
        }
        var gkyeyinlunjiejin = document.getElementById('1622477626844c227').textContent.trim().slice(9)//曳引轮节径

        if(!isNormalInteger(gkyeyinlunjiejin))
        {
            addstrtip('注意曳引轮节径！')
        }

        var gkyeyinbi = document.getElementById('1622476112558913').innerText.trim()//曳引比
        var gkyeyinbif=1
        if(gkyeyinbi.trim()==='')
        {
            addstrtip('注意曳引比！')
        }
        if(gkyeyinbi.length>=3&&((gkyeyinbi.search(':')!=-1)||(gkyeyinbi.search('：')!=-1)))
        {
            var gkyeyinbiarr
            if(gkyeyinbi.search(':')!=-1)
            {
                gkyeyinbiarr=gkyeyinbi.split(':')
            }
            else
            {
                gkyeyinbiarr=gkyeyinbi.split('：')
            }

            if(!(isNormalInteger(gkyeyinbiarr[0].trim()) && isNormalInteger(gkyeyinbiarr[1].trim())))
            {
                addstrtip('注意曳引比格式！')
            }
            else
            {
                gkyeyinbif=parseInt(gkyeyinbiarr[0].trim())/parseInt(gkyeyinbiarr[1].trim())
            }
        }
        else if(gkyeyinbi!='-')
        {
            addstrtip('注意曳引比格式！')
        }



        var gkkongzhipingxinghao = document.getElementById('1622476112558d95').innerText.trim()//控制屏型号
        if(gkkongzhipingxinghao.trim()==='')
        {
            addstrtip('注意控制屏型号！')
        }
        var gkkongzhipingbianhao = document.getElementById('1622477737040cce1').textContent.trim().slice(7)//控制屏编号
        if(gkkongzhipingbianhao.trim()==='')
        {
            addstrtip('注意控制屏编号！')
        }
        var gkxiansuqixinghao = document.getElementById('1623124027975f8af').textContent.trim().slice(5)//限速器型号
        if(gkxiansuqixinghao.trim()==='')
        {
            addstrtip('注意限速器型号！')
        }
        var gkxiansuqibianhao = document.getElementById('16231240690647d80').textContent.trim().slice(7)//限速器编号
        if(gkxiansuqibianhao.trim()==='')
        {
            addstrtip('注意限速器编号！')
        }


        var gkxiansuqijixiedongzuosudu = document.getElementById('164673204698580db').textContent.trim().slice(6)//限速器机械动作速度
        var xiansuqijixiesuduright=false
        if(!isNaN(Number(gkxiansuqijixiedongzuosudu)))
        {
            if(parseFloat(gkxiansuqijixiedongzuosudu)>0)
            {
                xiansuqijixiesuduright=true
            }
        }
        if(!xiansuqijixiesuduright)
        {
            addstrtip('注意限速器机械动作速度！')
        }
        var gkxiansuqixiaciriqi = document.getElementById('1622603702341e7ff').textContent.trim().slice(9).replace(/年|月|日/g, '-').slice(0, -1)//限速器下次校验时间
        gkxiansuqixiaciriqi=YearMonthToYearMonthDay(gkxiansuqixiaciriqi)
        var gkdiandongjixinghao = document.getElementById('16226005043886a2').textContent.trim().slice(5)//电动机型号
        if(gkdiandongjixinghao.trim()==='')
        {
            addstrtip('注意电动机型号！')
        }

        var gkdiandongjibianhao = document.getElementById('16226037405401401').textContent.trim().slice(7)//电动机编号
        if(gkdiandongjibianhao.trim()==='')
        {
            addstrtip('注意电动机编号！')
        }
        var gkdiandongjizhuansu = document.getElementById('16226037735274882').textContent.trim().slice(5)//电动机转速

        if(!isNormalInteger(gkdiandongjizhuansu))
        {
            addstrtip('注意电动机转速！')
        }
        var gkdiandongjigonglv = document.getElementById('16226037517277a51').textContent.trim().slice(5)//电动机功率
        var gkdiandongjigonglvright=false
        if(!isNaN(Number(gkdiandongjigonglv)))
        {
            if(parseFloat(gkdiandongjigonglv)>0)
            {
                gkdiandongjigonglvright=true
            }
        }
        if(!gkdiandongjigonglvright)
        {
            addstrtip('注意电动机功率！')
        }
        var gkjiaoxiangguijv = document.getElementById('1622603797267f008').textContent.trim().slice(8)//轿厢轨距

        if(!isNormalInteger(gkjiaoxiangguijv))
        {
            addstrtip('注意轿厢轨距！')
        }
        var gkduizhongguijv = document.getElementById('1622603822238d6b5').textContent.trim().slice(8)//对重轨距

        if(!isNormalInteger(gkduizhongguijv))
        {
            addstrtip('注意对重轨距！')
        }
        var gkdincenggaodu = document.getElementById('1622603844545a342').textContent.trim().slice(7)//顶层高度

        var gkdincenggaoduright=false
        if(!isNaN(Number(gkdincenggaodu)))
        {
            if(parseFloat(gkdincenggaodu)>0)
            {
                gkdincenggaoduright=true
            }
        }
        if(!gkdincenggaoduright)
        {
            addstrtip('注意顶层高度！')
        }

        var gkdikenshendu = document.getElementById('16226038606177731').textContent.trim().slice(4)//底坑深度
        var gkdikenshenduright=false
        if(!isNaN(Number(gkdikenshendu)))
        {
            if(parseFloat(gkdikenshendu)>0)
            {
                gkdikenshenduright=true
            }
        }
        if(!gkdikenshenduright)
        {
            addstrtip('注意底坑深度！')
        }


        //var gkshigongxukezhengbianhao = document.getElementById('1639889662468977c').textContent.trim().slice(7)//施工许可证编号
        var gkshigongxukezhengbianhao = document.getElementById('1639889662468977c').innerText.trim()
        if(!/^TS[A-Z\d]{7}-\d{4}$/g.test(gkshigongxukezhengbianhao)){
            addstrtip('施工许可证编号错误！')
        }
         /^TS[A-Z\d]{7}-(\d{4})$/g.test(gkshigongxukezhengbianhao)
        var nian=parseFloat(RegExp.$1)//得到年份
        let currentYear = new Date().getFullYear();
        if(nian<=currentYear){
             addstrtip('施工许可证编号年份错误！')
        }
//         var gkshigongxukezhengbianhaoright=true
//         if(gkshigongxukezhengbianhao.length!=14)
//         {
//             gkshigongxukezhengbianhaoright=false
//         }
//         else
//         {
//             if(gkshigongxukezhengbianhao.substr(0,4)!='TS33')
//             {
//                 gkshigongxukezhengbianhaoright=false
//             }
//             if(parseInt(gkshigongxukezhengbianhao.substr(10,4))===curyear)
//             {
//                 addstrtip('注意施工许可证编号有效期！')
//             }
//             else if(parseInt(gkshigongxukezhengbianhao.substr(10,4))<curyear)
//             {
//                 addstrtip('施工许可证已过有效期！')
//             }
//         }
//         if(!gkshigongxukezhengbianhaoright)
//         {
//             addstrtip('施工许可证编号错误！')
//         }

        var gkxiacijianyanriqi = document.getElementById('16226038825965416').textContent.trim().slice(18).replace(/年|月|日/g, '-').slice(0, -1)//下次检验日期
        gkxiacijianyanriqi=YearMonthToYearMonthDay(gkxiacijianyanriqi)
        var gkshigongdanwei = document.getElementById('163988963891004ef').textContent.trim().slice(6)//施工单位名称
        if(gkshigongdanwei.trim()==='')
        {
            addstrtip('注意制造单位名称！')
        }
        var gkxiacizhidongshijian = document.getElementById('1622603891801fa41').textContent.trim().slice(8).replace(/年|月|日/g, '-').slice(0, -1)//下次制动试验时间
        gkxiacizhidongshijian=YearMonthToYearMonthDay(gkxiacizhidongshijian)
        var gkzhizaodanwei = document.getElementById('1622600504388ae6').innerText.trim()//制造单位名称
        if(gkzhizaodanwei.trim()==='')
        {
            addstrtip('注意制造单位名称！')
        }
        var gkweibaodanwei = document.getElementById('1622603937963d516').textContent.trim().slice(6)//维护保养单位名称
        if(gkweibaodanwei.trim()==='')
        {
            addstrtip('注意维护保养单位名称！')
        }

        var gkshiyongdanweidizhi = document.getElementById('16226039460826631').textContent.trim().slice(6)//使用单位地址
        if(gkshiyongdanweidizhi.trim()==='')
        {
            addstrtip('注意使用单位地址！')
        }


        var gkanquangaunli = document.getElementById('1622603985752fdef').textContent.trim().slice(6)//安全管理人员
        if(gkanquangaunli.trim()==='')
        {
            addstrtip('注意安全管理人员！')
        }

        var gkanquanguanlidianhua = document.getElementById('16226039923688964').textContent.trim().slice(10)//安全管理人员电话
        var dianhuaright=false

        if(gkanquanguanlidianhua.length===11|| (gkanquanguanlidianhua.length===12&&(gkanquanguanlidianhua.search('-')!=-1)))
        {
            var ssgkanquanguanlidianhua=gkanquanguanlidianhua.replace('-','')
            if(isNormalInteger(ssgkanquanguanlidianhua))
            {
                dianhuaright=true
            }
        }
        if(!dianhuaright)
        {
            addstrtip('安全管理人员电话不正确！')
        }

        var gkbeizhu = document.getElementById('16226040111081cc9').textContent.trim().slice(4); //alert(gkbeizhu)//概况备注
        var jljianyanjielun = document.getElementById('1622604043713a7d9').textContent.trim().slice(16);//alert(jljianyanjielun)//检验结论
        var jljianyanrenyuan = document.getElementById('1622604081031bd43').innerText.trim()//检验人员
        var jljianyanriqi = document.getElementById('1622604083285c65d').textContent.trim().slice(4).replace(/年|月|日/g, '-').slice(0, -1);//alert(jljianyanriqi)//检验人员日期
        jljianyanriqi=YearMonthToYearMonthDay(jljianyanriqi)
        var jljiaoherenyuan = document.getElementById('1622604087149b143').innerText.trim()//校核人员
        var jljiaoheriqi = document.getElementById('1622604089537d38d').textContent.trim().slice(4).replace(/年|月|日/g, '-').slice(0, -1);//alert(jljiaoheriqi)//校核人员日期
        jljiaoheriqi=YearMonthToYearMonthDay(jljiaoheriqi)
        var jlbeizhu = document.getElementById('16226041152308df0').textContent.trim().slice(6);//alert(jlbeizhu)//结论备注



        var checkdoor6_7 = document.getElementById('1622534824719fce8').textContent.trim().slice(5);//alert(checkdoor6_7)//自动关闭层门装置抽查
        var checkdoor6_8 = document.getElementById('1622534852260eb90').textContent.trim().slice(5);//alert(checkdoor6_8)//紧急开锁装置抽查
        var checkdoor6_10 = document.getElementById('1622534854401c820').textContent.trim().slice(5);//alert(checkdoor6_10)//门的闭合抽查
        var strcheckdoor6_7 = checkdoor6_7.split("、")
        var strcheckdoor6_8 = checkdoor6_8.split("、")
        var strcheckdoor6_10 = checkdoor6_10.split("、")
        var intgkcengshu=parseInt(gkcengshu)
        var intgkzhanshu=parseInt(gkzhanshu)
        var intgkmenshu=parseInt(gkmenshu)
        if(intgkcengshu<intgkzhanshu||intgkmenshu>intgkzhanshu*2||intgkzhanshu>intgkmenshu)
        {
            addstrtip('注意层站门数量是否不合理！')
        }
        //电梯速度验证
        var calsudu=(parseInt(gkdiandongjizhuansu)*3.1415926*parseInt(gkyeyinlunjiejin))/(60000*gkyeyinbif*gksubif);//alert(calsudu)
        calsudu=calsudu.toFixed(2)
        if(Math.abs(calsudu-parseFloat(gkedinsudu))>0.001)
        {
            var sudutip='计算速度：'+calsudu.toString()+'与电梯速度：'+gkedinsudu+'不一致！'
            addstrtip(sudutip);

        }


        //门系统检测记录验证
        if((intgkcengshu>2&&strcheckdoor6_7.length<3)||(strcheckdoor6_7.length-2)<((intgkmenshu-2)*0.2)
           ||(strcheckdoor6_8.length-2)<((intgkmenshu-2)*0.2)
           ||(strcheckdoor6_10.length-2)<((intgkmenshu-2)*0.2))//减去2是去除基站、端站的数量，当基站与端站同为1层时为2，考虑最不利情况
        {
            addstrtip('注意抽查层门数量是否不合理！')
        }
        var heli=true
        for(var k=2;k<strcheckdoor6_7.length;k++)
        {
            if(parseInt(strcheckdoor6_7[k])>=(intgkcengshu-2))//一般地下最多两层，考虑最不利情况
            {
                heli=false
                break
            }
        }
        for(k=2;k<strcheckdoor6_8.length;k++)
        {
            if(parseInt(strcheckdoor6_8[k])>=(intgkcengshu-2))//一般地下最多两层，考虑最不利情况
            {
                heli=false
                break
            }
        }
        for(k=2;k<strcheckdoor6_10.length;k++)
        {
            if(parseInt(strcheckdoor6_10[k])>=(intgkcengshu-2))//一般地下最多两层，考虑最不利情况
            {
                heli=false
                break
            }
        }
        if(!heli)
        {
            addstrtip('注意抽查层门层数是否不合理！')
        }

        //验证备注
        if(jlbeizhu==='')
        {
            addstrtip('结论备注为空！')
        }
        if(gkbeizhu==='')
        {
            addstrtip('概况备注为空！')
        }

        //获取日期date

        //制造日期
        var zhizaodate=StringToDate(gkzhizaoriqi)


        //封面检验日期
        var jyrqdate=StringToDate(jyrq)

        //检验人员日期
        var jyrengyuanriqidate=StringToDate(jyrengyuanriqi)

        //受检单位签字日期
        var shoujianrenriqidate=StringToDate(shoujianrenriqi)

        //下次检验日期
        var gkxiacijianyanriqidate=StringToDate(gkxiacijianyanriqi)

        //限速器下次校验时间
        var gkxiansuqixiaciriqidate=StringToDate(gkxiansuqixiaciriqi)

        //下次制动试验时间gkxiacizhidongshijian
        var gkxiacizhidongshijiandate=StringToDate(gkxiacizhidongshijian)

        //结论中检验人员日期
        var jljianyanriqidate=StringToDate(jljianyanriqi)

        //结论中校核人员日期
        var jljiaoheriqidate=StringToDate(jljiaoheriqi)


        if((Math.abs(jyrqdate-curdate)/(1*24*60*60*1000))>30)
        {
            addstrtip('注意封面检验日期是否合理！')
        }


        var floatedinsudu=parseFloat(gkedinsudu)
        var date20171001=StringToDate('2017-10-01')
        var date20180101=StringToDate('2018-01-01')
        var date20160701=StringToDate('2016-07-01')


        /*var keyiright=false
        usemap.forEach(function(value,key){
            if(key===curmonth)
            {
                var con;
                con=prompt('请输入校验码！')
                if(con===value)
                {
                    keyiright=true
                }
            }
        });
        if(!keyiright)
        {
            return
        }*/

        //检验日期逻辑判断
        if(!(jyrqdate.getTime()===jyrengyuanriqidate.getTime()&&jyrqdate.getTime()===shoujianrenriqidate.getTime()&&jyrqdate.getTime()===jljianyanriqidate.getTime()))
        {
            addstrtip('封面检验日期、检验人员签名日期、受检方确认签名日期、综合结论检验人员签字日期不一致！')
        }
        //下次、限速器、制动时间月份一致性逻辑判断
        if(!(gkxiacijianyanriqidate.getMonth()===gkxiansuqixiaciriqidate.getMonth()&&gkxiacijianyanriqidate.getMonth()===gkxiacizhidongshijiandate.getMonth()))
        {
            addstrtip('下次检验日期、限速器下次校验时间、下次制动试验时间中月份不一致！')

        }

        //下次检验日期、限速器下次校验时间、下次制动试验时间中年份验证
        if(!(gkxiacijianyanriqidate.getFullYear()-jyrqdate.getFullYear()===1
             &&gkxiansuqixiaciriqidate.getFullYear()-jyrqdate.getFullYear()===2
             &&gkxiacizhidongshijiandate.getFullYear()-jyrqdate.getFullYear()===5))
        {
            addstrtip('下次检验日期、限速器下次校验时间、下次制动试验时间中年份错误！')

        }
        if(!(zhizaodate.getTime()<=jyrqdate.getTime()))
        {
            addstrtip('制造日期与检验日期矛盾！')

        }

        if(!(jljianyanriqidate.getTime()<=jljiaoheriqidate.getTime()))
        {
            addstrtip('结论中检验日期与校核日期矛盾！')

        }

        /*if(gkzhizaoriqi!='2022-10-16'&&gkzhizaoriqi!='2022-06-10'&&gkzhizaoriqi!='2022-09-30'){
            addstrtip('注意制造日期  2022年10月16日 2022年06月10日 2022年09月30日！')
        }


        if(sgdanweiname!='辽宁三洋电梯制造有限公司')
        {
            addstrtip('注意封面施工单位名称 辽宁三洋电梯制造有限公司！')
        }


        if(username!='宁夏盛源房地产开发有限公司')
        {
            addstrtip('注意封面使用单位名称 宁夏盛源房地产开发有限公司！')
        }
        if(gkanzhuangdidian.search('香山悦府')===-1){
            addstrtip('注意使用单位地址 香山悦府')
        }
        if(gkxinghao!='SY-320'){
            addstrtip('注意设备型号 SY-320')
        }
        if(gkchanpingbianhao.search('22SY-TK-020A')===-1){
            addstrtip('注意产品编号 22SY-TK-020A')
        }
        if(gktishenggaodu!='76.3')
        {
            addstrtip('注意提升高度 76.3')
        }
        if(gkedinzaizhongliang!='1000')
        {
            addstrtip('注意额定载重量 1000')
        }
        if(gkedinsudu!='1.75')
        {
            addstrtip('注意额定速度 1.75')
        }
        if(gkcengshu!='26'&&gkcengshu!='18'&&gkcengshu!='20')
        {
            addstrtip('注意层数26 18 20！')
        }
        if(gkkongzhifangshi!='集选'&&gkkongzhifangshi!='集选控制')
        {
            addstrtip('注意控制方式 集选控制')
        }
        if(gkyeyinjixinghao!='MCK200')
        {
            addstrtip('注意曳引机型号 MCK200')
        }
        if(gkduizhongkuai!='28块')
        {
            addstrtip('注意对重块数量 28块')
        }
        if(gkyeyinshengshugangdaishu!='6')
        {
            addstrtip('注意曳引绳数 6')
        }
        if(gkyeyinshengzhijingangdaikuandu!='8')
        {
            addstrtip('注意曳引绳直径 8')
        }
        if(gkyeyinlunjiejin!='400')
        {
            addstrtip('注意曳引轮节径 400')
        }

        if(gkkongzhipingxinghao!='SY-KZG-T')
        {
            addstrtip('注意控制屏型号！ SY-KZG-T')
        }
        if(gkkongzhipingbianhao.search('22SY-TK-020A')===-1)
        {
            addstrtip('注意控制屏编号！ 22SY-TK-020A')
        }
        if(gkxiansuqixinghao!='XS-240')
        {
            addstrtip('注意限速器型号！ XS-240')
        }
        if(gkxiansuqibianhao.search('22065')===-1)
        {
            addstrtip('注意限速器编号！ 22065')
        }
        if(gkxiansuqijixiedongzuosudu.search('2.2')===-1){
            addstrtip('注意限速器机械动作速度！ 2.2')
        }
        if(gkxiansuqixiaciriqi!='2025-10-01'){
            addstrtip('注意限速器下次校验时间！ 2025年10月')
        }
        if(gkdiandongjizhuansu!='167'){
            addstrtip('注意电动机转速 167')
        }
        if(gkdiandongjigonglv!='11.7'){
            addstrtip('注意电动机功率 11.7')
        }
        if(gkjiaoxiangguijv!='1720'){
            addstrtip('注意轿厢轨距 1720')
        }
        if(gkduizhongguijv!='1100'){
            addstrtip('注意对重轨距 1100')
        }
        if(gkdincenggaodu!='5'){
            addstrtip('注意顶层高度 5')
        }
        if(gkdikenshendu!='1.4'){
            addstrtip('注意底坑深度 1.4')
        }
        if(gkshigongxukezhengbianhao!='TS2310826-2024'){
            addstrtip('注意施工许可证编号 TS2310826-2024')
        }
        if(gkxiacijianyanriqi!='2024-10-01'){
            addstrtip('注意下次检验时间！ 2024年10月')
        }
        if(gkxiacizhidongshijian!='2028-10-01'){
            addstrtip('注意下次制动时间！ 2028年10月')
        }
        if(gkzhizaodanwei!='辽宁三洋电梯制造有限公司'){
            addstrtip('注意制造单位 辽宁三洋电梯制造有限公司')
        }
        if(gkweibaodanwei!='宁夏捷登电梯工程有限公司'){
            addstrtip('注意维护保养单位 宁夏捷登电梯工程有限公司')
        }
        if(gkshiyongdanweidizhi!='中卫市沙坡头区应理南街345号'){
            addstrtip('注意使用单位地址 中卫市沙坡头区应理南街345号')
        }
        if(gkanquangaunli!='赵盟'){
            addstrtip('注意安全管理人员 赵盟')
        }
        if(gkanquanguanlidianhua!='18795388807'){
            addstrtip('注意安全管理人员 18795388807')
        }*/

        var mark1_1 = document.getElementById('16226042240460566').innerText.trim()
        var mark1_1_1 = document.getElementById('16226042695801625').innerText.trim()
        var mark1_1_2 = document.getElementById('1622604356035b946').innerText.trim()
        var mark1_1_3 = document.getElementById('162260438874287a8').innerText.trim()
        var mark1_1_4 = document.getElementById('16226043887430304').innerText.trim()
        var mark1_1_5 = document.getElementById('1622604388744fc1b').innerText.trim()
        var mark1_1_6 = document.getElementById('1622604388744a601').innerText.trim()
        fenxiangjlmap.set('mark1_1',mark1_1)
        fenxiangmap.set('mark1_1_1',mark1_1_1)
        fenxiangmap.set('mark1_1_2',mark1_1_2)
        fenxiangmap.set('mark1_1_3',mark1_1_3)
        fenxiangmap.set('mark1_1_4',mark1_1_4)
        fenxiangmap.set('mark1_1_5',mark1_1_5)
        fenxiangmap.set('mark1_1_6',mark1_1_6)
        if(!((mark1_1_1 === '×'||mark1_1_2 === '×'||mark1_1_3 === '×'
              ||mark1_1_4 === '×'||mark1_1_5 === '×'||mark1_1_6 === '×'
             ) && mark1_1 === '×'||
             (mark1_1_1 != '×'&&mark1_1_2 != '×'&&mark1_1_3 != '×'
              &&mark1_1_4 != '×'&&mark1_1_5 != '×'&&mark1_1_6 != '×'
             ) && mark1_1 != '×'))
        {
            addstrtip('mark1_1结论有误！')
        }

        var mark1_2 = document.getElementById('16226042437264392').innerText.trim()
        var mark1_2_1 = document.getElementById('162260447353385f4').innerText.trim()
        var mark1_2_2 = document.getElementById('1647413864739595c').innerText.trim()
        var mark1_2_3 = document.getElementById('1647413887971a18c').innerText.trim()
        var mark1_2_4 = document.getElementById('16226045478641c56').innerText.trim()
        var mark1_2_5 = document.getElementById('16226045645734648').innerText.trim()
        var mark1_2_6 = document.getElementById('162260456457433d6').innerText.trim()
        var mark1_2_7 = document.getElementById('16226045645759421').innerText.trim()
        fenxiangjlmap.set('mark1_2',mark1_2)
        fenxiangmap.set('mark1_2_1',mark1_2_1)
        fenxiangmap.set('mark1_2_2',mark1_2_2)
        fenxiangmap.set('mark1_2_3',mark1_2_3)
        fenxiangmap.set('mark1_2_4',mark1_2_4)
        fenxiangmap.set('mark1_2_5',mark1_2_5)
        fenxiangmap.set('mark1_2_6',mark1_2_6)
        fenxiangmap.set('mark1_2_7',mark1_2_7)
        if(!((mark1_2_1 === '×'||mark1_2_2 === '×'||mark1_2_3 === '×'
              ||mark1_2_4 === '×'||mark1_2_5 === '×'||mark1_2_6 === '×'||mark1_2_7 === '×'
             ) && mark1_2 === '×'||
             (mark1_2_1 != '×'&&mark1_2_2 != '×'&&mark1_2_3 != '×'
              &&mark1_2_4 != '×'&&mark1_2_5 != '×'&&mark1_2_6 != '×'&&mark1_2_7 != '×'
             ) && mark1_2 != '×'))
        {
            addstrtip('mark1_2结论有误！')
        }

        var mark1_3 = document.getElementById('1622604243727f1a2').innerText.trim()
        var mark1_3_1 = document.getElementById('162260449831128c9').innerText.trim()
        var mark1_3_2 = document.getElementById('16226046167468394').innerText.trim()
        var mark1_3_3 = document.getElementById('16226046422493ea3').innerText.trim()
        var mark1_3_41 = document.getElementById('16226264933294726').innerText.trim()
        var mark1_3_42 = document.getElementById('16226265559014055').innerText.trim()
        var mark1_3_43 = document.getElementById('1622626582684da0d').innerText.trim()
        var mark1_3_5 = document.getElementById('1622626603372cea4').innerText.trim()
        var mark1_3_6 = document.getElementById('162262663860317c3').innerText.trim()
        var mark1_3_7 = document.getElementById('16226266496002438').innerText.trim()
        fenxiangjlmap.set('mark1_3',mark1_3)
        fenxiangmap.set('mark1_3_1',mark1_3_1)
        fenxiangmap.set('mark1_3_2',mark1_3_2)
        fenxiangmap.set('mark1_3_3',mark1_3_3)
        fenxiangmap.set('mark1_3_41',mark1_3_41)
        fenxiangmap.set('mark1_3_42',mark1_3_42)
        fenxiangmap.set('mark1_3_43',mark1_3_43)
        fenxiangmap.set('mark1_3_5',mark1_3_5)
        fenxiangmap.set('mark1_3_6',mark1_3_6)
        fenxiangmap.set('mark1_3_7',mark1_3_7)
        if(!((mark1_3_1 === '×'||mark1_3_2 === '×'||mark1_3_3 === '×'
              ||mark1_3_41 === '×'||mark1_3_42 === '×'||mark1_3_43 === '×'||mark1_3_5 === '×'||mark1_3_6 === '×'||mark1_3_7 === '×'
             ) && mark1_3 === '×'||
             (mark1_3_1 != '×'&&mark1_3_2 != '×'&&mark1_3_3 != '×'
              &&mark1_3_41 != '×'&&mark1_3_42 != '×'&&mark1_3_43 != '×'&&mark1_3_5 != '×'&&mark1_3_6 != '×'&&mark1_3_7 != '×'
             ) && mark1_3 != '×'))
        {
            addstrtip('mark1_3结论有误！')
        }

        var mark1_4 = document.getElementById('1622626457352d1e8').innerText.trim()
        var mark1_4_1 = document.getElementById('1622626675105bd8e').innerText.trim()
        var mark1_4_2 = document.getElementById('162262669834119b1').innerText.trim()
        var mark1_4_3 = document.getElementById('1622626740309b89e').innerText.trim()
        var mark1_4_4 = document.getElementById('1622626760962884b').innerText.trim()
        var mark1_4_5 = document.getElementById('16226267791735f5a').innerText.trim()
        fenxiangjlmap.set('mark1_4',mark1_4)
        fenxiangmap.set('mark1_4_1',mark1_4_1)
        fenxiangmap.set('mark1_4_2',mark1_4_2)
        fenxiangmap.set('mark1_4_3',mark1_4_3)
        fenxiangmap.set('mark1_4_4',mark1_4_4)
        fenxiangmap.set('mark1_4_5',mark1_4_5)
        if(!((mark1_4_1 === '×'||mark1_4_2 === '×'||mark1_4_3 === '×'
              ||mark1_4_4 === '×'||mark1_4_5 === '×'
             ) && mark1_4 === '×'||
             (mark1_4_1 != '×'&&mark1_4_2 != '×'&&mark1_4_3 != '×'
              &&mark1_4_4 != '×'&&mark1_4_5 != '×'
             ) && mark1_4 != '×'))
        {
            addstrtip('mark1_4结论有误！')
        }
        if(mark1_4_1=== '×')
        {
            if(jlbeizhu==='-'||jlbeizhu==='无')
            {
                addstrtip('未注册不合格应备注说明！')
            }
        }


        var mark2_1 = document.getElementById('1622626476900c6b6').innerText.trim()
        var mark2_1_1 = document.getElementById('1622626816567a57a').innerText.trim()
        var mark2_1_11 = document.getElementById('1622626852654e60d').innerText.trim()
        var mark2_1_12 = document.getElementById('1622626877825ed8e').innerText.trim()
        var mark2_1_13 = document.getElementById('1622626901342c1d7').innerText.trim()
        var mark2_1_14 = document.getElementById('1622626916098885a').innerText.trim()
        var mark2_1_2 = document.getElementById('16226269466164a48').innerText.trim()
        var mark2_1_31 = document.getElementById('1622626982211d6ac').innerText.trim()
        var mark2_1_32 = document.getElementById('16226270142073bcd').innerText.trim()
        var mark2_1_33 = document.getElementById('16226270312148bfb').innerText.trim()
        fenxiangjlmap.set('mark2_1',mark2_1)
        fenxiangmap.set('mark2_1_1',mark2_1_1)
        fenxiangmap.set('mark2_1_11',mark2_1_11)
        fenxiangmap.set('mark2_1_12',mark2_1_12)
        fenxiangmap.set('mark2_1_13',mark2_1_13)
        fenxiangmap.set('mark2_1_14',mark2_1_11)
        fenxiangmap.set('mark2_1_2',mark2_1_2)
        fenxiangmap.set('mark2_1_31',mark2_1_31)
        fenxiangmap.set('mark2_1_32',mark2_1_32)
        fenxiangmap.set('mark2_1_33',mark2_1_33)

        if(!((mark2_1_1 === '×'||mark2_1_11 === '×'||mark2_1_12 === '×'
              ||mark2_1_13 === '×'||mark2_1_14 === '×'||mark2_1_2 === '×'||
              mark2_1_31 === '×'||mark2_1_32 === '×'||mark2_1_33 === '×'
             ) && mark2_1 === '×'||
             (mark2_1_1 != '×'&&mark2_1_11 != '×'&&mark2_1_12 != '×'
              &&mark2_1_13 != '×'&&mark2_1_14 != '×'&&mark2_1_2 != '×'
              &&mark2_1_31 != '×'&&mark2_1_32 != '×'&&mark2_1_33 != '×'
             ) && mark2_1 != '×'))
        {
            addstrtip('2_1结论有误！')
        }

        if( mark2_1_11 === '-'&&mark2_1_12 === '-' && mark2_1_13 === '-'&& mark2_1_14 === '-')
        {
            strinput=strinput+'无爬梯    '
        }
        else if( mark2_1_11 != '-'&&mark2_1_12 !='-' && mark2_1_13 !='-'&& mark2_1_14 !='-')
        {
            strinput=strinput+'有爬梯    '
        }
        else
        {
            strinput=strinput+'爬梯部分勾选    '
        }
        if( mark2_1_31 === '-'&&mark2_1_32 === '-' && mark2_1_33 === '-')
        {
            strinput=strinput+'无机房门    '
        }
        else if( mark2_1_31 != '-'&&mark2_1_32 !='-' && mark2_1_33 !='-')
        {
            strinput=strinput+'有机房门    '
        }
        else
        {
            strinput=strinput+'机房门部分勾选    '
        }
        var mark2_2 = document.getElementById('16226264769012b67').innerText.trim()
        var mark2_2_1 = document.getElementById('1622627048063b38e').innerText.trim()
        fenxiangjlmap.set('mark2_2',mark2_2)
        fenxiangmap.set('mark2_2_1',mark2_2_1)

        if(!((mark2_2_1 === '×') && mark2_2 === '×'||
             (mark2_2_1 != '×') && mark2_2 != '×'))
        {
            addstrtip('2_2结论有误！')
        }

        var mark2_3 = document.getElementById('16226271943647251').innerText.trim()
        var mark2_3_1 = document.getElementById('162262722995766ab').innerText.trim()
        var mark2_3_2 = document.getElementById('16226272639883625').innerText.trim()
        var mark2_3_3 = document.getElementById('16226272854057b10').innerText.trim()
        fenxiangjlmap.set('mark2_3',mark2_3)
        fenxiangmap.set('mark2_3_1',mark2_3_1)
        fenxiangmap.set('mark2_3_2',mark2_3_2)
        fenxiangmap.set('mark2_3_3',mark2_3_3)
        if(!((mark2_3_1 === '×'||mark2_3_2 === '×'||mark2_3_3 === '×'
             ) && mark2_3 === '×'||
             (mark2_3_1 != '×'&&mark2_3_2 != '×'&&mark2_3_3 != '×'
             ) && mark2_3 != '×'))
        {
            addstrtip('mark2_3结论有误！')
        }
        if(mark2_3_3!='-')
        {
            strinput=strinput+'机房地面高度差大于0.5且有楼梯护栏    '
        }
        else
        {
            strinput=strinput+'机房地面高度差不大于0.5没有楼梯护栏    '
        }


        var mark2_4 = document.getElementById('1622627214468f429').innerText.trim()
        var mark2_4_1 = document.getElementById('162262730456011cc').innerText.trim()
        fenxiangjlmap.set('mark2_4',mark2_4)
        fenxiangmap.set('mark2_4_1',mark2_4_1)

        if(!((mark2_4_1 === '×') && mark2_4 === '×'||
             (mark2_4_1 != '×') && mark2_4 != '×'))
        {
            addstrtip('mark2_4结论有误！')
        }
        if(mark2_4_1!='-')
        {
            strinput=strinput+'有地面开口及圈框    '
        }
        else
        {
            strinput=strinput+'无地面开口及圈框    '
        }


        var mark2_5 = document.getElementById('1647413747985a91b').innerText.trim()
        var mark2_5_11 = document.getElementById('1647413638290acfa').innerText.trim()
        var mark2_5_12 = document.getElementById('16474136761369b6e').innerText.trim()
        var mark2_5_2 = document.getElementById('1647413700785bf24').innerText.trim()
        var mark2_5_3 = document.getElementById('1647413720655ca83').innerText.trim()
        fenxiangjlmap.set('mark2_5',mark2_5)
        fenxiangmap.set('mark2_5_11',mark2_5_11)
        fenxiangmap.set('mark2_5_12',mark2_5_12)
        fenxiangmap.set('mark2_5_2',mark2_5_2)
        fenxiangmap.set('mark2_5_3',mark2_5_3)

        if(!((mark2_5_11 === '×'||mark2_5_12 === '×'||mark2_5_2 === '×'||mark2_5_3 === '×'
             ) && mark2_5 === '×'||
             (mark2_5_11 != '×'&&mark2_5_12 != '×'&&mark2_5_2 != '×'&&mark2_5_3 != '×'
             ) && mark2_5 != '×'))
        {
            addstrtip('2_5结论有误！')
        }

        var mark2_6 = document.getElementById('16474130724200d78').innerText.trim()
        var mark2_6_1 = document.getElementById('1647412871795f018').innerText.trim()
        var mark2_6_11 = document.getElementById('1647412901835b8df').innerText.trim()
        var mark2_6_12 = document.getElementById('1647412924939773a').innerText.trim()
        var mark2_6_13 = document.getElementById('1647412967308bfbe').innerText.trim()
        var mark2_6_2 = document.getElementById('16474129945176c4c').innerText.trim()
        var mark2_6_3 = document.getElementById('1647413020700bd8f').innerText.trim()
        var mark2_6_4 = document.getElementById('16474130440843e85').innerText.trim()
        fenxiangjlmap.set('mark2_6',mark2_6)
        fenxiangmap.set('mark2_6_1',mark2_6_1)
        fenxiangmap.set('mark2_6_11',mark2_6_11)
        fenxiangmap.set('mark2_6_12',mark2_6_12)
        fenxiangmap.set('mark2_6_13',mark2_6_13)
        fenxiangmap.set('mark2_6_2',mark2_6_2)
        fenxiangmap.set('mark2_6_3',mark2_6_3)
        fenxiangmap.set('mark2_6_4',mark2_6_4)
        if(!((mark2_6_1 === '×'||mark2_6_11 === '×'||mark2_6_12 === '×'
              ||mark2_6_13 === '×'||mark2_6_2 === '×'||mark2_6_3 === '×'||mark2_6_4 === '×'
             ) && mark2_6 === '×'||
             (mark2_6_1 != '×'&&mark2_6_11 != '×'&&mark2_6_12 != '×'
              &&mark2_6_13 != '×'&&mark2_6_2 != '×'&&mark2_6_3 != '×'&&mark2_6_4 != '×'
             ) && mark2_6 != '×'))
        {
            addstrtip('mark2_6结论有误！')
        }
        if(mark2_6_13!='-')
        {
            strinput=strinput+'控制柜有分断主电源的断路器    '
        }
        else
        {
            strinput=strinput+'控制柜无分断主电源的断路器    '
        }
        if(mark2_6_4!='-')
        {
            strinput=strinput+'共用机房    '
        }
        else
        {
            strinput=strinput+'不共用机房    '
        }
        if(mark2_6_12!='-'){
            addstrtip('控制柜不能操作主开关！')
        }
        if(mark2_6_12==='-'){
            addstrtip('控制柜能操作主开关！')
        }


        var mark2_7 = document.getElementById('164741347666912f3').innerText.trim()
        var mark2_7_1 = document.getElementById('164741313905988a7').innerText.trim()
        var mark2_7_2 = document.getElementById('16474131739989bd4').innerText.trim()
        var mark2_7_31 = document.getElementById('1647413195884c263').innerText.trim()
        var mark2_7_32 = document.getElementById('1647413222771814d').innerText.trim()
        var mark2_7_41 = document.getElementById('1647413241743a258').innerText.trim()
        var mark2_7_42 = document.getElementById('1647413284854897c').innerText.trim()
        var mark2_7_43 = document.getElementById('1647413322644fa31').innerText.trim()
        var mark2_7_51 = document.getElementById('1647413345378c0eb').innerText.trim()
        var mark2_7_52 = document.getElementById('1647413373624227d').innerText.trim()
        var mark2_7_53 = document.getElementById('1647413396221a50b').innerText.trim()
        var mark2_7_54 = document.getElementById('16474134265028a1d').innerText.trim()
        var mark2_7_55 = document.getElementById('1647413453151ad73').innerText.trim()

        fenxiangjlmap.set('mark2_7',mark2_7)
        fenxiangmap.set('mark2_7_1',mark2_7_1)
        fenxiangmap.set('mark2_7_2',mark2_7_2)
        fenxiangmap.set('mark2_7_31',mark2_7_31)
        fenxiangmap.set('mark2_7_32',mark2_7_32)
        fenxiangmap.set('mark2_7_41',mark2_7_41)
        fenxiangmap.set('mark2_7_42',mark2_7_42)
        fenxiangmap.set('mark2_7_43',mark2_7_43)
        fenxiangmap.set('mark2_7_51',mark2_7_51)
        fenxiangmap.set('mark2_7_52',mark2_7_52)
        fenxiangmap.set('mark2_7_53',mark2_7_53)
        fenxiangmap.set('mark2_7_54',mark2_7_54)
        fenxiangmap.set('mark2_7_55',mark2_7_55)

        if(!((mark2_7_1 === '×'||mark2_7_2 === '×'||mark2_7_31 === '×'||mark2_7_32 === '×'
              ||mark2_7_41 === '×'||mark2_7_42 === '×'||mark2_7_43 === '×'||mark2_7_51 === '×'||mark2_7_52 === '×'
              ||mark2_7_53 === '×'||mark2_7_54 === '×'||mark2_7_55 === '×'
             ) && mark2_7 === '×'||
             (mark2_7_1 != '×'&&mark2_7_2 != '×'&&mark2_7_31 != '×'&&mark2_7_32 != '×'
              &&mark2_7_41 != '×'&&mark2_7_42 != '×'&&mark2_7_43 != '×'&&mark2_7_51 != '×'
              &&mark2_7_52 != '×'&&mark2_7_53 != '×'&&mark2_7_54 != '×'
              &&mark2_7_55 != '×'
             ) && mark2_7 != '×'))
        {
            addstrtip('2_7结论有误！')
        }
        if(mark2_7_51 === '-'&&mark2_7_52 === '-'&&mark2_7_53=== '-'&&mark2_7_54=== '-' &&mark2_7_55 === '-')
        {
            strinput=strinput+'盘车松闸未勾选    '
        }
        else if(mark2_7_51 != '-'&&mark2_7_52 != '-'&&mark2_7_53!= '-'&&mark2_7_54!='-' &&mark2_7_55 != '-')
        {
            strinput=strinput+'盘车松闸勾选    '
        }
        else
        {
            strinput=strinput+'盘车松闸部分勾选    '
        }
        if(mark2_7_32!='-')
        {
            addstrtip('2_7注意是否需要曳引能力验证！')
        }

        var mark2_8 = document.getElementById('1647414754972de9f').innerText.trim()
        var mark2_8_1 = document.getElementById('1647414171536ce86').innerText.trim()
        var mark2_8_21 = document.getElementById('1647414194713d339').innerText.trim()
        var mark2_8_22 = document.getElementById('16474142191892cb8').innerText.trim()
        var mark2_8_3 = document.getElementById('16474142413709dbe').innerText.trim()

        var mark2_8_41 = document.getElementById('16474142721868c6a').innerText.trim()
        var mark2_8_42 = document.getElementById('16474142933268e14').innerText.trim()
        var mark2_8_43 = document.getElementById('16474143159811e73').innerText.trim()
        var mark2_8_51 = document.getElementById('16474143355966f80').innerText.trim()
        var mark2_8_52 = document.getElementById('1647414374139fd6e').innerText.trim()
        var mark2_8_53 = document.getElementById('1647414400468bf90').innerText.trim()
        var mark2_8_54 = document.getElementById('1647414425348c0a0').innerText.trim()
        var mark2_8_61 = document.getElementById('1647414448493ed0d').innerText.trim()
        var mark2_8_62 = document.getElementById('1647414467785d76d').innerText.trim()
        var mark2_8_63 = document.getElementById('16474144894783dd2').innerText.trim()
        var mark2_8_64 = document.getElementById('16474145120342d46').innerText.trim()
        var mark2_8_71 = document.getElementById('16474145462218032').innerText.trim()
        var mark2_8_72 = document.getElementById('1647414566898f6ad').innerText.trim()
        var mark2_8_8 = document.getElementById('164741459048565a4').innerText.trim()
        var mark2_8_91 = document.getElementById('164741460968637cc').innerText.trim()
        var mark2_8_92 = document.getElementById('164741463148285f9').innerText.trim()
        var mark2_8_93 = document.getElementById('16474146558249fad').innerText.trim()
        var mark2_8_94 = document.getElementById('1647414679073ce5b').innerText.trim()
        var mark2_8_10 = document.getElementById('1647414701830840d').innerText.trim()
        var mark2_8_11 = document.getElementById('16474147309652c9d').innerText.trim()
        fenxiangjlmap.set('mark2_8',mark2_8)
        fenxiangmap.set('mark2_8_1',mark2_8_1)
        fenxiangmap.set('mark2_8_21',mark2_8_21)
        fenxiangmap.set('mark2_8_22',mark2_8_22)
        fenxiangmap.set('mark2_8_3',mark2_8_3)
        fenxiangmap.set('mark2_8_41',mark2_8_41)
        fenxiangmap.set('mark2_8_42',mark2_8_42)
        fenxiangmap.set('mark2_8_43',mark2_8_43)
        fenxiangmap.set('mark2_8_51',mark2_8_51)
        fenxiangmap.set('mark2_8_52',mark2_8_52)
        fenxiangmap.set('mark2_8_53',mark2_8_53)
        fenxiangmap.set('mark2_8_54',mark2_8_54)
        fenxiangmap.set('mark2_8_61',mark2_8_61)
        fenxiangmap.set('mark2_8_62',mark2_8_62)
        fenxiangmap.set('mark2_8_63',mark2_8_63)
        fenxiangmap.set('mark2_8_64',mark2_8_64)

        fenxiangmap.set('mark2_8_71',mark2_8_71)
        fenxiangmap.set('mark2_8_72',mark2_8_72)
        fenxiangmap.set('mark2_8_8',mark2_8_8)
        fenxiangmap.set('mark2_8_91',mark2_8_91)
        fenxiangmap.set('mark2_8_92',mark2_8_92)
        fenxiangmap.set('mark2_8_93',mark2_8_93)
        fenxiangmap.set('mark2_8_94',mark2_8_94)
        fenxiangmap.set('mark2_8_10',mark2_8_10)
        fenxiangmap.set('mark2_8_11',mark2_8_11)
        if(!((mark2_8_1 === '×'||mark2_8_21 === '×'||mark2_8_22 === '×'||mark2_8_3 === '×'
              ||mark2_8_41 === '×'||mark2_8_42 === '×'||mark2_8_43 === '×'
              ||mark2_8_51 === '×'||mark2_8_52 === '×'||mark2_8_53 === '×'||mark2_8_54 === '×'
              ||mark2_8_61 === '×'||mark2_8_62 === '×'||mark2_8_63 === '×'||mark2_8_64 === '×'
              ||mark2_8_71 === '×'||mark2_8_72 === '×'
              ||mark2_8_8 === '×'
              ||mark2_8_91 === '×'||mark2_8_92 === '×'||mark2_8_93 === '×'||mark2_8_94 === '×'||mark2_8_10 === '×'||mark2_8_11 === '×'
             ) && mark2_8 === '×'||
             (mark2_8_1 != '×'&&mark2_8_21 != '×'&&mark2_8_22 != '×'&&mark2_8_3 != '×'
              &&mark2_8_41 != '×'&&mark2_8_42 != '×'&&mark2_8_43 != '×'
              &&mark2_8_51 != '×'&&mark2_8_52 != '×'&&mark2_8_53 != '×'&&mark2_8_54 != '×'
              &&mark2_8_61 != '×'&&mark2_8_62 != '×'&&mark2_8_63 != '×'&&mark2_8_64 != '×'
              &&mark2_8_71 != '×'&&mark2_8_72 != '×'
              &&mark2_8_8 != '×'
              &&mark2_8_91 != '×'&&mark2_8_92 != '×'&&mark2_8_93 != '×'&&mark2_8_94 != '×'&&mark2_8_10 != '×'&&mark2_8_11 != '×'
             ) && mark2_8 != '×'))
        {
            addstrtip('2_8结论有误！')
        }
        if(mark2_8_22!='-')
        {
            addstrtip('2_8_22注意是否电梯运行与相序无关！')
            strinput=strinput+'电梯运行与相序无关    '
        }
        else
        {
            strinput=strinput+'电梯运行与相序有关    '
        }
        if(mark2_8_91!='-'&&mark2_8_92!='-'&&mark2_8_93!='-'&&mark2_8_94!='-')
        {
            strinput=strinput+'有自动救援    '
            addstrtip('2_8注意是否有自动救援！')
        }
        else if(mark2_8_91==='-'&&mark2_8_92==='-'&&mark2_8_93==='-'&&mark2_8_94==='-')
        {
            strinput=strinput+'无自动救援    '
        }
        else
        {
            strinput=strinput+'自动救援部分勾选    '
        }
        if(mark2_8_10!='-')
        {
            strinput=strinput+'有能量回馈    '
            addstrtip('2_8注意是否有能量回馈！')
        }
        else
        {
            strinput=strinput+'无能量回馈    '
        }
        if(mark2_8_11!='-')
        {
            strinput=strinput+'加装IC卡    '
            addstrtip('2_8注意是否有加装IC卡！')
        }
        else
        {
            strinput=strinput+'未加装IC卡    '
        }

        var mark2_9 = document.getElementById('1647415718456f839').innerText.trim()
        var mark2_9_1 = document.getElementById('1647415185202e268').innerText.trim()
        var mark2_9_21 = document.getElementById('16474152052434303').innerText.trim()
        var mark2_9_22 = document.getElementById('16474152262860283').innerText.trim()
        var mark2_9_3 = document.getElementById('16474152507622679').innerText.trim()
        var mark2_9_4 = document.getElementById('1647415273202d4fc').innerText.trim()
        fenxiangjlmap.set('mark2_9',mark2_9)
        fenxiangmap.set('mark2_9_1',mark2_9_1)
        fenxiangmap.set('mark2_9_21',mark2_9_21)
        fenxiangmap.set('mark2_9_22',mark2_9_22)
        fenxiangmap.set('mark2_9_3',mark2_9_3)
        fenxiangmap.set('mark2_9_4',mark2_9_4)
        if(!((mark2_9_1 === '×'||mark2_9_21 === '×'
              ||mark2_9_22 === '×'||mark2_9_3 === '×'||mark2_9_4 === '×'
             ) && mark2_9 === '×'||
             (mark2_9_1 != '×'&&mark2_9_21 != '×'
              &&mark2_9_22 != '×'&&mark2_9_3 != '×'&&mark2_9_4 != '×'
             ) && mark2_9 != '×'))
        {
            addstrtip('2_9结论有误！')
        }
        var mark2_10 = document.getElementById('1647415734535880a').innerText.trim()
        var mark2_10_1 = document.getElementById('1647415308765d6aa').innerText.trim()
        var mark2_10_2 = document.getElementById('1647415329558d902').innerText.trim()
        fenxiangjlmap.set('mark2_10',mark2_10)
        fenxiangmap.set('mark2_10_1',mark2_10_1)
        fenxiangmap.set('mark2_10_2',mark2_10_2)
        if(!((mark2_10_1 === '×'||mark2_10_2 === '×'
             ) && mark2_10 === '×'||
             (mark2_10_1 != '×'&&mark2_10_2 != '×'
             ) && mark2_10 != '×'))
        {
            addstrtip('2_10结论有误！')
        }


        var mark2_11 = document.getElementById('1647415752037cdea').innerText.trim()
        var mark2_111 = document.getElementById('164741535114036b8').innerText.trim()
        fenxiangjlmap.set('mark2_11',mark2_11)
        fenxiangmap.set('mark2_111',mark2_111)

        if(!((
            //start1
            mark2_111 === '×'
            //end1
        ) && mark2_11 === '×'||(
            //start2
            mark2_111 != '×'
            //end2
        ) && mark2_11 != '×'))
        {
            addstrtip('2_11结论有误！')
        }

        var mark2_12 = document.getElementById('16474157703022491').innerText.trim()
        var mark2_121 = document.getElementById('16474154048413007').innerText.trim()
        var mark2_122 = document.getElementById('164741542773366c7').innerText.trim()
        fenxiangjlmap.set('mark2_12',mark2_12)
        fenxiangmap.set('mark2_121',mark2_121)
        fenxiangmap.set('mark2_122',mark2_122)
        if(!((mark2_121 === '×'||mark2_122 === '×'
             ) && mark2_12 === '×'||
             (mark2_121 != '×'&&mark2_122 != '×'
             ) && mark2_12 != '×'))
        {
            addstrtip('mark2_12结论有误！')
        }

        var mark2_13 = document.getElementById('16474157946300861').innerText.trim()
        var mark2_13_1 = document.getElementById('16474154472861794').innerText.trim()
        var mark2_13_2 = document.getElementById('1647415469382418e').innerText.trim()
        fenxiangjlmap.set('mark2_13',mark2_13)
        fenxiangmap.set('mark2_13_1',mark2_13_1)
        fenxiangmap.set('mark2_13_2',mark2_13_2)
        if(!((mark2_13_1 === '×'||mark2_13_2 === '×'
             ) && mark2_13 === '×'||
             (mark2_13_1 != '×'&&mark2_13_2 != '×'
             ) && mark2_13 != '×'))
        {
            addstrtip('mark2_13结论有误！')
        }

        var mark3_1 = document.getElementById('1647415814102301a').innerText.trim()
        var mark3_1_1 = document.getElementById('1647415488898a0d7').innerText.trim()
        var mark3_1_2 = document.getElementById('16474155070018a2c').innerText.trim()
        var mark3_1_3 = document.getElementById('164741552649258c7').innerText.trim()
        fenxiangjlmap.set('mark3_1',mark3_1)
        fenxiangmap.set('mark3_1_1',mark3_1_1)
        fenxiangmap.set('mark3_1_2',mark3_1_2)
        fenxiangmap.set('mark3_1_3',mark3_1_3)
        if(!((mark3_1_1 === '×'||mark3_1_2 === '×'||mark3_1_3 === '×'
             ) && mark3_1 === '×'||
             (mark3_1_1 != '×'&&mark3_1_2 != '×'&&mark3_1_3 != '×'
             ) && mark3_1 != '×'))
        {
            addstrtip('3_1结论有误！')
        }
        if(mark3_1_2!='-')
        {
            addstrtip('3_1注意是否部分封闭井道！')
            strinput=strinput+'3_1部分封闭井道    '
        }
        else
        {
            strinput=strinput+'3_1非部分封闭井道    '
        }
        if(!(mark3_1_2!='-'&&mark3_1_3!='-'||mark3_1_2==='-'&&mark3_1_3==='-'))
        {
            addstrtip('3_1部分封闭井道勾选矛盾！')
        }

        var mark3_2 = document.getElementById('1647415832126fe37').innerText.trim()
        var mark3_2_11 = document.getElementById('164741554754091b6').innerText.trim()
        var mark3_2_12 = document.getElementById('16474155674543ae2').innerText.trim()
        var mark3_2_13 = document.getElementById('1647415586112b772').innerText.trim()
        var mark3_2_14 = document.getElementById('16474156156653eec').innerText.trim()
        var mark3_2_15 = document.getElementById('1647415636379e76d').innerText.trim()
        var mark3_2_16 = document.getElementById('1647415656026f1ab').innerText.trim()
        var mark3_2_2 = document.getElementById('16474156800406353').innerText.trim()

        fenxiangjlmap.set('mark3_2',mark3_2)
        fenxiangmap.set('mark3_2_11',mark3_2_11)
        fenxiangmap.set('mark3_2_12',mark3_2_12)
        fenxiangmap.set('mark3_2_13',mark3_2_13)
        fenxiangmap.set('mark3_2_14',mark3_2_14)
        fenxiangmap.set('mark3_2_15',mark3_2_15)
        fenxiangmap.set('mark3_2_16',mark3_2_16)
        fenxiangmap.set('mark3_2_2',mark3_2_2)

        if(!((mark3_2_11 === '×'||mark3_2_12 === '×'||mark3_2_13 === '×'||mark3_2_14 === '×'
              ||mark3_2_15 === '×'||mark3_2_16 === '×'||mark3_2_2 === '×'
             ) && mark3_2 === '×'||
             (mark3_2_11 != '×'&&mark3_2_12 != '×'&&mark3_2_13 != '×'&&mark3_2_14 != '×'
              &&mark3_2_15 != '×'&&mark3_2_16 != '×'&&mark3_2_2 != '×'
             ) && mark3_2 != '×'))
        {
            addstrtip('mark3_2结论有误！')
        }
        var mark3_3 = document.getElementById('1647417613604f2ba').innerText.trim()
        var mark3_3_1 = document.getElementById('164741657947266d9').innerText.trim()
        var mark3_3_21 = document.getElementById('1647416606996d3e3').innerText.trim()
        var mark3_3_22 = document.getElementById('16474166296127ca5').innerText.trim()
        var mark3_3_23 = document.getElementById('164741665115840b7').innerText.trim()
        var mark3_3_3 = document.getElementById('1647416672189d72c').innerText.trim()

        fenxiangjlmap.set('mark3_3',mark3_3)
        fenxiangmap.set('mark3_3_1',mark3_3_1)
        fenxiangmap.set('mark3_3_21',mark3_3_21)
        fenxiangmap.set('mark3_3_22',mark3_3_22)
        fenxiangmap.set('mark3_3_23',mark3_3_23)
        fenxiangmap.set('mark3_3_3',mark3_3_3)

        if(!((mark3_3_1 === '×'||mark3_3_21 === '×'||mark3_3_22 === '×'||mark3_3_23 === '×'
              ||mark3_3_3 === '×'
             ) && mark3_3 === '×'||
             (mark3_3_1 != '×'&&mark3_3_21 != '×'&&mark3_3_22 != '×'&&mark3_3_23 != '×'
              &&mark3_3_3 != '×'
             ) && mark3_3 != '×'))
        {
            addstrtip('mark3_3结论有误！')
        }
        if(mark3_3!='-')
        {
            addstrtip('mark3_3强制驱动电梯有勾选！')
        }

        var mark3_4 = document.getElementById('1647417626855915d').innerText.trim()
        var mark3_4_1 = document.getElementById('164741669079912d0').innerText.trim()
        var mark3_4_2 = document.getElementById('16474167119891fe5').innerText.trim()
        var mark3_4_3 = document.getElementById('164741673239709a6').innerText.trim()
        var mark3_4_4 = document.getElementById('16474167547659eff').innerText.trim()
        fenxiangjlmap.set('mark3_4',mark3_4)
        fenxiangmap.set('mark3_4_1',mark3_4_1)
        fenxiangmap.set('mark3_4_2',mark3_4_2)
        fenxiangmap.set('mark3_4_3',mark3_4_3)
        fenxiangmap.set('mark3_4_4',mark3_4_4)

        if(!((//start1
            mark3_4_1 === '×'||mark3_4_2 === '×'||mark3_4_3 === '×'||mark3_4_4 === '×'
            //end1
        ) && mark3_4 === '×'||(
            //start2
            mark3_4_1 != '×'&&mark3_4_2 != '×'&&mark3_4_3 != '×'&&mark3_4_4 != '×'
            //end2
        ) && mark3_4 != '×'))
        {
            addstrtip('3_4结论有误！')
        }

        if(mark3_4_1 === '-'&&mark3_4_2 === '-' && mark3_4_3 === '-'&&mark3_4_4 === '-' && mark3_4 === '-')
        {
            strinput=strinput+'无井道安全门    '
        }
        else if(mark3_4_1 != '-'&&mark3_4_2 !='-' &&mark3_4_3 != '-'&&mark3_4_4 !='-' && mark3_4 !='-')
        {
            //addstrtip('3_4TIP:有井道安全门！')
            strinput=strinput+'有井道安全门    '
        }
        else
        {
            //addstrtip('3_4TIP:井道安全门部分勾选！')
            strinput=strinput+'井道安全门部分勾选    '
        }

        var mark3_5 = document.getElementById('16474176492771db0').innerText.trim()
        var mark3_5_1 = document.getElementById('164741677351990e0').innerText.trim()
        var mark3_5_2 = document.getElementById('1647416793555cfd8').innerText.trim()
        var mark3_5_3 = document.getElementById('1647416817370087f').innerText.trim()
        var mark3_5_4 = document.getElementById('16474169403735651').innerText.trim()

        fenxiangjlmap.set('mark3_5',mark3_5)
        fenxiangmap.set('mark3_5_1',mark3_5_1)
        fenxiangmap.set('mark3_5_2',mark3_5_2)
        fenxiangmap.set('mark3_5_3',mark3_5_3)
        fenxiangmap.set('mark3_5_4',mark3_5_4)
        if(!((//start1
            mark3_5_1 === '×'||mark3_5_2 === '×'||mark3_5_3 === '×'||mark3_5_4 === '×'
            //end1
        ) && mark3_5 === '×'||(
            //start2
            mark3_5_1 != '×'&&mark3_5_2 != '×'&&mark3_5_3 != '×'&&mark3_5_4 != '×'
            //end2
        ) && mark3_5 != '×'))
        {
            addstrtip('3_5结论有误！')
        }

        if(mark3_5_1 === '-'&&mark3_5_2 === '-' && mark3_5_3 === '-'&&mark3_5_4 === '-' && mark3_5 === '-')
        {
            //addstrtip('3_5TIP:无井道检修门！')
            strinput=strinput+'无井道检修门    '
        }
        else if(mark3_5_1 != '-'&&mark3_5_2 !='-' &&mark3_5_3 != '-'&&mark3_5_4 !='-' && mark3_5 !='-')
        {
            //addstrtip('3_5TIP:有井道检修门！')
            strinput=strinput+'有井道检修门    '
        }
        else
        {
            //addstrtip('3_5TIP:井道检修门部分勾选！')
            strinput=strinput+'井道检修门部分勾选    '
        }

        var mark3_6 = document.getElementById('164741766552097c3').innerText.trim()
        var mark3_6_11 = document.getElementById('16474169832489a93').innerText.trim()
        var mark3_6_12 = document.getElementById('1647417005508cea9').innerText.trim()
        var mark3_6_13 = document.getElementById('1647417030190cc04').innerText.trim()

        var mark3_6_21 = document.getElementById('164741707363694fb').innerText.trim()
        var mark3_6_22 = document.getElementById('1647417100456a886').innerText.trim()
        var mark3_6_23 = document.getElementById('1647417118884d59a').innerText.trim()

        var mark3_6_31 = document.getElementById('1647417148060996d').innerText.trim()
        var mark3_6_32 = document.getElementById('16474171639878aa2').innerText.trim()
        var mark3_6_33 = document.getElementById('1647417190844a54f').innerText.trim()
        var mark3_6_34 = document.getElementById('16474172176709735').innerText.trim()

        var mark3_6_41 = document.getElementById('1647417242301f354').innerText.trim()
        var mark3_6_42 = document.getElementById('1647417279293f98b').innerText.trim()
        var mark3_6_43 = document.getElementById('1647417360068c691').innerText.trim()

        fenxiangjlmap.set('mark3_6',mark3_6)
        fenxiangmap.set('mark3_6_11',mark3_6_11)
        fenxiangmap.set('mark3_6_12',mark3_6_12)
        fenxiangmap.set('mark3_6_13',mark3_6_13)
        fenxiangmap.set('mark3_6_21',mark3_6_21)
        fenxiangmap.set('mark3_6_22',mark3_6_22)
        fenxiangmap.set('mark3_6_23',mark3_6_23)
        fenxiangmap.set('mark3_6_31',mark3_6_31)
        fenxiangmap.set('mark3_6_32',mark3_6_32)
        fenxiangmap.set('mark3_6_33',mark3_6_33)
        fenxiangmap.set('mark3_6_34',mark3_6_34)
        fenxiangmap.set('mark3_6_41',mark3_6_41)
        fenxiangmap.set('mark3_6_42',mark3_6_42)
        fenxiangmap.set('mark3_6_43',mark3_6_43)

        if(!((mark3_6_11 === '×'||mark3_6_12 === '×'||mark3_6_13 === '×'
              ||mark3_6_21 === '×'||mark3_6_22 === '×'||mark3_6_23 === '×'
              ||mark3_6_31 === '×'||mark3_6_32 === '×'||mark3_6_33 === '×'||mark3_6_34 === '×'
              ||mark3_6_41 === '×'||mark3_6_42 === '×'||mark3_6_43 === '×'
             ) && mark3_6 === '×'||
             (mark3_6_11 != '×'&&mark3_6_12 != '×'&&mark3_6_13 != '×'
              &&mark3_6_21 != '×'&&mark3_6_22 != '×'&&mark3_6_23 != '×'
              &&mark3_6_31 != '×'&&mark3_6_32 != '×'&&mark3_6_33 != '×'&&mark3_6_34 != '×'
              &&mark3_6_41 != '×'&&mark3_6_42 != '×'&&mark3_6_43 != '×'
             ) && mark3_6 != '×'))
        {
            addstrtip('mark3_6结论有误！')
        }
        if(mark3_6_12!='-')
        {
            addstrtip('3_6注意导轨间距是否大于2.5！')
            strinput=strinput+'导轨间距大于2.5    '
        }
        else
        {
            strinput=strinput+'导轨间距小于2.5    '
        }
        if(mark3_6_13!='-')
        {
            addstrtip('3_6注意有非标支架数！')
            strinput=strinput+'有非标支架数    '
        }
        else
        {
            strinput=strinput+'无非标支架数    '
        }


        var mark3_7 = document.getElementById('164741768158862c5').innerText.trim()
        var mark3_71 = document.getElementById('16474174529570257').innerText.trim()
        var mark3_72 = document.getElementById('1647417470982373a').innerText.trim()
        var mark3_73 = document.getElementById('1647417500786b868').innerText.trim()
        var mark3_74 = document.getElementById('164741753108433e2').innerText.trim()
        var mark3_75 = document.getElementById('1647417550421c839').innerText.trim()
        fenxiangjlmap.set('mark3_7',mark3_7)
        fenxiangmap.set('mark3_71',mark3_71)
        fenxiangmap.set('mark3_72',mark3_72)
        fenxiangmap.set('mark3_73',mark3_73)
        fenxiangmap.set('mark3_74',mark3_74)
        fenxiangmap.set('mark3_75',mark3_75)
        if(!((//start1
            mark3_71 === '×'||mark3_72 === '×'||mark3_73 === '×'||mark3_74 === '×'||mark3_75 === '×'
            //end1
        ) && mark3_7 === '×'||(
            //start2
            mark3_71 != '×'&&mark3_72 != '×'&&mark3_73 != '×'&&mark3_74 != '×'&&mark3_75 != '×'
            //end2
        ) && mark3_7 != '×'))
        {// 通过
            addstrtip('3_7结论有误！')
        }
        if(mark3_73!='-'||mark3_74!='-')
        {
            addstrtip('3_7注意井道壁距离是否局部增大到0.2！')
            strinput=strinput+'井道壁距离局部增大    '
        }
        if(mark3_71!='-'){
            var jingdaobijuliright=false
            if(!isNaN(Number(mark3_71)))
            {
                if(parseFloat(mark3_71)>0)
                {
                    jingdaobijuliright=true
                }
            }
            if(!jingdaobijuliright)
            {
                addstrtip('注意井道壁距离！')
            }
            if(!(parseFloat(mark3_71)>0.15&&mark3_72==='×'||parseFloat(mark3_71)<=0.15&&mark3_72==='√'))
            {
                addstrtip('3_7注意井道壁距离项矛盾！')
            }
        }
        if(mark3_73!='-')
        {
            var jingdaobijubujuliright=false
            if(!isNaN(Number(mark3_73)))
            {
                if(parseFloat(mark3_73)>0)
                {
                    jingdaobijubujuliright=true
                }
            }
            if(!jingdaobijubujuliright)
            {
                addstrtip('注意井道壁局部距离！')
            }
            else if(!(parseFloat(mark3_73)>0.2&&mark3_74==='×'||parseFloat(mark3_73)<=0.2&&mark3_74==='√'))
            {
                addstrtip('3_7注意井道壁局部距离项矛盾！')
            }
        }

        if((mark3_71 != '-'||mark3_72 != '-'||mark3_73 != '-'||mark3_74 != '-')&&mark3_75 != '-')
        {
            addstrtip('3_7注意是否勾选不合理！')
        }


        var mark3_8 = document.getElementById('16474176965085764').innerText.trim()
        var mark3_81 = document.getElementById('16474175715338c85').innerText.trim()
        var mark3_82 = document.getElementById('16474175926120aef').innerText.trim()
        fenxiangjlmap.set('mark3_8',mark3_8)
        fenxiangmap.set('mark3_81',mark3_81)
        fenxiangmap.set('mark3_82',mark3_82)
        if(!((//start1
            mark3_81 === '×'||mark3_82 === '×'
            //end1
        ) && mark3_8 === '×'||(
            //start2
            mark3_81 != '×'&&mark3_82 != '×'
            //end2
        ) && mark3_8 != '×'))
        {// 通过
            addstrtip('mark3_8结论有误！')
        }

        var mark3_9 = document.getElementById('1647418747427cde3').innerText.trim()
        var mark3_9_11 = document.getElementById('1647417767827d2a4').innerText.trim()
        var mark3_9_12 = document.getElementById('164741779728645f2').innerText.trim()
        var mark3_9_21 = document.getElementById('164741784320317bd').innerText.trim()
        var mark3_9_22 = document.getElementById('164741786493152be').innerText.trim()
        var mark3_9_23 = document.getElementById('1647417894675c366').innerText.trim()
        var mark3_9_24 = document.getElementById('16474179236181e3a').innerText.trim()
        fenxiangjlmap.set('mark3_9',mark3_9)
        fenxiangmap.set('mark3_9_11',mark3_9_11)
        fenxiangmap.set('mark3_9_12',mark3_9_12)
        fenxiangmap.set('mark3_9_21',mark3_9_21)
        fenxiangmap.set('mark3_9_22',mark3_9_22)
        fenxiangmap.set('mark3_9_23',mark3_9_23)
        fenxiangmap.set('mark3_9_24',mark3_9_24)
        if(!((//start1
            mark3_9_11 === '×'||mark3_9_12 === '×'||mark3_9_21 === '×'||mark3_9_22 === '×'||mark3_9_23 === '×'||mark3_9_24 === '×'
            //end1
        ) && mark3_9 === '×'||(
            //start2
            mark3_9_11 != '×'&&mark3_9_12 != '×'&&mark3_9_21 != '×'&&mark3_9_22 != '×'&&mark3_9_23 != '×'&&mark3_9_24 != '×'
            //end2
        ) && mark3_9 != '×'))
        {// 通过
            addstrtip('mark3_9结论有误！')
        }
        if(mark3_9_21!='-'||mark3_9_22!='-'||mark3_9_23!='-'||mark3_9_24!='-')
        {
            addstrtip('mark3_9注意是否多台电梯共用井道！')
        }
        if(mark3_9_21!='-'&&mark3_9_22!='-'&&mark3_9_23!='-'&&mark3_9_24!='-')
        {
            strinput=strinput+'3_9多台电梯共用井道    '
        }
        else if(mark3_9_21==='-'&&mark3_9_22==='-'&&mark3_9_23==='-'&&mark3_9_24==='-')
        {
            strinput=strinput+'3_9非多台电梯共用井道    '
        }
        else
        {
            strinput=strinput+'3_9多台电梯共用井道部分勾选    '
        }

        var mark3_10 = document.getElementById('16474187695062db0').innerText.trim()
        var mark3_101 = document.getElementById('16474179483142595').innerText.trim()
        var mark3_102 = document.getElementById('16474179797312512').innerText.trim()
        fenxiangjlmap.set('mark3_10',mark3_10)
        fenxiangmap.set('mark3_101',mark3_101)
        fenxiangmap.set('mark3_102',mark3_102)
        if(!((//start1
            mark3_101 === '×'||mark3_102 === '×'
            //end1
        ) && mark3_10 === '×'||(
            //start2
            mark3_101 != '×'&&mark3_102 != '×'
            //end2
        ) && mark3_10 != '×'))
        {
            addstrtip('3_10结论有误！')
        }

        var mark3_11 = document.getElementById('164741878325494d3').innerText.trim()
        var mark3_111 = document.getElementById('164741800047480be').innerText.trim()
        var mark3_112 = document.getElementById('1647418028041ea15').innerText.trim()
        fenxiangjlmap.set('mark3_11',mark3_11)
        fenxiangmap.set('mark3_111',mark3_111)
        fenxiangmap.set('mark3_112',mark3_112)
        if(!((//start1
            mark3_111 === '×'||mark3_112 === '×'
            //end1
        ) && mark3_11 === '×'||(
            //start2
            mark3_111 != '×'&&mark3_112 != '×'
            //end2
        ) && mark3_11 != '×'))
        {addstrtip('3_11结论有误！')
        }
        if(mark3_112!='-')
        {
            addstrtip('3_11注意是否为部分封闭井道！')
            strinput=strinput+'3_11部分封闭井道照明要求满足    '
        }
        else
        {
            strinput=strinput+'3_11非部分封闭井道照明    '
        }
        if(mark3_1_2==='-'&&mark3_1_3==='-'&&mark3_112!='-')
        {
            addstrtip('3_1与3_11注意部分封闭井道是否矛盾！')
        }
        if(mark3_1_2!='-'&&mark3_1_3!='-')
        {
            if(mark3_112==='-')
            {
                addstrtip('3_1与3_11注意部分封闭井道是否可以不设照明！')
            }
        }

        var mark3_12 = document.getElementById('1647418798393b161').innerText.trim()
        var mark3_12_1 = document.getElementById('16474180502042b47').innerText.trim()
        var mark3_12_21 = document.getElementById('16474180925012b57').innerText.trim()
        var mark3_12_22 = document.getElementById('16474181112030b7f').innerText.trim()
        var mark3_12_31 = document.getElementById('16474182276361e76').innerText.trim()
        var mark3_12_32 = document.getElementById('16474182478841af6').innerText.trim()
        var mark3_12_4 = document.getElementById('164741826959883eb').innerText.trim()
        fenxiangjlmap.set('mark3_12',mark3_12)
        fenxiangmap.set('mark3_12_1',mark3_12_1)
        fenxiangmap.set('mark3_12_21',mark3_12_21)
        fenxiangmap.set('mark3_12_22',mark3_12_22)
        fenxiangmap.set('mark3_12_31',mark3_12_31)
        fenxiangmap.set('mark3_12_32',mark3_12_32)
        fenxiangmap.set('mark3_12_4',mark3_12_4)
        if(!((//start1
            mark3_12_1 === '×'||mark3_12_21 === '×'||mark3_12_22 === '×'
            ||mark3_12_31 === '×'||mark3_12_32 === '×'||mark3_12_4 === '×'
            //end1
        ) && mark3_12 === '×'||(
            //start2
            mark3_12_1 != '×'&&mark3_12_21 != '×'&&mark3_12_22 != '×'
            &&mark3_12_31 != '×'&&mark3_12_32 != '×'&&mark3_12_4 != '×'
            //end2
        ) && mark3_12 != '×'))
        {addstrtip('3_12结论有误！')
        }

        var mark3_13 = document.getElementById('1647418814818ba3a').innerText.trim()
        var mark3_13_1 = document.getElementById('1647418290563bc7a').innerText.trim()
        var mark3_13_21 = document.getElementById('1647418313069d1dc').innerText.trim()
        var mark3_13_22 = document.getElementById('16474183413148d22').innerText.trim()
        var mark3_13_23 = document.getElementById('16474183621589b23').innerText.trim()
        var mark3_13_3 = document.getElementById('164741841116595ed').innerText.trim()
        fenxiangjlmap.set('mark3_13',mark3_13)
        fenxiangmap.set('mark3_13_1',mark3_13_1)
        fenxiangmap.set('mark3_13_21',mark3_13_21)
        fenxiangmap.set('mark3_13_22',mark3_13_22)
        fenxiangmap.set('mark3_13_23',mark3_13_23)
        fenxiangmap.set('mark3_13_3',mark3_13_3)
        if(!((//start1
            mark3_13_1 === '×'||mark3_13_21 === '×'||mark3_13_22 === '×'||mark3_13_23 === '×'
            ||mark3_13_3 === '×'
            //end1
        ) && mark3_13 === '×'||(
            //start2
            mark3_13_1 != '×'&&mark3_13_21 != '×'&&mark3_13_22 != '×'&&mark3_13_23 != '×'
            &&mark3_13_3 != '×'
            //end2
        ) && mark3_13 != '×'))
        {
            addstrtip('3_13结论有误！')
        }
        if(mark3_13_22!='-'||mark3_13_23!='-')
        {
            addstrtip('3_13注意底坑与轿厢最低距离是否线性增大！')
        }
        if(mark3_13_3!='-')
        {
            addstrtip('3_13注意是否存在底坑最高部件与轿厢最低距离！')
        }

        var mark3_14 = document.getElementById('1647418828003f4eb').innerText.trim()
        var mark3_141 = document.getElementById('1647418452844aa09').innerText.trim()
        var mark3_142 = document.getElementById('164741847697360de').innerText.trim()

        fenxiangjlmap.set('mark3_14',mark3_14)
        fenxiangmap.set('mark3_141',mark3_141)
        fenxiangmap.set('mark3_142',mark3_142)
        if(!((//start1
            mark3_141 === '×'||mark3_142 === '×'
            //end1
        ) && mark3_14 === '×'||(
            //start2
            mark3_141 != '×'&&mark3_142 != '×'
            //end2
        ) && mark3_14 != '×'))
        {
            addstrtip('3_14结论有误！')
        }

        var mark3_15 = document.getElementById('16474188445341853').innerText.trim()
        var mark3_15_11 = document.getElementById('164741850743879e8').innerText.trim()
        var mark3_15_12 = document.getElementById('16474185267152097').innerText.trim()
        var mark3_15_13 = document.getElementById('1647418552366b8af').innerText.trim()
        var mark3_15_2 = document.getElementById('16474185816997ad3').innerText.trim()
        var mark3_15_3 = document.getElementById('16474186068352e65').innerText.trim()
        var mark3_15_4 = document.getElementById('164741866580698dd').innerText.trim()
        var mark3_15_5 = document.getElementById('1647418689511d71c').innerText.trim()
        fenxiangjlmap.set('mark3_15',mark3_15)
        fenxiangmap.set('mark3_15_11',mark3_15_11)
        fenxiangmap.set('mark3_15_12',mark3_15_12)
        fenxiangmap.set('mark3_15_13',mark3_15_13)
        fenxiangmap.set('mark3_15_2',mark3_15_2)
        fenxiangmap.set('mark3_15_3',mark3_15_3)
        fenxiangmap.set('mark3_15_4',mark3_15_4)
        fenxiangmap.set('mark3_15_5',mark3_15_5)

        if(!((//start1
            mark3_15_11 === '×'||mark3_15_12 === '×'||mark3_15_13 === '×'||mark3_15_2 === '×'||mark3_15_3 === '×'||mark3_15_4 === '×'||mark3_15_5 === '×'
            //end1
        ) && mark3_15 === '×'||(
            //start2
            mark3_15_11 != '×'&&mark3_15_12 != '×'&&mark3_15_13 != '×'&&mark3_15_2 != '×'&&mark3_15_3 != '×'&&mark3_15_4 != '×'&&mark3_15_5 != '×'
            //end2
        ) && mark3_15 != '×'))
        {addstrtip('3_15结论有误！')}
        if(mark3_15_4==='-')
        {
            //addstrtip('3_15_4TIP:蓄能缓冲器！')
            strinput=strinput+'蓄能缓冲器    '
        }
        else
        {
            //addstrtip('3_15_4TIP:耗能缓冲器！')
            strinput=strinput+'耗能缓冲器    '
        }
        if(mark3_15_12!='-')
        {
            addstrtip('3_15_12勾选强制驱动电梯！')
        }

        var mark3_16 = document.getElementById('1622633889469054d').innerText.trim()
        var mark3_16_1 = document.getElementById('1622633931613dd46').innerText.trim()
        var mark3_16_2 = document.getElementById('162263395769241ca').innerText.trim()
        fenxiangjlmap.set('mark3_16',mark3_16)
        fenxiangmap.set('mark3_16_1',mark3_16_1)
        fenxiangmap.set('mark3_16_2',mark3_16_2)

        if(!((//start1
            mark3_16_1 === '×'||mark3_16_2 === '×'
            //end1
        ) && mark3_16 === '×'||(
            //start2
            mark3_16_1 != '×'&&mark3_16_2 != '×'
            //end2
        ) && mark3_16 != '×'))
        {addstrtip('3_16结论有误！')}
        if(mark3_16_1!='-'||mark3_16_2!='-')
        {
            addstrtip('3_16注意底坑地面以下是否有空间！')
        }
        if(mark3_16_1!='-')
        {
            strinput=strinput+'3_16底坑地面以下有空间，有实心柱    '
        }
        if(mark3_16_2!='-')
        {
            strinput=strinput+'3_16底坑地面以下有空间，有对重安全钳    '
        }
        if(mark3_16_1==='-'||mark3_16_2==='-')
        {
            strinput=strinput+'3_16底坑地面以下无空间    '
        }

        var mark4_1 = document.getElementById('16226339091487a9a').innerText.trim()
        var mark4_1_11 = document.getElementById('16226339980541260').innerText.trim()
        var mark4_1_12 = document.getElementById('162263402359010d7').innerText.trim()
        var mark4_1_13 = document.getElementById('16226340551410dec').innerText.trim()
        var mark4_1_14 = document.getElementById('16226340765084720').innerText.trim()
        var mark4_1_15 = document.getElementById('16226340962850515').innerText.trim()
        var mark4_1_21 = document.getElementById('1622634116691af3c').innerText.trim()
        var mark4_1_22 = document.getElementById('1622634138366cb2f').innerText.trim()
        var mark4_1_23 = document.getElementById('162263427031225c1').innerText.trim()
        var mark4_1_3 = document.getElementById('162263429258134f6').innerText.trim()
        fenxiangjlmap.set('mark4_1',mark4_1)
        fenxiangmap.set('mark4_1_11',mark4_1_11)
        fenxiangmap.set('mark4_1_12',mark4_1_12)
        fenxiangmap.set('mark4_1_13',mark4_1_13)
        fenxiangmap.set('mark4_1_14',mark4_1_14)
        fenxiangmap.set('mark4_1_15',mark4_1_15)
        fenxiangmap.set('mark4_1_21',mark4_1_21)
        fenxiangmap.set('mark4_1_22',mark4_1_22)
        fenxiangmap.set('mark4_1_23',mark4_1_23)
        fenxiangmap.set('mark4_1_3',mark4_1_3)

        if(!((//start1
            mark4_1_11 === '×'||mark4_1_12 === '×'||mark4_1_13 === '×'||mark4_1_14 === '×'||mark4_1_15 === '×'
            ||mark4_1_21 === '×'||mark4_1_22 === '×'||mark4_1_23 === '×'||mark4_1_3 === '×'
            //end1
        ) && mark4_1 === '×'||(
            //start2
            mark4_1_11 != '×'&&mark4_1_12 != '×'&&mark4_1_13 != '×'&&mark4_1_14 != '×'&&mark4_1_15 != '×'
            &&mark4_1_21 != '×'&&mark4_1_22 != '×'&&mark4_1_23 != '×'&&mark4_1_3 != '×'
            //end2
        ) && mark4_1 != '×'))
        {addstrtip('4_1结论有误！')}

        var mark4_2 = document.getElementById('16226339091497c1c').innerText.trim()
        var mark4_2_1 = document.getElementById('1622634322012aedf').innerText.trim()
        var mark4_2_21 = document.getElementById('1622634347892645c').innerText.trim()
        var mark4_2_22 = document.getElementById('1622634380941ed12').innerText.trim()
        var mark4_2_3 = document.getElementById('16226343997252187').innerText.trim()
        var mark4_2_4 = document.getElementById('1622634414181ce48').innerText.trim()
        fenxiangjlmap.set('mark4_2',mark4_2)
        fenxiangmap.set('mark4_2_1',mark4_2_1)
        fenxiangmap.set('mark4_2_21',mark4_2_21)
        fenxiangmap.set('mark4_2_22',mark4_2_22)
        fenxiangmap.set('mark4_2_3',mark4_2_3)
        fenxiangmap.set('mark4_2_4',mark4_2_4)

        if(!((//start1
            mark4_2_1 === '×'||mark4_2_21 === '×'||mark4_2_22 === '×'||mark4_2_3 === '×'||mark4_2_4 === '×'
            //end1
        ) && mark4_2 === '×'||(
            //start2
            mark4_2_1 != '×'&&mark4_2_21 != '×'&&mark4_2_22 != '×'&&mark4_2_3 != '×'&&mark4_2_4 != '×'
            //end2
        ) && mark4_2 != '×'))
        {addstrtip('4_2结论有误！')}
        if(mark4_2_1 === '-'&&mark4_2_21 === '-'&&mark4_2_22 === '-'&&mark4_2_3 === '-'&&mark4_2_4 === '-')
        {
            strinput=strinput+'4_2井道壁离轿顶外侧水平距离不超过0.3且无轿顶护栏    '
            addstrtip('4_2注意是否井道壁离轿顶外侧水平距离不超过0.3且无轿顶护栏')
        }
        if(mark4_2_21 != '-')
        {
            strinput=strinput+'4_2扶手外缘、0.70m    '
        }
        else
        {
            strinput=strinput+'4_2不存在扶手外缘、0.70m    '
        }
        if(mark4_2_22 != '-')
        {
            strinput=strinput+'4_2扶手外缘、1.10m；     '
        }
        else
        {
            strinput=strinput+'4_2不存在扶手外缘、1.10m；     '
        }


        var mark4_3 = document.getElementById('162263390914921cc').innerText.trim()
        var mark4_31 = document.getElementById('16226344348383ff6').innerText.trim()
        var mark4_32 = document.getElementById('16226344530559e16').innerText.trim()
        var mark4_33 = document.getElementById('16226344691920b8d').innerText.trim()
        fenxiangjlmap.set('mark4_3',mark4_3)
        fenxiangmap.set('mark4_31',mark4_31)
        fenxiangmap.set('mark4_32',mark4_32)
        fenxiangmap.set('mark4_33',mark4_33)

        if(!((//start1
            mark4_31 === '×'||mark4_32 === '×'||mark4_33 === '×'
            //end1
        ) && mark4_3 === '×'||(
            //start2
            mark4_31 != '×'&&mark4_32 != '×'&&mark4_33 != '×'
            //end2
        ) && mark4_3 != '×'))
        {addstrtip('4_3结论有误！')}
        if(mark4_31==='-'&&mark4_32==='-'&&mark4_33==='-')
        {
            strinput=strinput+'无安全窗    '
        }
        else if(mark4_31!='-'&&mark4_32!='-'&&mark4_33!='-')
        {
            strinput=strinput+'有安全窗    '
        }
        else
        {
            strinput=strinput+'安全窗部分勾选    '
        }

        var mark4_4 = document.getElementById('1622633909150f160').innerText.trim()
        var mark4_41 = document.getElementById('1622634508661a52c').innerText.trim()
        var mark4_42 = document.getElementById('16226345411207e67').innerText.trim()
        fenxiangjlmap.set('mark4_4',mark4_4)
        fenxiangmap.set('mark4_41',mark4_41)
        fenxiangmap.set('mark4_42',mark4_42)

        if(!((//start1
            mark4_41 === '×'||mark4_42 === '×'
            //end1
        ) && mark4_4 === '×'||(
            //start2
            mark4_41 != '×'&&mark4_42 != '×'
            //end2
        ) && mark4_4 != '×'))
        {addstrtip('4_4结论有误！')}
        if(mark4_41!='N')
        {
            var duizhongjiaoxiangjuliright=false
            if(!isNaN(Number(mark4_41)))
            {
                if(parseFloat(mark4_41)>0)
                {
                    duizhongjiaoxiangjuliright=true
                }
            }
            if(!duizhongjiaoxiangjuliright)
            {
                addstrtip('注意对重轿厢距离！')
            }
            if(!(parseFloat(mark4_41)>=50&&mark4_42==='√'||parseFloat(mark4_41)<50&&mark4_42==='×'))
            {
                addstrtip('注意4_4是否矛盾！')
            }
        }


        var mark4_5 = document.getElementById('1647419413028b112').innerText.trim()
        var mark4_5_1 = document.getElementById('16474190103578649').innerText.trim()
        var mark4_5_2 = document.getElementById('16474190309662fda').innerText.trim()
        fenxiangjlmap.set('mark4_5',mark4_5)
        fenxiangmap.set('mark4_5_1',mark4_5_1)
        fenxiangmap.set('mark4_5_2',mark4_5_2)

        if(!((//start1
            mark4_5_1 === '×'||mark4_5_2 === '×'
            //end1
        ) && mark4_5 === '×'||(
            //start2
            mark4_5_1 != '×'&&mark4_5_2 != '×'
            //end2
        ) && mark4_5 != '×'))
        {addstrtip('4_5结论有误！')}


        var mark4_6 = document.getElementById('1647419426419bfe8').innerText.trim()
        var mark4_6_1 = document.getElementById('16474190489971b45').innerText.trim()
        var mark4_6_21 = document.getElementById('1647419071318a86b').innerText.trim()
        var mark4_6_22 = document.getElementById('1647419090544e565').innerText.trim()
        var mark4_6_23 = document.getElementById('1647419115853975c').innerText.trim()

        fenxiangjlmap.set('mark4_6',mark4_6)
        fenxiangmap.set('mark4_6_1',mark4_6_1)
        fenxiangmap.set('mark4_6_21',mark4_6_21)
        fenxiangmap.set('mark4_6_22',mark4_6_22)
        fenxiangmap.set('mark4_6_23',mark4_6_23)
        if(!((//start1
            mark4_6_1 === '×'||mark4_6_21 === '×'||mark4_6_22 === '×'||mark4_6_23 === '×'
            //end1
        ) && mark4_6 === '×'||(
            //start2
            mark4_6_1 != '×'&&mark4_6_21 != '×'&&mark4_6_22 != '×'&&mark4_6_23 != '×'
            //end2
        ) && mark4_6 != '×'))
        {addstrtip('4_6结论有误！')}
        if(mark4_6_21!='-'||mark4_6_22!='-'||mark4_6_23!='-')
        {
            addstrtip('4_6注意是否为超面积载货电梯！')
        }


        var mark4_7 = document.getElementById('164741944727768a3').innerText.trim()
        var mark4_7_11 = document.getElementById('1647419136861958c').innerText.trim()
        var mark4_7_12 = document.getElementById('16474191573284686').innerText.trim()
        var mark4_7_2 = document.getElementById('16474191811873130').innerText.trim()

        fenxiangjlmap.set('mark4_7',mark4_7)
        fenxiangmap.set('mark4_7_11',mark4_7_11)
        fenxiangmap.set('mark4_7_12',mark4_7_12)
        fenxiangmap.set('mark4_7_2',mark4_7_2)
        if(!((//start1
            mark4_7_11 === '×'||mark4_7_12 === '×'||mark4_7_2 === '×'
            //end1
        ) && mark4_7 === '×'||(
            //start2
            mark4_7_11 != '×'&&mark4_7_12 != '×'&&mark4_7_2 != '×'
            //end2
        ) && mark4_7 != '×'))
        {addstrtip('mark4_7结论有误！')}

        var mark4_8 = document.getElementById('1647419463968a8a4').innerText.trim()
        var mark4_8_1 = document.getElementById('16474191985616a32').innerText.trim()
        var mark4_8_21 = document.getElementById('16474192295794ad4').innerText.trim()
        var mark4_8_22 = document.getElementById('1647419258503cc72').innerText.trim()
        var mark4_8_23 = document.getElementById('16474192823193724').innerText.trim()
        var mark4_8_24 = document.getElementById('16474193074927b48').innerText.trim()

        fenxiangjlmap.set('mark4_8',mark4_8)
        fenxiangmap.set('mark4_8_1',mark4_8_1)
        fenxiangmap.set('mark4_8_21',mark4_8_21)
        fenxiangmap.set('mark4_8_22',mark4_8_22)
        fenxiangmap.set('mark4_8_23',mark4_8_23)
        fenxiangmap.set('mark4_8_24',mark4_8_24)

        if(!((//start1
            mark4_8_1 === '×'
            ||mark4_8_21 === '×'||mark4_8_22 === '×'||mark4_8_23 === '×'||mark4_8_24 === '×'
            //end1
        ) && mark4_8 === '×'||(
            //start2
            mark4_8_1 != '×'
            &&mark4_8_21 != '×'&&mark4_8_22 != '×'&&mark4_8_23 != '×'&&mark4_8_24 != '×'
            //end2
        ) && mark4_8 != '×'))
        {addstrtip('4_8结论有误！')}

        var mark4_9 = document.getElementById('1647419478011ab4b').innerText.trim()
        var mark4_91 = document.getElementById('16474193284437435').innerText.trim()
        fenxiangjlmap.set('mark4_9',mark4_9)
        fenxiangmap.set('mark4_91',mark4_91)
        if(!((//start1
            mark4_91 === '×'
            //end1
        ) && mark4_9 === '×'||(
            //start2
            mark4_91 != '×'
            //end2
        ) && mark4_9 != '×'))
        {addstrtip('4_9结论有误！')}

        var mark4_10 = document.getElementById('16474218898032983').innerText.trim()
        var mark4_101 = document.getElementById('1647421220140b43f').innerText.trim()
        var mark4_102 = document.getElementById('164742124573316db').innerText.trim()
        fenxiangjlmap.set('mark4_10',mark4_10)
        fenxiangmap.set('mark4_101',mark4_101)
        fenxiangmap.set('mark4_102',mark4_102)
        if(!((//start1
            mark4_101 === '×'||mark4_102 === '×'
            //end1
        ) && mark4_10 === '×'||(
            //start2
            mark4_101 != '×'&&mark4_102 != '×'
            //end2
        ) && mark4_10 != '×'))
        {addstrtip('4_10结论有误！')}

        var mark4_11 = document.getElementById('16474219149540de8').innerText.trim()
        var mark4_11_11 = document.getElementById('16474212690670878').innerText.trim()
        var mark4_11_12 = document.getElementById('1647421293399a802').innerText.trim()
        var mark4_11_2 = document.getElementById('16474214144754638').innerText.trim()
        fenxiangjlmap.set('mark4_11',mark4_11)
        fenxiangmap.set('mark4_11_11',mark4_11_11)
        fenxiangmap.set('mark4_11_12',mark4_11_12)
        fenxiangmap.set('mark4_11_2',mark4_11_2)
        if(!((//start1
            mark4_11_11 === '×'||mark4_11_12 === '×'||mark4_11_2 === '×'
            //end1
        ) && mark4_11 === '×'||(
            //start2
            mark4_11_11 != '×'&&mark4_11_12 != '×'&&mark4_11_2 != '×'
            //end2
        ) && mark4_11 != '×'))
        {addstrtip('4_11结论有误！')}

        var mark5_1 = document.getElementById('16474219292516522').innerText.trim()
        var mark5_11 = document.getElementById('164742149686229c2').innerText.trim()
        var mark5_12 = document.getElementById('164742154633067e6').innerText.trim()
        var mark5_13 = document.getElementById('164742156684400c8').innerText.trim()
        var mark5_14 = document.getElementById('1647421586920426f').innerText.trim()

        fenxiangjlmap.set('mark5_1',mark5_1)
        fenxiangmap.set('mark5_11',mark5_11)
        fenxiangmap.set('mark5_12',mark5_12)
        fenxiangmap.set('mark5_13',mark5_13)
        fenxiangmap.set('mark5_14',mark5_14)
        if(!((//start1
            mark5_11 === '×'||mark5_12 === '×'||mark5_13 === '×'||mark5_14 === '×'
            //end1
        ) && mark5_1 === '×'||(
            //start2
            mark5_11 != '×'&&mark5_12 != '×'&&mark5_13 != '×'&&mark5_14 != '×'
            //end2
        ) && mark5_1 != '×'))
        {addstrtip('5_1结论有误！')}
        if(mark5_14==='-')
        {
            strinput=strinput+'钢丝绳    '
        }
        else
        {
            strinput=strinput+'钢带    '
        }
        if(!((mark5_11 != '-'&&mark5_12 != '-'&&mark5_13 != '-'&&mark5_14 === '-')||(mark5_11 === '-'&&mark5_12 === '-'&&mark5_13 === '-'&&mark5_14 != '-')))
        {
            addstrtip('5_1注意是否不合理！')
        }

        var mark5_2 = document.getElementById('1647421945539d267').innerText.trim()
        var mark5_21 = document.getElementById('1647421633206065e').innerText.trim()
        var mark5_22 = document.getElementById('1647421660365eebe').innerText.trim()
        var mark5_23 = document.getElementById('1647421681704d9a2').innerText.trim()
        fenxiangjlmap.set('mark5_2',mark5_2)
        fenxiangmap.set('mark5_21',mark5_21)
        fenxiangmap.set('mark5_22',mark5_22)
        fenxiangmap.set('mark5_23',mark5_23)
        if(!((//start1
            mark5_21 === '×'||mark5_22 === '×'||mark5_23 === '×'
            //end1
        ) && mark5_2 === '×'||(
            //start2
            mark5_21 != '×'&&mark5_22 != '×'&&mark5_23 != '×'
            //end2
        ) && mark5_2 != '×'))
        {addstrtip('5_2结论有误！')}
        if(!((mark5_21 != '-'&&mark5_22 === '-'&&mark5_23 === '-')||(mark5_21 === '-'&&mark5_22 === '-'&&mark5_23 != '-')))
        {
            addstrtip('5_2注意是否不合理！')
        }
        if(!(mark5_14 != '-'&&mark5_23 != '-'||mark5_14 === '-'&&mark5_23 === '-'))
        {
            addstrtip('5_1与5_2注意是否矛盾！')
        }

        var mark5_3 = document.getElementById('16474219600450b22').innerText.trim()
        var mark5_3_1 = document.getElementById('1647421723645f56f').innerText.trim()
        var mark5_3_2 = document.getElementById('1647421748815e1f2').innerText.trim()
        var mark5_3_31 = document.getElementById('1647421776751ac90').innerText.trim()
        var mark5_3_32 = document.getElementById('1647421798454dfd0').innerText.trim()
        fenxiangjlmap.set('mark5_3',mark5_3)
        fenxiangmap.set('mark5_3_1',mark5_3_1)
        fenxiangmap.set('mark5_3_2',mark5_3_2)
        fenxiangmap.set('mark5_3_31',mark5_3_31)
        fenxiangmap.set('mark5_3_32',mark5_3_32)
        if(!((//start1
            mark5_3_1 === '×'||mark5_3_2 === '×'
            ||mark5_3_31 === '×'||mark5_3_32 === '×'
            //end1
        ) && mark5_3 === '×'||(
            //start2
            mark5_3_1 != '×'&&mark5_3_2 != '×'
            &&mark5_3_31 != '×'&&mark5_3_32 != '×'
            //end2
        ) && mark5_3 != '×'))
        {addstrtip('5_3结论有误！')}
        if(mark5_3_1!='-')
        {
            strinput=strinput+'有补偿绳    '
        }
        else
        {
            strinput=strinput+'无补偿绳    '
        }
        if(mark5_3_2!='-')
        {
            addstrtip('5_3_2注意是否有补偿绳张紧电气开关！')
            strinput=strinput+'有补偿绳张紧电气开关    '
        }
        else
        {
            strinput=strinput+'无补偿绳张紧电气开关    '
        }
        if(mark5_3_31!='-'&&mark5_3_32!='-')
        {
            strinput=strinput+'有补偿绳防跳    '
        }
        else if(mark5_3_31==='-'&&mark5_3_32==='-')
        {
            strinput=strinput+'无补偿绳防跳    '
        }
        else
        {
            strinput=strinput+'补偿绳防跳部分勾选    '
        }


        var mark5_4 = document.getElementById('1647421975919f6c4').innerText.trim()
        var mark5_4_1 = document.getElementById('1647421821366bc49').innerText.trim()
        var mark5_4_2 = document.getElementById('16474218455128ac3').innerText.trim()
        var mark5_4_3 = document.getElementById('1647421868752fea0').innerText.trim()
        fenxiangjlmap.set('mark5_4',mark5_4)
        fenxiangmap.set('mark5_4_1',mark5_4_1)
        fenxiangmap.set('mark5_4_2',mark5_4_2)
        fenxiangmap.set('mark5_4_3',mark5_4_3)
        if(!((//start1
            mark5_4_1 === '×'||mark5_4_2 === '×'||mark5_4_3 === '×'
            //end1
        ) && mark5_4 === '×'||(
            //start2
            mark5_4_1 != '×'&&mark5_4_2 != '×'&&mark5_4_3 != '×'
            //end2
        ) && mark5_4 != '×'))
        {addstrtip('5_4结论有误！')}
        if(mark5_4_1!='-'||mark5_4_2!='-'||mark5_4_3!='-')
        {
            addstrtip('5_4勾选强制驱动电梯！')
        }


        var mark5_5 = document.getElementById('1622636805161670d').innerText.trim()
        var mark5_51 = document.getElementById('1622636828975719c').innerText.trim()
        fenxiangjlmap.set('mark5_5',mark5_5)
        fenxiangmap.set('mark5_51',mark5_51)
        if(!((//start1
            mark5_51 === '×'
            //end1
        ) && mark5_5 === '×'||(
            //start2
            mark5_51 != '×'
            //end2
        ) && mark5_5 != '×'))
        {addstrtip('5_5结论有误！')}

        if(parseInt(gkyeyinshengshugangdaishu)===2)
        {
            if(mark5_51==='-')
            {
                addstrtip('5_5两根悬挂应有电气开关！')
            }
        }
        if(mark5_51!='-')
        {
            strinput=strinput+'5_5悬挂有电气开关    '
        }
        else
        {
            strinput=strinput+'5_5悬挂无电气开关    '
        }

        var mark5_6 = document.getElementById('1622636821527fae5').innerText.trim()
        var mark5_61 = document.getElementById('16226368539764f46').innerText.trim()
        var mark5_62 = document.getElementById('1622636875601317f').innerText.trim()
        var mark5_63 = document.getElementById('1622636887623056c').innerText.trim()
        fenxiangjlmap.set('mark5_6',mark5_6)
        fenxiangmap.set('mark5_61',mark5_61)
        fenxiangmap.set('mark5_62',mark5_62)
        fenxiangmap.set('mark5_63',mark5_63)
        if(!((//start1
            mark5_61 === '×'||mark5_62 === '×'||mark5_63 === '×'
            //end1
        ) && mark5_6 === '×'||(
            //start2
            mark5_61 != '×'&&mark5_62 != '×'&&mark5_63 != '×'
            //end2
        ) && mark5_6 != '×'))
        {addstrtip('5_6结论有误！')}
        var date20040101=StringToDate('2004-01-01')
        if(zhizaodate.getTime()<date20040101.getTime())
        {
            addstrtip('注意5_6是否按照老标准勾选！')
        }

        var mark6_1 = document.getElementById('1622636821529f236').innerText.trim()
        var mark6_1_1 = document.getElementById('1622636912158e34d').innerText.trim()
        var mark6_1_2 = document.getElementById('16226369400731482').innerText.trim()

        fenxiangjlmap.set('mark6_1',mark6_1)
        fenxiangmap.set('mark6_1_1',mark6_1_1)
        fenxiangmap.set('mark6_1_2',mark6_1_2)
        if(!((//start1
            mark6_1_1 === '×'||mark6_1_2 === '×'
            //end1
        ) && mark6_1 === '×'||(
            //start2
            mark6_1_1 != '×'&&mark6_1_2 != '×'
            //end2
        ) && mark6_1 != '×'))
        {addstrtip('mark6_1结论有误！')}
        if(mark6_1_1!='N')
        {
            var mendikanjuliright=false
            if(!isNaN(Number(mark6_1_1)))
            {
                if(parseFloat(mark6_1_1)>0)
                {
                    mendikanjuliright=true
                }
            }
            if(!mendikanjuliright)
            {
                addstrtip('注意门地坎距离！')
            }
            if(!(parseFloat(mark6_1_1)<=35&&mark6_1_2==='√'||parseFloat(mark6_1_1)>35&&mark6_1_2==='×'))
            {
                addstrtip('注意6_1是否矛盾！')
            }
        }

        var mark6_2 = document.getElementById('162263682153025c4').innerText.trim()
        var mark6_2_1 = document.getElementById('16226369669797f51').innerText.trim()

        fenxiangjlmap.set('mark6_2',mark6_2)
        fenxiangmap.set('mark6_2_1',mark6_2_1)
        if(!((//start1
            mark6_2_1 === '×'
            //end1
        ) && mark6_2 === '×'||(
            //start2
            mark6_2_1 != '×'
            //end2
        ) && mark6_2 != '×'))
        {addstrtip('mark6_2结论有误！')}


        var mark6_3 = document.getElementById('16226368215323edf').innerText.trim()
        var mark6_3_11 = document.getElementById('162263699156029c5').innerText.trim()
        var mark6_3_12 = document.getElementById('16424988069538462').innerText.trim()
        var mark6_3_13 = document.getElementById('1622637029186754d').innerText.trim()
        var mark6_3_14 = document.getElementById('1642499327741b74d').innerText.trim()
        var mark6_3_15 = document.getElementById('16226370563714ea0').innerText.trim()
        var mark6_3_21 = document.getElementById('16226370860196fa8').innerText.trim()
        var mark6_3_22 = document.getElementById('16226371149069e2d').innerText.trim()
        var mark6_3_23 = document.getElementById('162263715148786bf').innerText.trim()
        fenxiangjlmap.set('mark6_3',mark6_3)
        fenxiangmap.set('mark6_3_11',mark6_3_11)
        fenxiangmap.set('mark6_3_12',mark6_3_12)
        fenxiangmap.set('mark6_3_13',mark6_3_13)
        fenxiangmap.set('mark6_3_14',mark6_3_14)
        fenxiangmap.set('mark6_3_15',mark6_3_15)
        fenxiangmap.set('mark6_3_21',mark6_3_21)
        fenxiangmap.set('mark6_3_22',mark6_3_22)
        fenxiangmap.set('mark6_3_23',mark6_3_23)
        if(!((//start1
            mark6_3_11 === '×'||mark6_3_12 === '×'||mark6_3_13 === '×'||mark6_3_14 === '×'||mark6_3_15 === '×'
            ||mark6_3_21 === '×'||mark6_3_22 === '×'||mark6_3_23 === '×'
            //end1
        ) && mark6_3 === '×'||(
            //start2
            mark6_3_11 != '×'&&mark6_3_12 != '×'&&mark6_3_13 != '×'&&mark6_3_14 != '×'&&mark6_3_15 != '×'
            &&mark6_3_21 != '×'&&mark6_3_22 != '×'&&mark6_3_23 != '×'
            //end2
        ) && mark6_3 != '×'))
        {addstrtip('6_3结论有误！')}

        var mark6_4 = document.getElementById('1622636821533bdb7').innerText.trim()
        var mark6_41 = document.getElementById('162263718693384fd').innerText.trim()
        fenxiangjlmap.set('mark6_4',mark6_4)
        fenxiangmap.set('mark6_41',mark6_41)
        if(!((//start1
            mark6_41 === '×'
            //end1
        ) && mark6_4 === '×'||(
            //start2
            mark6_41 != '×'
            //end2
        ) && mark6_4 != '×'))
        {addstrtip('6_4结论有误！')}
        if(mark6_41!='-')
        {
            addstrtip('6_4注意是否玻璃门防拖曳！')
            strinput=strinput+'6_4有玻璃门防拖曳    '
        }
        else
        {
            strinput=strinput+'6_4无玻璃门防拖曳    '
        }


        var mark6_5 = document.getElementById('16226368215342cc6').innerText.trim()
        var mark6_51 = document.getElementById('1622637208733eb3a').innerText.trim()
        var mark6_52 = document.getElementById('16226372270609baa').innerText.trim()
        fenxiangjlmap.set('mark6_5',mark6_5)
        fenxiangmap.set('mark6_51',mark6_51)
        fenxiangmap.set('mark6_52',mark6_52)
        if(!((//start1
            mark6_51 === '×'||mark6_52 === '×'
            //end1
        ) && mark6_5 === '×'||(
            //start2
            mark6_51 != '×'&&mark6_52 != '×'
            //end2
        ) && mark6_5 != '×'))
        {addstrtip('6_5结论有误！')}
        var mark6_6 = document.getElementById('16226368215354600').innerText.trim()
        var mark6_61 = document.getElementById('1622637250539b3d4').innerText.trim()
        var mark6_62 = document.getElementById('16226372731213a43').innerText.trim()

        fenxiangjlmap.set('mark6_6',mark6_6)
        fenxiangmap.set('mark6_61',mark6_61)
        fenxiangmap.set('mark6_62',mark6_62)
        if(!((//start1
            mark6_61 === '×'||mark6_62 === '×'
            //end1
        ) && mark6_6 === '×'||(
            //start2
            mark6_61 != '×'&&mark6_62 != '×'
            //end2
        ) && mark6_6 != '×'))
        {addstrtip('6_6结论有误！')}
        if(mark6_62!='-')
        {
            //addstrtip('6_6TIP:有应急导向装置！')
            strinput=strinput+'有应急导向装置    '
        }
        else
        {
            //addstrtip('6_6TIP:无应急导向装置！')
            strinput=strinput+'无应急导向装置    '
        }

        var mark6_7 = document.getElementById('1622619332912ef9').innerText.trim()
        var mark6_71 = document.getElementById('16474226541106a2e').innerText.trim()
        var mark6_72 = document.getElementById('164742267508103fd').innerText.trim()
        fenxiangjlmap.set('mark6_6',mark6_6)
        fenxiangmap.set('mark6_71',mark6_71)
        fenxiangmap.set('mark6_72',mark6_72)
        if(!((//start1
            mark6_71 === '×'||mark6_72 === '×'
            //end1
        ) && mark6_7 === '×'||(
            //start2
            mark6_71 != '×'&&mark6_72 != '×'
            //end2
        ) && mark6_7 != '×'))
        {addstrtip('6_7结论有误！')}
        if(mark6_72!='-')
        {
            strinput=strinput+'有重锤    '
        }
        else
        {
            strinput=strinput+'无重锤    '
        }

        var mark6_8 = document.getElementById('16226377489381920').innerText.trim()
        var mark6_81 = document.getElementById('16474226970028cb8').innerText.trim()
        var mark6_82 = document.getElementById('16474227299622a28').innerText.trim()

        fenxiangjlmap.set('mark6_8',mark6_8)
        fenxiangmap.set('mark6_81',mark6_81)
        fenxiangmap.set('mark6_82',mark6_82)
        if(!((//start1
            mark6_81 === '×'||mark6_82 === '×'
            //end1
        ) && mark6_8 === '×'||(
            //start2
            mark6_81 != '×'&&mark6_82 != '×'
            //end2
        ) && mark6_8 != '×'))
        {addstrtip('6_8结论有误！')}

        var mark6_9_1j = document.getElementById('16564020849697af6').innerText.trim()
        var mark6_9_1 = document.getElementById('1647422769358483c').innerText.trim()
        var mark6_9_11 = document.getElementById('16474227905173935').innerText.trim()
        var mark6_9_12 = document.getElementById('164742281497409b5').innerText.trim()
        var mark6_9_13_1 = document.getElementById('1647422858559c0fa').innerText.trim()
        var mark6_9_13_2 = document.getElementById('16474228350178dc6').innerText.trim()
        fenxiangjlmap.set('mark6_9_1j',mark6_9_1j)
        fenxiangmap.set('mark6_9_1',mark6_9_1)
        fenxiangmap.set('mark6_9_11',mark6_9_11)
        fenxiangmap.set('mark6_9_12',mark6_9_12)
        fenxiangmap.set('mark6_9_13_1',mark6_9_13_1)
        fenxiangmap.set('mark6_9_13_2',mark6_9_13_2)
        if(!((//start1
            mark6_9_1 === '×'||mark6_9_11 === '×'||mark6_9_12 === '×'||mark6_9_13_1 === '×'||mark6_9_13_2 === '×'
            //end1
        ) && mark6_9_1j === '×'||(
            //start2
            mark6_9_1 != '×'&&mark6_9_11 != '×'&&mark6_9_12 != '×'&&mark6_9_13_1 != '×'&&mark6_9_13_2 != '×'
            //end2
        ) && mark6_9_1j != '×'))
        {addstrtip('mark6_9结论有误！')}
        var nieheshenduright=false
        if(!isNaN(Number(mark6_9_13_1)))
        {
            if(parseFloat(mark6_9_13_1)>0)
            {
                nieheshenduright=true
            }
        }
        if(!nieheshenduright)
        {
            addstrtip('注意啮合深度！')
        }
        if(!(parseFloat(mark6_9_13_1)>=7&&mark6_9_13_2==='√'||parseFloat(mark6_9_13_1)<7&&mark6_9_13_2==='×'))
        {
            addstrtip('注意6_9啮合深度是否矛盾！')
        }

        var mark6_9_14j = document.getElementById('1656402116176c5d6').innerText.trim()
        var mark6_9_14 = document.getElementById('16474228955584d56').innerText.trim()
        fenxiangjlmap.set('mark6_9_14j',mark6_9_14j)
        fenxiangmap.set('mark6_9_14',mark6_9_14)
        if(!((//start1
            mark6_9_14 === '×'
            //end1
        ) && mark6_9_14j === '×'||(
            //start2
            mark6_9_14 != '×'
            //end2
        ) && mark6_9_14j != '×'))
        {addstrtip('mark6_9结论有误！')}

        var mark6_9_2j = document.getElementById('1652772677833d734').innerText.trim()
        var mark6_9_2 = document.getElementById('16474229151895c3c').innerText.trim()
        fenxiangjlmap.set('mark6_9_2j',mark6_9_2j)
        fenxiangmap.set('mark6_9_2',mark6_9_2)
        if(!((//start1
            mark6_9_2 === '×'
            //end1
        ) && mark6_9_2j === '×'||(
            //start2
            mark6_9_2 != '×'
            //end2
        ) && mark6_9_2j != '×'))
        {addstrtip('mark6_9结论有误！')}
        if(!(mark3_75 != '-'&&mark6_9_2!='-'||mark3_75 === '-'&&mark6_9_2==='-'))
        {
            addstrtip('3_7与6_9矛盾！')
        }


        var mark6_10 = document.getElementById('16226377489445b44').innerText.trim()
        var mark6_10_11 = document.getElementById('1647423309615e876').innerText.trim()
        var mark6_10_12 = document.getElementById('16474233573910994').innerText.trim()
        var mark6_10_21 = document.getElementById('16474233836857eec').innerText.trim()
        var mark6_10_22 = document.getElementById('1647423408187cc44').innerText.trim()
        fenxiangjlmap.set('mark6_10',mark6_10)
        fenxiangmap.set('mark6_10_11',mark6_10_11)
        fenxiangmap.set('mark6_10_12',mark6_10_12)
        fenxiangmap.set('mark6_10_21',mark6_10_21)
        fenxiangmap.set('mark6_10_22',mark6_10_22)
        if(!((//start1
            mark6_10_11 === '×'||mark6_10_12 === '×'||mark6_10_21 === '×'||mark6_10_22 === '×'
            //end1
        ) && mark6_10 === '×'||(
            //start2
            mark6_10_11 != '×'&&mark6_10_12 != '×'&&mark6_10_21 != '×'&&mark6_10_22 != '×'
            //end2
        ) && mark6_10 != '×'))
        {addstrtip('mark6_10结论有误！')}

        var mark6_11 = document.getElementById('1622637748946d20c').innerText.trim()
        var mark6_11_1 = document.getElementById('164742343566336be').innerText.trim()
        var mark6_11_2 = document.getElementById('16474234580652ce6').innerText.trim()
        fenxiangjlmap.set('mark6_11',mark6_11)
        fenxiangmap.set('mark6_11_1',mark6_11_1)
        fenxiangmap.set('mark6_11_2',mark6_11_2)
        if(!((//start1
            mark6_11_1 === '×'||mark6_11_2 === '×'
            //end1
        ) && mark6_11 === '×'||(
            //start2
            mark6_11_1 != '×'&&mark6_11_2 != '×'
            //end2
        ) && mark6_11 != '×'))
        {addstrtip('6_11结论有误！')}

        var mark6_12 = document.getElementById('1622637748948f699').innerText.trim()
        var mark6_121 = document.getElementById('1622638114600a625').innerText.trim()
        var mark6_122 = document.getElementById('16474235322404acc').innerText.trim()
        fenxiangjlmap.set('mark6_12',mark6_12)
        fenxiangmap.set('mark6_121',mark6_121)
        fenxiangmap.set('mark6_122',mark6_122)
        if(!((//start1
            mark6_121 === '×'||mark6_122 === '×'
            //end1
        ) && mark6_12 === '×'||(
            //start2
            mark6_121 != '×'&&mark6_122 != '×'
            //end2
        ) && mark6_12 != '×'))
        {addstrtip('6_12结论有误！')}
        var floatjianxi=parseFloat(mark6_121)
        if(floatjianxi<5)
        {
            if(mark6_12!='×')
            {
                addstrtip('6_12结论有误！')
            }
        }
        else
        {
            if(mark6_12==='×')
            {
                addstrtip('6_12结论有误！')
            }
        }
        if(mark6_121!='N')
        {
            var dikanmendaojianxiright=false
            if(!isNaN(Number(mark6_121)))
            {
                if(parseFloat(mark6_121)>0)
                {
                    dikanmendaojianxiright=true
                }
            }
            if(!dikanmendaojianxiright)
            {
                addstrtip('注意门刀、门锁滚轮与地坎间隙！')
            }
            if(!(parseFloat(mark6_121)>=5&&mark6_122==='√'||parseFloat(mark6_121)<5&&mark6_122==='×'))
            {
                addstrtip('注意6_12是否矛盾！')
            }
        }
        var mark7_1 = document.getElementById('162263774894902c9').innerText.trim()
        var mark7_1_1 = document.getElementById('1647423775757fbe3').innerText.trim()
        var mark7_1_2 = document.getElementById('1647423796832aed5').innerText.trim()
        var mark7_1_3 = document.getElementById('16474238183930d1c').innerText.trim()
        var mark7_1_4 = document.getElementById('16474238420721043').innerText.trim()

        fenxiangjlmap.set('mark7_1',mark7_1)
        fenxiangmap.set('mark7_1_1',mark7_1_1)
        fenxiangmap.set('mark7_1_2',mark7_1_2)
        fenxiangmap.set('mark7_1_3',mark7_1_3)
        fenxiangmap.set('mark7_1_4',mark7_1_4)
        if(!((//start1
            mark7_1_1 === '×'||mark7_1_2 === '×'||mark7_1_3 === '×'||mark7_1_4 === '×'
            //end1
        ) && mark7_1 === '×'||(
            //start2
            mark7_1_1 != '×'&&mark7_1_2 != '×'&&mark7_1_3 != '×'&&mark7_1_4 != '×'
            //end2
        ) && mark7_1 != '×'))
        {addstrtip('7_1结论有误！')}

        var mark7_2 = document.getElementById('1647758742473baa8').innerText.trim()
        var mark7_2_1 = document.getElementById('16477583096087f78').innerText.trim()
        var mark7_2_2 = document.getElementById('16477583347152fcd').innerText.trim()
        var mark7_2_3 = document.getElementById('16477583595130277').innerText.trim()

        fenxiangjlmap.set('mark7_2',mark7_2)
        fenxiangmap.set('mark7_2_1',mark7_2_1)
        fenxiangmap.set('mark7_2_2',mark7_2_2)
        fenxiangmap.set('mark7_2_3',mark7_2_3)
        if(!((//start1
            mark7_2_1 === '×'||mark7_2_2 === '×'||mark7_2_3 === '×'
            //end1
        ) && mark7_2 === '×'||(
            //start2
            mark7_2_1 != '×'&&mark7_2_2 != '×'&&mark7_2_3 != '×'
            //end2
        ) && mark7_2 != '×'))
        {addstrtip('7_2结论有误！')}

        var mark7_3 = document.getElementById('1647758722905d43e').innerText.trim()
        var mark7_3_1 = document.getElementById('1647758382715975e').innerText.trim()
        var mark7_3_2 = document.getElementById('1647758402396e210').innerText.trim()
        var mark7_3_3 = document.getElementById('16477584224809dcd').innerText.trim()
        var mark7_3_4 = document.getElementById('1647758442632e0cc').innerText.trim()
        var mark7_3_5 = document.getElementById('16477584654331449').innerText.trim()

        fenxiangjlmap.set('mark7_3',mark7_3)
        fenxiangmap.set('mark7_3_1',mark7_3_1)
        fenxiangmap.set('mark7_3_2',mark7_3_2)
        fenxiangmap.set('mark7_3_3',mark7_3_3)
        fenxiangmap.set('mark7_3_4',mark7_3_4)
        fenxiangmap.set('mark7_3_5',mark7_3_5)
        if(!((//start1
            mark7_3_1 === '×'||mark7_3_2 === '×'||mark7_3_3 === '×'||mark7_3_4 === '×'||mark7_3_5 === '×'
            //end1
        ) && mark7_3 === '×'||(
            //start2
            mark7_3_1 != '×'&&mark7_3_2 != '×'&&mark7_3_3 != '×'&&mark7_3_4 != '×'&&mark7_3_5 != '×'
            //end2
        ) && mark7_3 != '×'))
        {addstrtip('7_3结论有误！')}

        var mark7_4 = document.getElementById('1647758706329e322').innerText.trim()
        var mark7_4_11 = document.getElementById('1647758485817c944').innerText.trim()
        var mark7_4_12 = document.getElementById('1647758507539689d').innerText.trim()
        var mark7_4_21 = document.getElementById('1647758528914d549').innerText.trim()
        var mark7_4_22 = document.getElementById('16477585500354760').innerText.trim()

        fenxiangjlmap.set('mark7_4',mark7_4)
        fenxiangmap.set('mark7_4_21',mark7_4_21)
        fenxiangmap.set('mark7_4_22',mark7_4_22)
        fenxiangmap.set('mark7_4_11',mark7_4_11)
        fenxiangmap.set('mark7_4_12',mark7_4_12)
        if(!((//start1
            mark7_4_11 === '×'||mark7_4_12 === '×'||mark7_4_21 === '×'||mark7_4_22 === '×'
            //end1
        ) && mark7_4 === '×'||(
            //start2
            mark7_4_11 != '×'&&mark7_4_12 != '×'&&mark7_4_21 != '×'&&mark7_4_22 != '×'
            //end2
        ) && mark7_4 != '×'))
        {addstrtip('7_4结论有误！')}

        var mark8_1 = document.getElementById('1647758692772c8fb').innerText.trim()
        var mark8_1_1 = document.getElementById('1647758599820eab5').textContent.trim().slice(7)
        var mark8_1_2 = document.getElementById('164775857578792ce').innerText.trim()
        var mark8_1_3 = document.getElementById('1647758614793ac2a').innerText.trim()
        if(mark8_1_1!='-')
        {
            var mark8_1_1right=false
            if(!isNaN(Number(mark8_1_1)))
            {
                if(parseFloat(mark8_1_1)>0)
                {
                    mark8_1_1right=true
                }
            }
            if(!mark8_1_1right)
            {
                addstrtip('注意mark8_1平衡系数数据是否正确！')
            }
            var mark8_1_1f=parseFloat(mark8_1_1)
            if(mark8_1_1f>=0.4&&mark8_1_1f<=0.5)
            {
                if(mark8_1_2!='√')
                {
                    addstrtip('8_1 注意平衡系数数据与勾选矛盾！')
                }
            }
            else
            {
                if(mark8_1_2!='×')
                {
                    addstrtip('8_1 注意平衡系数数据与勾选矛盾！')
                }
            }
        }
        fenxiangjlmap.set('mark8_1',mark8_1)
        fenxiangmap.set('mark8_1_1',mark8_1_1)
        fenxiangmap.set('mark8_1_2',mark8_1_2)
        fenxiangmap.set('mark8_1_3',mark8_1_3)
        if(!((//start1
            mark8_1_1 === '×'||mark8_1_2 === '×'||mark8_1_3 === '×'
            //end1
        ) && mark8_1 === '×'||(
            //start2
            mark8_1_1 != '×'&&mark8_1_2 != '×'&&mark8_1_3 != '×'
            //end2
        ) && mark8_1 != '×'))
        {addstrtip('8_1结论有误！')}

        if(mark8_1_1==='N'||mark8_1_2==='N')
        {
            addstrtip('8_1 平衡系数应实测！')
        }
        if((mark8_1_1!='-'||mark8_1_2!='-')&&mark8_1_3!='-')
        {
            addstrtip('8_1 注意平衡系数勾选矛盾！')
        }
        if(mark8_1_3!='-')
        {
            addstrtip('8_1 注意平衡系数是否“符合制造（改造）单位设计值”！')
            strinput=strinput+'平衡系数无特殊设计值    '
        }
        else
        {
            strinput=strinput+'平衡系数符合设计值    '
        }


        var mark8_2 = document.getElementById('1647758677412e1ac').innerText.trim()
        var mark8_21 = document.getElementById('16477586353707c63').innerText.trim()
        var mark8_22 = document.getElementById('16477586565867700').innerText.trim()

        fenxiangjlmap.set('mark8_2',mark8_2)
        fenxiangmap.set('mark8_21',mark8_21)
        fenxiangmap.set('mark8_22',mark8_22)
        if(!((//start1
            mark8_21 === '×'||mark8_22 === '×'
            //end1
        ) && mark8_2 === '×'||(
            //start2
            mark8_21 != '×'&&mark8_22 != '×'
            //end2
        ) && mark8_2 != '×'))
        {addstrtip('8_2结论有误！')}

        if(mark8_21 === '-'&&mark8_22 === '-'&& mark8_2 === '-')
        {
            strinput=strinput+'无上行超速保护    '
        }
        else if(mark8_21 != '-'&&mark8_22 != '-'&& mark8_2 != '-')
        {
            strinput=strinput+'有上行超速保护    '
        }
        else
        {
            strinput=strinput+'上行超速保护部分勾选    '
        }

        var mark8_3 = document.getElementById('1647758021650b22d').innerText.trim()
        var mark8_3_1 = document.getElementById('1647757617127c99a').innerText.trim()
        var mark8_3_2 = document.getElementById('1647757641154a85b').innerText.trim()

        fenxiangjlmap.set('mark8_3',mark8_3)
        fenxiangmap.set('mark8_3_1',mark8_3_1)
        fenxiangmap.set('mark8_3_2',mark8_3_2)
        if(!((//start1
            mark8_3_1 === '×'||mark8_3_2 === '×'
            //end1
        ) && mark8_3 === '×'||(
            //start2
            mark8_3_1 != '×'&&mark8_3_2 != '×'
            //end2
        ) && mark8_3 != '×'))
        {addstrtip('8_3结论有误！')}
        if(gksubif!=1)
        {
            if(mark8_3_2!= '-')
            {
                addstrtip('蜗轮蜗杆，8_3_2 UCMP冗余制动不适用！')
            }
        }

        var mark8_4 = document.getElementById('164775803707080c6').innerText.trim()
        var mark8_4_1 = document.getElementById('164775766130811db').innerText.trim()
        var mark8_4_11 = document.getElementById('16477576841823000').innerText.trim()
        var mark8_4_12 = document.getElementById('1647757704563eb3e').innerText.trim()
        var mark8_4_13 = document.getElementById('164775774693274b1').innerText.trim()
        var mark8_4_14 = document.getElementById('16477577715167679').innerText.trim()
        var mark8_4_2 = document.getElementById('16477577938533633').innerText.trim()

        fenxiangjlmap.set('mark8_4',mark8_4)
        fenxiangmap.set('mark8_4_1',mark8_4_1)
        fenxiangmap.set('mark8_4_11',mark8_4_11)
        fenxiangmap.set('mark8_4_12',mark8_4_12)
        fenxiangmap.set('mark8_4_13',mark8_4_13)
        fenxiangmap.set('mark8_4_14',mark8_4_14)
        fenxiangmap.set('mark8_4_2',mark8_4_2)
        if(!((//start1
            mark8_4_1 === '×'||mark8_4_11 === '×'||mark8_4_12 === '×'||mark8_4_13 === '×'||mark8_4_14 === '×'||mark8_4_2 === '×'
            //end1
        ) && mark8_4 === '×'||(
            //start2
            mark8_4_1 != '×'&&mark8_4_11 != '×'&&mark8_4_12 != '×'&&mark8_4_13 != '×'&&mark8_4_14 != '×'&&mark8_4_2 != '×'
            //end2
        ) && mark8_4 != '×'))
        {addstrtip('8_4结论有误！')}
        if(mark8_4_11!='-')
        {
            addstrtip('8_4瞬时式安全钳！')
        }
        if(mark8_4_13!='-')
        {
            addstrtip('8_4超面积载货梯！')
        }
        if(mark8_4_14!='-')
        {
            addstrtip('8_4汽车梯！')
        }
        if(mark8_4_2!='-')
        {
            addstrtip('8_4联动定检勾选！')
        }


        var mark8_5 = document.getElementById('1647758051061879f').innerText.trim()
        var mark8_51 = document.getElementById('164775781778136b0').innerText.trim()

        fenxiangjlmap.set('mark8_5',mark8_5)
        fenxiangmap.set('mark8_51',mark8_51)
        if(!((//start1
            mark8_51 === '×'
            //end1
        ) && mark8_5 === '×'||(
            //start2
            mark8_51 != '×'
            //end2
        ) && mark8_5 != '×'))
        {addstrtip('8_5结论有误！')}
        if(mark8_51!='-')
        {
            addstrtip('8_5注意是否有对重安全钳！')
            strinput=strinput+'有对重安全钳    '
        }
        else
        {
            strinput=strinput+'无对重安全钳    '
        }

        var mark8_6 = document.getElementById('16477580766796c3d').innerText.trim()
        var mark8_61 = document.getElementById('1647757847171daf9').innerText.trim()
        var mark8_62 = document.getElementById('1647757872219f0e7').innerText.trim()

        fenxiangjlmap.set('mark8_6',mark8_6)
        fenxiangmap.set('mark8_61',mark8_61)
        fenxiangmap.set('mark8_62',mark8_62)
        if(!((//start1
            mark8_61 === '×'||mark8_62 === '×'
            //end1
        ) && mark8_6 === '×'||(
            //start2
            mark8_61 != '×'&&mark8_62 != '×'
            //end2
        ) && mark8_6 != '×'))
        {addstrtip('8_6结论有误！')}

        if(mark8_62!='-')
        {
            strinput=strinput+'有IC卡    '
        }
        else
        {
            strinput=strinput+'无IC卡    '
        }

        var mark8_7 = document.getElementById('16477580946987e18').innerText.trim()
        var mark8_7_1 = document.getElementById('1647757899302c449').innerText.trim()
        var mark8_7_2 = document.getElementById('1647757928539d02a').innerText.trim()
        var mark8_7_3 = document.getElementById('1622639354819d81c').innerText.trim()

        fenxiangjlmap.set('mark8_7',mark8_7)
        fenxiangmap.set('mark8_7_1',mark8_7_1)
        fenxiangmap.set('mark8_7_2',mark8_7_2)
        fenxiangmap.set('mark8_7_3',mark8_7_3)
        if(!((//start1
            mark8_7_1 === '×'||mark8_7_2 === '×'||mark8_7_3 === '×'
            //end1
        ) && mark8_7 === '×'||(
            //start2
            mark8_7_1 != '×'&&mark8_7_2 != '×'&&mark8_7_3 != '×'
            //end2
        ) && mark8_7 != '×'))
        {addstrtip('8_7结论有误！')}

        var mark8_8 = document.getElementById('16477581114871815').innerText.trim()
        var mark8_8_1 = document.getElementById('16477579491621778').innerText.trim()

        fenxiangjlmap.set('mark8_8',mark8_8)
        fenxiangmap.set('mark8_8_1',mark8_8_1)
        if(!((//start1
            mark8_8_1 === '×'
            //end1
        ) && mark8_8 === '×'||(
            //start2
            mark8_8_1 != '×'
            //end2
        ) && mark8_8 != '×'))
        {addstrtip('8_8结论有误！')}


        var mark8_9 = document.getElementById('16477581260439c64').innerText.trim()
        var mark8_91 = document.getElementById('164775797633243e3').innerText.trim()

        fenxiangjlmap.set('mark8_9',mark8_9)
        fenxiangmap.set('mark8_91',mark8_91)
        if(!((//start1
            mark8_91 === '×'
            //end1
        ) && mark8_9 === '×'||(
            //start2
            mark8_91 != '×'
            //end2
        ) && mark8_9 != '×'))
        {addstrtip('8_9结论有误！')}


        var mark8_10 = document.getElementById('16477581430697589').innerText.trim()
        var mark8_101 = document.getElementById('16477579997751296').innerText.trim()

        fenxiangjlmap.set('mark8_10',mark8_10)
        fenxiangmap.set('mark8_101',mark8_101)
        if(!((//start1
            mark8_101 === '×'
            //end1
        ) && mark8_10 === '×'||(
            //start2
            mark8_101 != '×'
            //end2
        ) && mark8_10 != '×'))
        {addstrtip('8_10结论有误！')}

        //与mark8_11冲突，此处取为mark8_11_
        var mark8_11_ = document.getElementById('1647755319970322e').innerText.trim()
        var mark8_111 = document.getElementById('162263883836576e5').innerText.trim()

        fenxiangjlmap.set('mark8_11_',mark8_11_)
        fenxiangmap.set('mark8_111',mark8_111)
        if(!((//start1
            mark8_111 === '×'
            //end1
        ) && mark8_11_ === '×'||(
            //start2
            mark8_111 != '×'
            //end2
        ) && mark8_11_ != '×'))
        {addstrtip('8_11结论有误！')}

        //与mark8_12冲突，此处取为mark8_12_
        var mark8_12_ = document.getElementById('1647755443342f8e6').innerText.trim()
        var mark8_121 = document.getElementById('16477553696065b01').innerText.trim()
        var mark8_122 = document.getElementById('16477553923233dde').innerText.trim()

        fenxiangjlmap.set('mark8_12_',mark8_12_)
        fenxiangmap.set('mark8_121',mark8_121)
        fenxiangmap.set('mark8_122',mark8_122)
        if(!((//start1
            mark8_121 === '×'||mark8_122 === '×'
            //end1
        ) && mark8_12_ === '×'||(
            //start2
            mark8_121 != '×'&&mark8_122 != '×'
            //end2
        ) && mark8_12_ != '×'))
        {addstrtip('8_12结论有误！')}

        var mark8_13 = document.getElementById('1647755463942829c').innerText.trim()
        var mark8_131 = document.getElementById('164775541838474ba').innerText.trim()

        fenxiangjlmap.set('mark8_13',mark8_13)
        fenxiangmap.set('mark8_131',mark8_131)
        if(!((//start1
            mark8_131 === '×'
            //end1
        ) && mark8_13 === '×'||(
            //start2
            mark8_131 != '×'
            //end2
        ) && mark8_13 != '×'))
        {addstrtip('8_13结论有误！')}

        //附录1 顶部空间
        //附录1 顶部空间
        //附录1 顶部空间
        var markfl1B1 = document.getElementById('1622533928092cea1').textContent.trim().slice(4)
        var markfl1C1 = document.getElementById('1622534045094bdc8').textContent.trim().slice(4)
        var markfl1A1 = document.getElementById('16225341421569790').textContent.trim().slice(5)

        var markfl1B2 = document.getElementById('1622533949156916c').textContent.trim().slice(4)
        var markfl1C2 = document.getElementById('16225340603829763').textContent.trim().slice(4)
        var markfl1A2 = document.getElementById('16225341666546ed2').textContent.trim().slice(5)

        var markfl1B3 = document.getElementById('16225339732802755').textContent.trim().slice(4)
        var markfl1C3 = document.getElementById('16225340763990139').textContent.trim().slice(4)
        var markfl1A3 = document.getElementById('1622534189078e9a6').textContent.trim().slice(5)

        var markfl1B4 = document.getElementById('16225340056313e2b').textContent.trim().slice(4)
        var markfl1C4 = document.getElementById('1622534093465cc23').textContent.trim().slice(4)
        var markfl1A4 = document.getElementById('1622534204941d171').textContent.trim().slice(5)

        var markfl1H = document.getElementById('16225341093213226').textContent.trim().slice(4)

        var markfl1_4 = document.getElementById('162253319182817c').textContent.trim().slice(5)
        if(markfl1_4!='符合要求'&&markfl1_4!='N')
        {
            addstrtip('附录1顶层空间数据条件4是否正确！')
        }
        var markfl1_5 = document.getElementById('16225342574690973').textContent.trim().slice(4)

        if(markfl1_5!='-')
        {
            if(!(markfl1B1==='-'&&markfl1C1==='-'&&markfl1A1==='-'&&
                 markfl1B2==='-'&&markfl1C2==='-'&&markfl1A2==='-'&&
                 markfl1B3==='-'&&markfl1C3==='-'&&markfl1A3==='-'&&
                 markfl1B4==='-'&&markfl1C4==='-'&&markfl1A4==='-'&&
                 markfl1H==='-'&&markfl1_4==='-'))
            {
                addstrtip('附录1顶层空间数据与条件5矛盾！')
            }
        }
        else
        {
            if(!(markfl1B1 != '-'&&markfl1C1 != '-' &&markfl1A1 != '-' &&
                 markfl1B2 != '-'&&markfl1C2 != '-'&&markfl1A2 != '-' &&
                 markfl1B3 != '-'&&markfl1C3 != '-'&&markfl1A3 != '-'))
            {
                addstrtip('附录1顶层空间数据不完整！')
            }
            if(markfl1B4 != '-'||markfl1C4 != '-'||markfl1A4 != '-')
            {
                addstrtip('附录1顶层空间附件距离有填写！')
                var dincengdatafujian4right=false
                if(!isNaN(Number(markfl1B4))&&!isNaN(Number(markfl1C4))&&!isNaN(Number(markfl1A4)))
                {
                    if(parseFloat(markfl1B4)>0&&parseFloat(markfl1C4)>0&&parseFloat(markfl1A4)>0)
                    {
                        dincengdatafujian4right=true
                    }
                }
                if(!dincengdataright)
                {
                    addstrtip('注意附录1顶层空间附件距离数据是否正确！')
                }
            }
        }


        var dincengdataright=false
        if(!isNaN(Number(markfl1B1))&&!isNaN(Number(markfl1C1))&&!isNaN(Number(markfl1A1))&&
           !isNaN(Number(markfl1B2))&&!isNaN(Number(markfl1C2))&&!isNaN(Number(markfl1A2))&&
           !isNaN(Number(markfl1B3))&&!isNaN(Number(markfl1C3))&&!isNaN(Number(markfl1A3))&&
           !isNaN(Number(markfl1H)))
        {
            if(parseFloat(markfl1B1)>0&&parseFloat(markfl1C1)>0&&parseFloat(markfl1A1)>0&&
               parseFloat(markfl1B2)>0&&parseFloat(markfl1C2)>0&&parseFloat(markfl1A2)>0&&
               parseFloat(markfl1B3)>0&&parseFloat(markfl1C3)>0&&parseFloat(markfl1A3)>0&&
               parseFloat(markfl1H)>0)
            {
                dincengdataright=true
            }
        }


        if(!dincengdataright)
        {
            addstrtip('注意附录1顶层空间数据是否正确！')
        }

        var markfl1B1f=parseFloat(markfl1B1)
        var markfl1C1f=parseFloat(markfl1C1)
        var markfl1A1f=parseFloat(markfl1A1)

        var markfl1B2f=parseFloat(markfl1B2)
        var markfl1C2f=parseFloat(markfl1C2)
        var markfl1A2f=parseFloat(markfl1A2)

        var markfl1B3f=parseFloat(markfl1B3)
        var markfl1C3f=parseFloat(markfl1C3)
        var markfl1A3f=parseFloat(markfl1A3)

        var markfl1B4f=parseFloat(markfl1B4)
        var markfl1C4f=parseFloat(markfl1C4)
        var markfl1A4f=parseFloat(markfl1A4)

        var markfl1Hf=parseFloat(markfl1H)
        var edsudu=parseFloat(gkedinsudu)
        var zhidaofujian=(0.1+0.035*Math.pow(edsudu,2)).toFixed(3)
        var zuigao=(0.3+0.035*Math.pow(edsudu,2)).toFixed(3)
        var zhanren=(1.0+0.035*Math.pow(edsudu,2)).toFixed(3)
        var ti
        if(Math.abs(markfl1B1f-zhidaofujian)>0.0001)
        {
            ti='制导行程要求值与额定速度：'
            ti=ti.concat(gkedinsudu)
            ti=ti.concat('对应值：')
            ti=ti.concat(zhidaofujian.toString())
            ti=ti.concat('不符');
            addstrtip(ti)
        }
        if(Math.abs(markfl1B2f-zhanren)>0.0001)
        {
            ti='可站人要求值与额定速度：'
            ti=ti.concat(gkedinsudu);
            ti=ti.concat('对应值：')
            ti=ti.concat(zhanren.toString())
            ti=ti.concat('不符')
            addstrtip(ti)
        }
        if(Math.abs(markfl1B3f-zuigao)>0.0001)
        {
            ti='最高部件要求值与额定速度：'
            ti=ti.concat(gkedinsudu)
            ti=ti.concat('对应值：')
            ti=ti.concat(zuigao.toString())
            ti=ti.concat('不符')
            addstrtip(ti)
        }
        if(markfl1B4 != '-'||markfl1C4 != '-'||markfl1A4 != '-')
        {
            if(Math.abs(markfl1B4f-zhidaofujian)>0.0001)
            {
                ti='附件要求值与额定速度：'
                ti=ti.concat(gkedinsudu)
                ti=ti.concat('对应值：')
                ti=ti.concat(zhidaofujian.toString())
                ti=ti.concat('不符')
                addstrtip(ti)
            }
        }
        //对两个浮点数判断大小和是否相等不能直接用==来判断，会出错！明明相等的两个数比较反而是不相等！
        //对于两个浮点数比较只能通过相减并与预先设定的精度比较，记得要取绝对值！
        if(Math.abs(markfl1C1f-markfl1Hf-markfl1A1f)>0.0001)
        {
            addstrtip('C1-H != A1')
        }
        if(Math.abs(markfl1C2f-markfl1Hf-markfl1A2f)>0.0001)
        {
            addstrtip('C2-H != A2')
        }
        if(Math.abs(markfl1C3f-markfl1Hf-markfl1A3f)>0.0001)
        {
            addstrtip('C3-H != A3')
        }

        if(Math.abs(markfl1C4f-markfl1Hf-markfl1A4f)>0.0001)
        {
            addstrtip('C3-H != A3')
        }


        if(markfl1A1f<markfl1B1f)
        {
            addstrtip('A1 < B1')
        }
        if(markfl1A2f<markfl1B2f)
        {
            addstrtip('A2 < B2')
        }
        if(markfl1A3f<markfl1B3f)
        {
            addstrtip('A3 < B3')
        }
        if(markfl1A4f<markfl1B4f)
        {
            addstrtip('A4 < B4')
        }


        //附录3平衡系数表
        //附录3平衡系数表
        //附录3平衡系数表
        var markfl3_30s = document.getElementById('15536944226714b1b').textContent.trim().slice(9)
        var markfl3_30x = document.getElementById('155369442267132b2').textContent.trim().slice(11)
        var markfl3_40s = document.getElementById('1553694422671f5dc').textContent.trim().slice(9)
        var markfl3_40x = document.getElementById('155369442267160d0').textContent.trim().slice(11)

        var markfl3_45s = document.getElementById('15536944226712c4c').textContent.trim().slice(9)
        var markfl3_45x = document.getElementById('15536944226717a21').textContent.trim().slice(11)

        var markfl3_50s = document.getElementById('1553694422671b35b').textContent.trim().slice(9)
        var markfl3_50x = document.getElementById('1553694422671475d').textContent.trim().slice(11)
        var markfl3_60s = document.getElementById('155369442267162a5').textContent.trim().slice(9)
        var markfl3_60x = document.getElementById('155369442267117f1').textContent.trim().slice(11)

        var pinghengxishuright=false
        if(!isNaN(Number(markfl3_30s))&&!isNaN(Number(markfl3_30x))&&
           !isNaN(Number(markfl3_40s))&&!isNaN(Number(markfl3_40x))&&
           !isNaN(Number(markfl3_45s))&&!isNaN(Number(markfl3_45x))&&
           !isNaN(Number(markfl3_50s))&&!isNaN(Number(markfl3_50x))&&
           !isNaN(Number(markfl3_60s))&&!isNaN(Number(markfl3_60x)))
        {
            if(parseFloat(markfl3_30s)>0&&parseFloat(markfl3_30x)>0&&
               parseFloat(markfl3_40s)>0&&parseFloat(markfl3_40x)>0&&
               parseFloat(markfl3_45s)>0&&parseFloat(markfl3_45x)>0&&
               parseFloat(markfl3_50s)>0&&parseFloat(markfl3_50x)>0&&
               parseFloat(markfl3_60s)>0&&parseFloat(markfl3_60x)>0)
            {
                pinghengxishuright=true
            }
        }
        if(!pinghengxishuright)
        {
            addstrtip('注意附录3平衡系数数据是否正确！')
        }

        var markfl3_30sf=parseFloat(markfl3_30s)
        var markfl3_30xf=parseFloat(markfl3_30x)
        var markfl3_40sf=parseFloat(markfl3_40s)
        var markfl3_40xf=parseFloat(markfl3_40x)

        var markfl3_45sf=parseFloat(markfl3_45s)
        var markfl3_45xf=parseFloat(markfl3_45x)

        var markfl3_50sf=parseFloat(markfl3_50s)
        var markfl3_50xf=parseFloat(markfl3_50x)
        var markfl3_60sf=parseFloat(markfl3_60s)
        var markfl3_60xf=parseFloat(markfl3_60x)

        var shangxing=[markfl3_30sf,markfl3_40sf,markfl3_45sf,markfl3_50sf,markfl3_60sf]
        var xiaxing=[markfl3_30xf,markfl3_40xf,markfl3_45xf,markfl3_50xf,markfl3_60xf]
        var sxright=true
        var xxright=true
        var pinghengqidian=-1//平衡系数点
        var pinghengxishu=-1//平衡系数
        var length = shangxing.length;//对数组进行遍历
        var a1=0,b1=0,b2=0,d1=0,d2=0
        for (var i=0;i<length-1;i++){
            if(shangxing[i]>shangxing[i+1])
            {
                sxright=false
            }
            if(xiaxing[i]<xiaxing[i+1])
            {
                xxright=false
            }
            if(((shangxing[i]<xiaxing[i])&&(shangxing[i+1]>xiaxing[i+1]))||(shangxing[i]===xiaxing[i]))
            {
                pinghengqidian=i
            }
        }
        if(!sxright)
        {
            addstrtip('上行数据不递增！')
        }
        if(!xxright)
        {
            addstrtip('下行数据不递减！')
        }
        if(pinghengqidian===-1)
        {
            addstrtip('注意附录3平衡系数数据无交点！')
        }
        else
        {
            if(pinghengqidian===0)
            {
                addstrtip('注意附录3平衡系数小于0.4！')
            }
            else if(pinghengqidian===1)
            {
                if(shangxing[pinghengqidian]===xiaxing[pinghengqidian])
                {
                    pinghengxishu=0.4
                }
                else
                {
                    a1=0.4
                    b1=shangxing[pinghengqidian]
                    b2=shangxing[pinghengqidian+1]
                    d1=xiaxing[pinghengqidian]
                    d2=xiaxing[pinghengqidian+1]
                    pinghengxishu=(a1*((b2-b1)-(d2-d1))+0.05*(d1-b1))/((b2-b1)-(d2-d1))
                    pinghengxishu=pinghengxishu.toFixed(2)
                }
            }
            else if(pinghengqidian===2)
            {
                if(shangxing[pinghengqidian]===xiaxing[pinghengqidian])
                {
                    pinghengxishu=0.45
                }
                else
                {
                    a1=0.45
                    b1=shangxing[pinghengqidian]
                    b2=shangxing[pinghengqidian+1]
                    d1=xiaxing[pinghengqidian]
                    d2=xiaxing[pinghengqidian+1]
                    pinghengxishu=(a1*((b2-b1)-(d2-d1))+0.05*(d1-b1))/((b2-b1)-(d2-d1))
                    pinghengxishu=pinghengxishu.toFixed(2)
                }
            }
            else if(pinghengqidian===3)
            {
                if(shangxing[pinghengqidian]===xiaxing[pinghengqidian])
                {
                    pinghengxishu=0.5
                }
                else
                {
                    addstrtip('注意附录3平衡系数大于0.5！')
                }
            }
        }
        if(pinghengxishu!=-1)
        {
            if(mark8_1_1!='-')
            {
                if(Math.abs(mark8_1_1f-pinghengxishu)>0.001)
                {
                    var phxs='注意附录3平衡系数：'+pinghengxishu.toString()+'与mark8.1项：'+mark8_1_1.toString()+'不一致！'
                    addstrtip(phxs)
                }
            }
        }



        //下次制动是否勾选

        if(mark8_131==='-')
        {
            addstrtip('8_13TIP:制动未勾选！')
        }


        if((mark2_1_11!='-'||mark2_1_12!='-'||mark2_1_13!='-'||mark2_1_14!='-'//机房爬梯
            ||mark2_1_31!='-'||mark2_1_32!='-'||mark2_1_33!='-'||mark2_3_3 !='-'//机房门及地面高度差
            ||mark2_4!='-'|mark2_6_4!='-'//地面开口，共用机房
            ||mark2_7_51!='-'||mark2_7_52!='-'||mark2_7_53!='-'||mark2_7_54!='-'||mark2_7_55!='-')//盘车松闸
           &&(mark2_6_11 !='-'||mark2_6_12 !='-'||mark2_6_13 !='-'//无机房主开关
              ||mark2_8_51 !='-'||mark2_8_52 !='-'||mark2_8_53 !='-'||mark2_8_54 !='-'//无机房紧急操作及动态测试装置
              ||mark7_1!='-'||mark7_2!='-'||mark7_3!='-'))
        {
            addstrtip('无机房与有机房项目同时勾选！')
        }
        //无机房项目校验，若不是无机房，通过使用登记编号判断是否为无机房
        if(mark7_1==='-'&&mark7_2==='-'&&mark7_3==='-')
        {
            if(mark2_1_31 === '-'&&mark2_1_32 === '-'&&mark2_1_33 === '-')//机房门
            {
                addstrtip('无机房项目7与机房门同为无此项！')
            }
            if(mark2_6_11 !='-'||mark2_6_12 !='-'||mark2_6_13 !='-')//无机房主开关
            {
                addstrtip('无机房项目7与无机房主开关矛盾！')
            }
            if(mark2_8_51 !='-'||mark2_8_52 !='-'||mark2_8_53 !='-'||mark2_8_54 !='-')//无机房紧急操作及动态测试装置
            {
                addstrtip('无机房项目7与紧急操作及动态测试装置矛盾！')
            }
            if(mark2_5_2==='-'){
                addstrtip('有机房与mark2_5_2矛盾！')
            }
        }
        //若是无机房
        else if(!((mark7_1!='-'&&mark7_2==='-'&&mark7_3==='-')
                  ||(mark7_1==='-'&&mark7_2!='-'&&mark7_3==='-')
                  ||(mark7_1==='-'&&mark7_2==='-'&&mark7_3!='-')))
        {
            addstrtip('无机房项目7_1、7_2、7_3矛盾！')
        }
        else
        {
            if(mark2_5_2!='-'){
                addstrtip('无机房与mark2_5_2矛盾！')
            }
            if(mark2_1_11 != '-'&&mark2_1_12 != '-'&&mark2_1_13 !='-'&&mark2_1_14 != '-' )//机房爬梯
            {
                addstrtip('无机房项目7与机房爬梯矛盾！')
            }
            if(mark2_1_31 != '-'&&mark2_1_32!= '-'&&mark2_1_33 !='-')//机房门
            {
                addstrtip('无机房项目7与机房门矛盾！')
            }
            if(mark2_3_3 != '-')//地面高度差
            {
                addstrtip('无机房项目7与机房地面高度差矛盾！')
            }
            if(mark2_7_51 != '-'&&mark2_7_52!= '-'&&mark2_7_53 != '-'&&mark2_7_54 != '-'&&mark2_7_55 != '-')//盘车松闸
            {
                addstrtip('无机房项目7与盘车松闸矛盾！')
            }
            if(mark2_6_11==='-'||mark2_6_13 ==='-')//无机房主开关
            {
                addstrtip('无机房项目7与无机房主开关矛盾！')
            }
            if(mark2_8_51 ==='-'||mark2_8_52 ==='-'||mark2_8_53==='-'||mark2_8_54==='-')//无机房紧急操作及动态测试装置
            {
                addstrtip('无机房项目7与紧急操作及动态测试装置矛盾！')
            }

        }
        //曳引能力验证
        if(mark2_7_32!='-')
        {
            if(mark8_91=='-')
            {
                addstrtip('曳引能力验证项2_7_32与8_9矛盾！')
            }
            if(mark8_101=='-')
            {
                addstrtip('曳引能力验证项2_7_32与8_10矛盾！')
            }
            if(mark8_111=='-')
            {
                addstrtip('曳引能力验证项2_7_32与8_11矛盾！')
            }
        }
        //货梯验证
        if(sbpz==='曳引驱动载货电梯')
        {
            if(gkxiacizhidongshijian!='-'||gkxiacizhidongshijian!='')
            {
                addstrtip('设备品种与下次制动时间矛盾！')
            }
            if(mark6_3_13==='-'&&mark6_3_14==='-'&&mark6_3_15==='-')//货梯没画货梯项目
            {
                addstrtip('设备品种与6_3项矛盾！')
            }
        }
        if(sbpz==='曳引驱动乘客电梯')
        {
            if(gkxiacizhidongshijian==='-'||gkxiacizhidongshijian==='')
            {
                addstrtip('设备品种与下次制动时间矛盾！')
            }
            if(mark6_3_11==='-'&&mark6_3_12==='-'&&mark6_3_15==='-')//客梯没画客梯项目
            {
                addstrtip('设备品种与6_3项矛盾！')
            }
            if(mark6_3_13!='-'||mark6_3_14!='-')//客梯画了货梯项目
            {
                addstrtip('设备品种与6_3项矛盾！')
            }
            if(mark4_6_21!='-'||mark4_6_22!='-'||mark4_6_23!='-')//超面积载货电梯
            {
                addstrtip('设备品种与4_6项矛盾！')
            }
            if(mark8_4_11!='-'||mark8_4_13!='-')//超面积载货电梯
            {
                addstrtip('设备品种与8_4项矛盾！')
            }
            if(mark8_121!='-')//超面积载货电梯静态曳引检查
            {
                addstrtip('设备品种与8_12项矛盾！')
            }
        }

        //验证旁路、门回路检测等新项目
        if(zhizaodate.getTime()>=date20180101.getTime())
        {
            if(mark2_8_61=== '-'&& mark2_8_62=== '-'&&mark2_8_63 === '-'&&mark2_8_64=== '-')
            {
                addstrtip('制造日期与旁路矛盾！')
            }
            if(mark2_8_71 === '-'&&mark2_8_72 === '-')
            {
                addstrtip('制造日期与门回路矛盾！')
            }
            if(mark2_8_8 === '-')
            {
                addstrtip('制造日期与制动器故障保护矛盾！')
            }
        }
        else
        {
            if(mark2_8_61!= '-'|| mark2_8_62!= '-'||mark2_8_63!= '-'||mark2_8_64!= '-')
            {
                addstrtip('制造日期与旁路矛盾！')
            }
            if(mark2_8_71 != '-'||mark2_8_72 != '-')
            {
                addstrtip('制造日期与门回路矛盾！')
            }
            if(mark2_8_8 != '-')
            {
                addstrtip('制造日期与制动器故障保护矛盾！')
            }
        }

        //注意制造日期与轿门机械锁及轿门开门限制是否矛盾
        if(zhizaodate.getTime()<date20171001.getTime())
        {
            if(mark3_75!= '-'|| mark6_9_2!= '-')
            {
                addstrtip('注意制造日期与轿门机械锁是否矛盾！')
            }
            if(mark6_11_1!= '-'|| mark6_11_2!= '-')
            {
                addstrtip('注意制造日期与轿门开门限制是否矛盾！')
            }
        }
        else
        {
            if(mark6_11_1=== '-'|| mark6_11_2=== '-')
            {
                addstrtip('注意制造日期与轿门开门限制是否矛盾！')
            }
        }
        //注意制造日期与轿门机械锁是否矛盾
        if(zhizaodate.getTime()>=date20171001.getTime())
        {
            if(mark3_75=== '-'&& mark6_9_2=== '-'&&mark6_11_1=== '-'&&mark6_11_2=== '-')
            {
                addstrtip('注意制造日期与轿门机械锁、轿门开门限制是否矛盾！')
            }
        }
        if(mark3_75!= '-'&& mark6_9_2!= '-'&&mark6_11_1=== '-'&&mark6_11_2=== '-')
        {
            addstrtip('注意轿门机械锁与轿门开门限制是否矛盾！')
        }
        //验证UCMP
        if(zhizaodate.getTime()>=date20160701.getTime())
        {
            if(zhizaodate.getTime()>=date20171001.getTime())
            {
                if(mark8_3_1=== '-'&& mark8_3_2=== '-')
                {
                    addstrtip('制造日期与UCMP矛盾！')
                }
            }
            else
            {
                if(mark8_3_1=== '-'&& mark8_3_2=== '-')

                {addstrtip('注意制造日期与UCMP是否矛盾！')}
            }
        }
        else
        {
            if(mark8_3_1!= '-'|| mark8_3_2!= '-')
            {
                addstrtip('注意制造日期与UCMP是否矛盾！')
            }
        }
        //验证UCMP与轿门开门限制
        if(mark8_3_1=== '-'&& mark8_3_2=== '-'&&mark6_11_2!= '-')
        {
            addstrtip('UCMP与轿门开门限制矛盾！')
        }
        //验证UCMP与蜗轮蜗杆驱动主机的关系
        if(mark8_3_1!= '-'&& mark8_3_2=== '-')
        {
            addstrtip('注意UCMP与蜗轮蜗杆驱动主机的关系！')
        }

        //验证额定速度与缓冲器类型
        if(floatedinsudu>1.0&&mark3_15_4==='-')
        {
            addstrtip('额定速度与缓冲器类型不匹配！')
        }
        //验证额定速度与补偿绳的关系
        if(floatedinsudu>3.5&&mark5_3_31==='-'&&mark5_3_32==='-')
        {
            addstrtip('额定速度与补偿绳防跳绳不匹配！')
        }
        //注意提升高度与轿厢机房对讲系统是否匹配
        if(parseFloat(gkcengshu)>=10&&mark4_8_22==='-')
        {
            addstrtip('注意提升高度与轿厢机房对讲系统是否匹配！')
        }
        if(parseFloat(gkcengshu)<10&&mark4_8_22!='-')
        {
            addstrtip('注意提升高度与轿厢机房对讲系统是否匹配！')
        }

        //验证使用登记证编号
        if(gkshiyongdengji.length!=20&&gkshiyongdengji.length!=14)
        {
            if(gkshiyongdengji.trim()!='-')
            {
                addstrtip('使用登记证编号位数错误！')
            }

        }
        else
        {
            if(gkshiyongdengji.length===20)
            {
                yanzhengshiyongdengjihaoold(gkshiyongdengji)
            }
            if(gkshiyongdengji.length===14)
            {
                yanzhengshiyongdengjihaonew(gkshiyongdengji)
            }
        }

        if ((mark1_1 === '×'||mark1_2 === '×'||mark1_3 === '×'||mark1_4 === '×'
             ||mark2_1 === '×'||mark2_2 === '×'||mark2_3 === '×'||mark2_4 === '×'||mark2_5 === '×'
             ||mark2_6 === '×'||mark2_7 === '×'||mark2_8 === '×'||mark2_9 === '×'||mark2_10 === '×'||mark2_11 === '×'||mark2_12 === '×'||mark2_13 === '×'
             ||mark3_1 === '×'||mark3_2 === '×'||mark3_3 === '×'||mark3_4 === '×'||mark3_5 === '×'||mark3_6 === '×'
             ||mark3_7 === '×'||mark3_8 === '×'||mark3_9 === '×'||mark3_10 === '×'||mark3_11 === '×'||mark3_12 === '×'
             ||mark3_13 === '×'||mark3_14 === '×'||mark3_15 === '×'||mark3_16 === '×'
             ||mark4_1=== '×'||mark4_2 === '×'||mark4_3 === '×'||mark4_4=== '×'||mark4_5 === '×'||mark4_6 === '×'||mark4_7=== '×'||mark4_8 === '×'||mark4_9=== '×'
             ||mark4_10=== '×'||mark4_11 === '×'
             ||mark5_1 === '×'||mark5_2 === '×'||mark5_3 === '×'
             ||mark5_4 === '×'||mark5_5 === '×'||mark5_6 === '×'
             ||mark6_1 === '×'||mark6_2 === '×'||mark6_3 === '×'
             ||mark6_4 === '×'||mark6_5 === '×'||mark6_6 === '×'
             ||mark6_7 === '×'||mark6_8 === '×'||mark6_9_1j === '×'
             ||mark6_9_14j === '×'||mark6_9_2j === '×'
             ||mark6_10 === '×'||mark6_11 === '×'||mark6_12 === '×'
             ||mark7_1 === '×'||mark7_2 === '×'||mark7_3 === '×'||mark7_4 === '×'
             ||mark8_1 === '×'||mark8_2 === '×'
             ||mark8_3 === '×'||mark8_4 === '×'||mark8_5 === '×'
             ||mark8_6 === '×'||mark8_7 === '×'||mark8_8 === '×'||mark8_9 === '×'
             ||mark8_10 === '×'||mark8_11_ === '×'||mark8_12_ === '×'
             ||mark8_13 === '×'
            ) &&(jljianyanjielun==='合格'||jljianyanjielun==='复检合格') ||
            (mark1_1 != '×'||mark1_2 != '×'||mark1_3 != '×'||mark1_4 != '×'
             ||mark2_1 != '×'||mark2_2 != '×'||mark2_3 != '×'||mark2_4 != '×'||mark2_5 != '×'
             ||mark2_6 != '×'||mark2_7 != '×'||mark2_8 != '×'||mark2_9 != '×'||mark2_10 != '×'||mark2_11 != '×'||mark2_12 != '×'||mark2_13 != '×'
             ||mark3_1 != '×'||mark3_2 != '×'||mark3_3 != '×'||mark3_4 != '×'||mark3_5 != '×'||mark3_6 != '×'
             ||mark3_7 != '×'||mark3_8 != '×'||mark3_9 != '×'||mark3_10 != '×'||mark3_11 != '×'||mark3_12 != '×'
             ||mark3_13 != '×'||mark3_14 != '×'||mark3_15 != '×'||mark3_16 != '×'
             ||mark4_1!= '×'||mark4_2 != '×'||mark4_3 != '×'||mark4_4!= '×'||mark4_5 != '×'||mark4_6 != '×'||mark4_7!= '×'||mark4_8 != '×'||mark4_9!= '×'
             ||mark4_10!= '×'||mark4_11 != '×'
             ||mark5_1 != '×'||mark5_2 != '×'||mark5_3 != '×'
             ||mark5_4 != '×'||mark5_5 != '×'||mark5_6 != '×'
             ||mark6_1 != '×'||mark6_2 != '×'||mark6_3 != '×'
             ||mark6_4 != '×'||mark6_5 != '×'||mark6_6 != '×'
             ||mark6_7 != '×'||mark6_8 != '×'||mark6_9_1j != '×'
             ||mark6_9_14j != '×'||mark6_9_2j != '×'
             ||mark6_10 != '×'||mark6_11 != '×'||mark6_12 != '×'
             ||mark7_1 != '×'||mark7_2 != '×'||mark7_3 != '×'||mark7_4 != '×'
             ||mark8_1 != '×'||mark8_2 != '×'
             ||mark8_3 != '×'||mark8_4 != '×'||mark8_5 != '×'
             ||mark8_6 != '×'||mark8_7 != '×'||mark8_8 != '×'||mark8_9 != '×'
             ||mark8_10 != '×'||mark8_11_ != '×'||mark8_12_ != '×'
             ||mark8_13 != '×'
            ) && (jljianyanjielun==='不合格'||jljianyanjielun==='复检不合格'))
        {
            addstrtip('结论有误！')
            //highlightedFields.push(document.getElementById('16226362466730b57'), document.getElementById('162260294680410f0'))
        }
        //检验结论与检验日期是否矛盾
        if((jljianyanjielun==='不合格'||jljianyanjielun==='复检不合格')&&gkxiacijianyanriqi!='')
        {
            addstrtip('下次检验日期与检验结论矛盾！')
        }

        if(jljianyanjielun==='不合格'||jljianyanjielun==='复检不合格')
        {
            var errxiang='如下不合格项：\n'
            fenxiangmap.forEach(function(value,key){
                if(value==='×')
                {
                    errxiang=errxiang.concat("        ")
                    errxiang=errxiang.concat(key)
                    errxiang=errxiang.concat("\n")
                }
            });

            errxiang=errxiang.concat("       需在附表列出。")
            addstrtip(errxiang)
        }
        if((jljianyanjielun==='合格'||jljianyanjielun==='复检合格')&&gkxiacijianyanriqi==='')
        {
            addstrtip('下次检验日期与检验结论矛盾！')
        }
        //概况信息
        if(gkshiyongdengji.length===20)
        {
            if(gkshiyongdengji.substr(0,4)!=sbfenleimap.get('曳引式货梯')
               &&gkshiyongdengji.substr(0,4)!=sbfenleimap.get('无机房货梯')
               &&sbpz==='曳引驱动载货电梯')
            {
                addstrtip('使用登记证编号与概况中设备品种不一致！')
            }
            if(gkshiyongdengji.substr(0,4)!=sbfenleimap.get('曳引式客梯')
               &&gkshiyongdengji.substr(0,4)!=sbfenleimap.get('无机房客梯')
               &&gkshiyongdengji.substr(0,4)!=sbfenleimap.get('观光客梯')
               &&gkshiyongdengji.substr(0,4)!=sbfenleimap.get('病床客梯')
               &&sbpz==='曳引驱动乘客电梯')
            {
                addstrtip('使用登记证编号与概况中设备品种不一致！')
            }
            if(gkshiyongdengji.substr(0,4)===sbfenleimap.get('观光客梯'))
            {
                if(mark6_41==='-')
                {
                    addstrtip('注意mark6_41是否需要勾选玻璃门防止拖曳！')
                }
            }
            if((gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('兴庆区'))
               &&(gkshiyongdanweidizhi.search('兴庆区')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('西夏区'))
               &&(gkshiyongdanweidizhi.search('西夏区')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('金凤区'))
               &&(gkshiyongdanweidizhi.search('金凤区')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('永宁县'))
               &&(gkshiyongdanweidizhi.search('永宁县')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('贺兰县'))
               &&(gkshiyongdanweidizhi.search('贺兰县')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('灵武市'))
               &&(gkshiyongdanweidizhi.search('灵武市')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('石嘴山市'))
               &&(gkshiyongdanweidizhi.search('石嘴山市')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('大武口区'))
               &&(gkshiyongdanweidizhi.search('大武口区')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('惠农区'))
               &&(gkshiyongdanweidizhi.search('惠农区')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('平罗县'))
               &&(gkshiyongdanweidizhi.search('平罗县')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('利通区'))
               &&(gkshiyongdanweidizhi.search('利通区')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('红寺堡区'))
               &&(gkshiyongdanweidizhi.search('红寺堡区')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('盐池县'))
               &&(gkshiyongdanweidizhi.search('盐池县')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('同心县'))
               &&(gkshiyongdanweidizhi.search('同心县')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('青铜峡市'))
               &&(gkshiyongdanweidizhi.search('青铜峡市')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('原州区'))
               &&(gkshiyongdanweidizhi.search('原州区')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('西吉县'))
               &&(gkshiyongdanweidizhi.search('西吉县')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('隆德县'))
               &&(gkshiyongdanweidizhi.search('隆德县')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('泾源县'))
               &&(gkshiyongdanweidizhi.search('泾源县')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('彭阳县'))
               &&(gkshiyongdanweidizhi.search('彭阳县')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('沙坡头区'))
               &&(gkshiyongdanweidizhi.search('沙坡头区')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('中宁县'))
               &&(gkshiyongdanweidizhi.search('中宁县')!=-1)
               ||(gkshiyongdengji.substr(4,6)!=xingzhenqvhuamap.get('海原县'))
               &&(gkshiyongdanweidizhi.search('海原县')!=-1)
              )
            {
                addstrtip('使用登记证编号与概况中使用单位地址不一致！')
            }

            var dengjiriqi=gkshiyongdengji.substr(10,4)+'-'
            dengjiriqi=dengjiriqi+gkshiyongdengji.substr(14,2)
            dengjiriqi=dengjiriqi+'-01'
            var dengjiriqidate=StringToDate(dengjiriqi)
            if(!(dengjiriqidate.getTime()>=zhizaodate.getTime()&&parseInt(gkshiyongdengji.substr(10,4))<2018 ))
            {
                addstrtip('使用登记证编号与概况中监督检验日期矛盾，且不应大于2018年！')
            }
        }
        if(gkshiyongdengji.length===14)
        {
            if(gkshiyongdengji.substr(0,1)!=sbtezhengshebeijianchengmap.get('电梯'))
            {
                addstrtip('使用登记证编号与概况中设备类别不一致！')
            }
            if(gkshiyongdengji.substr(1,2)!=sbtezhengdaihaomap.get('曳引驱动载货电梯')
               &&sbpz==='曳引驱动载货电梯')
            {
                addstrtip('使用登记证编号与概况中设备品种不一致！')
            }
            if(gkshiyongdengji.substr(1,2)!=sbtezhengdaihaomap.get('曳引驱动乘客电梯')
               &&sbpz==='曳引驱动乘客电梯')
            {
                addstrtip('使用登记证编号与概况中设备品种不一致！')
            }

            if((gkshiyongdengji.substr(4,1)!=sheqvshizimudaihaomap.get('银川市'))
               &&(gkshiyongdanweidizhi.search('银川市')!=-1)
               ||(gkshiyongdengji.substr(4,1)!=sheqvshizimudaihaomap.get('石嘴山市'))
               &&(gkshiyongdanweidizhi.search('石嘴山市')!=-1)
               ||(gkshiyongdengji.substr(4,1)!=sheqvshizimudaihaomap.get('吴忠市'))
               &&(gkshiyongdanweidizhi.search('吴忠市')!=-1)
               ||(gkshiyongdengji.substr(4,1)!=sheqvshizimudaihaomap.get('固原市'))
               &&(gkshiyongdanweidizhi.search('固原市')!=-1)
               ||(gkshiyongdengji.substr(4,1)!=sheqvshizimudaihaomap.get('中卫市'))
               &&(gkshiyongdanweidizhi.search('中卫市')!=-1))
            {
                addstrtip('使用登记证编号与使用单位地址不一致！')
            }
            if(!(gkshiyongdanweidizhi.search('银川市')||gkshiyongdanweidizhi.search('石嘴山市')||gkshiyongdanweidizhi.search('吴忠市')||gkshiyongdanweidizhi.search('固原市')||gkshiyongdanweidizhi.search('中卫市')))
            {
                addstrtip('使用单位地址应包含XX市！')
            }

            var cur =parseInt(curyear.toString().substr(2,2))
            var jianduyear =parseInt(zhizaodate.getFullYear().toString().substr(2,2))
            var dengjiyear=parseInt(gkshiyongdengji.substr(11,2))
            if(!(dengjiyear<=cur&&dengjiyear>=jianduyear))
            {
                addstrtip('使用登记证号登记年份与监督检验年份矛盾，且不能超过当前日期！')
            }

        }
        //概况信息


        //显示提示信息
        if(strtip.trim()==='')
        {
            strtip='未发现问题'
        }

        input.value=strtip+'\n\n'+strinput
        strtip=''
        strinput=''
        tipnum=0
        //highlightFileds()

        //验证使用登记证号
        function yanzhengshiyongdengjihaonew(gkshiyongdengji)
        {
            var tezhenghao1right=false
            sbtezhengshebeijianchengmap.forEach(function(value,key){
                if(value===gkshiyongdengji.substr(0,1))
                {
                    tezhenghao1right=true
                }
            });
            if(!tezhenghao1right)
            {
                addstrtip('注意使用登记证号中特种设备简称是否合理！')
            }

            var tezhenghao2right=false
            sbtezhengdaihaomap.forEach(function(value,key){
                if(value===gkshiyongdengji.substr(1,2))
                {
                    tezhenghao2right=true
                }
            });
            if(!tezhenghao2right)
            {
                addstrtip('注意使用登记证号中特种设备品种号是否合理！')
            }

            if(gkshiyongdengji.substr(3,1)!='宁')
            {
                addstrtip('注意使用登记证号中省级代号是否合理！')
            }
            var sheqvshidaihaoright=false
            sheqvshizimudaihaomap.forEach(function(value,key){
                if(value===gkshiyongdengji.substr(4,1))
                {
                    sheqvshidaihaoright=true
                }
            });
            if(!sheqvshidaihaoright)
            {
                addstrtip('注意使用登记证号中设区的市代号是否合理！')
            }
            //设备使用地址是否合理

            if(gkshiyongdengji.substr(10,1)!='('||gkshiyongdengji.substr(13,1)!=')')
            {
                addstrtip('注意使用登记证号括号为半角格式！')
            }

            //if(!isNaN(Number(gkshiyongdengji.substr(11,2))))
            if(isNormalInteger(gkshiyongdengji.substr(11,2)))
            {
                var cur =parseInt(curyear.toString().substr(2,2))


                if(parseInt(gkshiyongdengji.substr(11,2))>cur||parseInt(gkshiyongdengji.substr(11,2))<parseInt(zhizaodate.getFullYear().toString().substr(2,2)))
                {

                    addstrtip('注意使用登记证号登记年份是否合理！')
                }
            }

        }
        function yanzhengshiyongdengjihaoold(gkshiyongdengji)
        {
            var sbflright=false
            sbfenleimap.forEach(function(value,key){
                if(value===gkshiyongdengji.substr(0,4))
                {
                    sbflright=true
                }
            });
            if(!sbflright)
            {
                addstrtip('注意使用登记证号设备分类码是否合理！')
            }

            var xzqhright=false
            xingzhenqvhuamap.forEach(function(value,key){
                if(value===gkshiyongdengji.substr(4,6))
                {
                    xzqhright=true
                }
            });
            if(!xzqhright)
            {
                addstrtip('注意使用登记证号行政区划代码是否合理！')
            }

            var nianyueright=false
            if(isNormalInteger(gkshiyongdengji.substr(10,6)))
            {
                if(parseInt(gkshiyongdengji.substr(10,4))>=zhizaodate.getFullYear()&&parseInt(gkshiyongdengji.substr(10,4))<2018
                   &&parseInt(gkshiyongdengji.substr(14,2))>0&&parseInt(gkshiyongdengji.substr(14,2))<=12)
                {
                    nianyueright=true
                }
            }
            if(!nianyueright)
            {
                addstrtip('注意使用登记证号注册年份码是否合理！')
            }


            if(isNaN(Number(gkshiyongdengji.substr(16,4)))){

                addstrtip('注意使用登记证号顺序码是否合理！')

            }
        }


    }

    var highlightedFields = []
    // 高亮错误的内容
    function highlightFileds() {
        if (!highlightedFields.length) {
            addstrtip('校验通过！')
            return
        }
        highlightedFields.forEach(element => {
            element.style.backgroundColor = 'yellow'
        })
    }
    // 清除高亮内容
    function resetHilightFields() {
        highlightedFields.forEach(element => {
            element.style.backgroundColor = 'unset'
        })
        highlightedFields.length = 0
    }

    // 获取封面对应值
    function getCoverFieldValueByLabel(label) {
        var labelEl = Array.from(document.getElementsByTagName('span')).find(el => el.textContent === label)
        var widgetFieldEl = labelEl.parentElement
        while (!widgetFieldEl.classList.contains('widget-field')) {
            widgetFieldEl = widgetFieldEl.parentElement
        }
        return [widgetFieldEl.nextElementSibling, widgetFieldEl.nextElementSibling.textContent.trim()]
    }
    // 获取表格对应值
    function getTableFieldValueByLabel(label) {
        var labelEl = Array.from(document.getElementsByTagName('td')).find(el => el.textContent.trim() === label)
        return [labelEl.nextElementSibling, labelEl.nextElementSibling.textContent.trim()]
    }
    function StringToDate(str)
    {
        var strDate = str.split(" ");

        var strDatepart = strDate[0].split("-");

        var dtDate = new Date(strDatepart[0],strDatepart[1]-1,strDatepart[2]);

        return dtDate;
    }
    function YearMonthToYearMonthDay(str)
    {
        if(str.length===7)
        {str=str.concat('-01')}
        return str.trim();
    }
    function addstrtip(str)
    {
        strtip=strtip.concat("\n")
        tipnum=tipnum+1
        strtip=strtip.concat(tipnum.toString())
        strtip=strtip.concat('、')
        strtip=strtip.concat(str)
    }
    function isNormalInteger(str) {

        var n = Math.floor(Number(str));

        return n !== Infinity && String(n) === str && n >= 0;

    }


})();
