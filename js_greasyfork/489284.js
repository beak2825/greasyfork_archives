// ==UserScript==
// @name         天神之眼（直梯定期旧版）
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  you can use it for your report
// @author       You
// @match        http://111.51.123.233:8088/stj-web/index/inspect/report/toReportInput.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=123.233
// @grant        none
// ==/UserScript==


(function () {
    'use strict';
    var div = document.createElement('button');
    div.innerText = "??????";
    Object.assign(div.style, {
        position: 'fixed',
        right: '50px',
        bottom: '100px',
        fontSize: '6px',
        zIndex: 0,
        borderRadius: '35%',
        backgroundColor: 'yellow',
        padding: '8px',
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
        right: '1200px',
        bottom: '100px',
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
    var strreport='报告模板：\n'



    function main() {

        strreport=strreport+'1. NTD11202323011 新客梯 隆光物业 有机房 有爬梯 有盘车松闸 有紧急电动 无轿门锁 有轿门开门限制 耗能型 钢丝绳 有补偿 中分门 重锤 永磁同步 无IC卡 无制动 12层\n'
        strreport=strreport+'2. NTD11202323335 新客梯 天下鲜联锁超市 无机房 有紧急电动 有轿门锁 有轿门开门限制 蓄能型 钢丝绳 无补偿 中分门 重锤 永磁同步 无IC卡 无制动 2层\n'
        strreport=strreport+'5. NTD11202322844 旧货梯 宁夏回族自治区第三人民医院 有机房 无爬梯 有盘车松闸 有紧急电动 无轿门锁 无轿门开门限制 耗能型 钢丝绳 有补偿 旁开门 弹簧 无UCMP 无IC卡 无制动 10层\n'
        strreport=strreport+'6. NTD11202325338 旧客梯 银川市体育中心 无机房 无爬梯 无盘车松闸 无紧急电动 无轿门锁 无轿门开门限制 蓄能型 钢带 无补偿 中分门 重锤 无UCMP 无IC卡 有制动 3层\n'
        strreport=strreport+'7. NTD11202329090 旧客梯 有机房 6层\n'
        strreport=strreport+'8. NTD11202329090 新货梯 有机房 \n'
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
        // 校验符号

        var checkMark3_7 = document.getElementById('162263349436649ed').textContent.trim().slice(-1)
        var checkMark6_9 = document.getElementById('1622638663794bf17').textContent.trim().slice(-1)
        if (checkMark3_7 !== checkMark6_9) {
            addstrtip('检验3.7和6.9对应有误！')

            //highlightedFields.push(document.getElementById('162263349436649ed'), document.getElementById('1622638663794bf17'))
        }



        // 校验结论

        //封面
        /*var guanlirenyuanW = document.getElementById('1581261202417784a')
        guanlirenyuanW.innerHTML = "kk55kk"
        //guanlirenyuanW.autocomplete = "off"
        guanlirenyuanW.contentEditable = true;
        guanlirenyuanW.style.display = ''*/
        var username = document.getElementById('1581261202417784a').innerText.trim()
        if(!/^[\u4e00-\u9fa5\(\)\（\）]{1,39}$/g.test(username))
        {
            addstrtip('注意封面使用单位名称！')
        }
        var sbdm = document.getElementById('163161563930693f9').textContent.trim().slice(4)
        if(!/^(-|[0-9a-z]{20})$/g.test(sbdm))
        {
            addstrtip('注意封面设备代码！')
        }
        var sblb = document.getElementById('15812612661633124').textContent.trim().slice(12)
        if(!/^曳引与强制驱动电梯$/g.test(sblb)){
            addstrtip('注意封面设备类别！')
        }

        var sbpz = document.getElementById('15812612904775e8a').textContent.trim().slice(6)
        if(!/^(曳引驱动乘客电梯|曳引驱动载货电梯)$/.test(sbpz))
        {
            addstrtip('注意封面设备品种！')
        }
        var jyrq = document.getElementById('164489167765082b4').textContent.trim().slice(4).replace(/年|月|日/g, '-').slice(0, -1)//封面检验日期
        jyrq=YearMonthToYearMonthDay(jyrq)
        if(!ZifuchuanIsDate(jyrq))
        {
            addstrtip('封面检验日期格式错误！')
        }


        //仪器
        var yqwanyong1 = document.getElementById('16225989609296d4').textContent.trim().slice(-1)
        var yqwanyong2 = document.getElementById('16225989609292ee').textContent.trim().slice(-1)
        var yqqianxing1 = document.getElementById('1622598960929825').textContent.trim().slice(-1)
        var yqqianxing2 = document.getElementById('1622598960929dcd').textContent.trim().slice(-1)
        var yqyoubiao1 = document.getElementById('1622598960930ba1').textContent.trim().slice(-1)
        var yqyoubiao2 = document.getElementById('1622598960930fc7').textContent.trim().slice(-1)
        var yqgangzhi1 = document.getElementById('1622598960930c1d').textContent.trim().slice(-1)
        var yqgangzhi2 = document.getElementById('162259896093082e').textContent.trim().slice(-1)

        var yqgangjuan1 = document.getElementById('1622598960930078').textContent.trim().slice(-1)
        var yqgangjuan2 = document.getElementById('1622598960930b0d').textContent.trim().slice(-1)
        var yqsaichi1 = document.getElementById('1622598960930cd0').textContent.trim().slice(-1)
        var yqsaichi2 = document.getElementById('1622598960930710').textContent.trim().slice(-1)
        var yqcili1 = document.getElementById('16225989609307a8').textContent.trim().slice(-1)
        var yqcili2 = document.getElementById('162259896093063f').textContent.trim().slice(-1)
        var yqchangyong1 = document.getElementById('162259896093043b').textContent.trim().slice(-1)
        var yqchangyong2 = document.getElementById('1622598960930056').textContent.trim().slice(-1)

        var yqzhaodu1 = document.getElementById('16225989609309e4').textContent.trim().slice(-1)
        var yqzhaodu2 = document.getElementById('1622598960930c7d').textContent.trim().slice(-1)
        var yqjishi1 = document.getElementById('16225989609307e8').textContent.trim().slice(-1)
        var yqjishi2 = document.getElementById('1622598960930ced').textContent.trim().slice(-1)
        var yqceli1 = document.getElementById('1622598960930045').textContent.trim().slice(-1)
        var yqceli2 = document.getElementById('1622598960930a03').textContent.trim().slice(-1)
        var yqbianxiedeng1 = document.getElementById('1622598960930fd4').textContent.trim().slice(-1)
        var yqbianxiedeng2 = document.getElementById('16225989609308bc').textContent.trim().slice(-1)

        var yqdaogui1 = document.getElementById('1622598960930e90').textContent.trim().slice(-1)
        var yqdaodui2 = document.getElementById('16225989609309ae').textContent.trim().slice(-1)
        var yqbianxietan1 = document.getElementById('162259896093026b').textContent.trim().slice(-1)
        var yqbianxietan2 = document.getElementById('1622598960930eca').textContent.trim().slice(-1)
        var yqfama1 = document.getElementById('1622598960930d03').textContent.trim().slice(-1)
        var yqfama2 = document.getElementById('1622598960930a6f').textContent.trim().slice(-1)
        var yqjueyuan1 = document.getElementById('162259896093080e').textContent.trim().slice(14)
        var yqjueyuan2 = document.getElementById('1622598960930d0b').textContent.trim().slice(5)
        if(yqjueyuan1[0]==='-'||yqjueyuan2==='-')
        {
            addstrtip('应勾选绝缘电阻测试仪986456！')
        }

        var yqjiedi1 = document.getElementById('16225989609317e3').textContent.trim().slice(-1)
        var yqjiedi2 = document.getElementById('162259896093167e').textContent.trim().slice(-1)
        var yqshengji1 = document.getElementById('16225989609319b5').textContent.trim().slice(-1)
        var yqshengji2 = document.getElementById('1622598960931038').textContent.trim().slice(-1)
        var yqjiasu1 = document.getElementById('16225989609316ea').textContent.trim().slice(-1)
        var yqjiasu2 = document.getElementById('16460339482180a54').textContent.trim().slice(-1)
        var yqwengshi1 = document.getElementById('16457724618037a52').innerText
        var yqwengshi2 = document.getElementById('16457725202218512').innerText
        if(yqwengshi1[0]==='-'||yqwengshi2.trim()==='-')
        {
            addstrtip('应勾选温湿度计39258856！')
        }

        var yqzhuansu1 = document.getElementById('1676366333158646c').textContent.trim().slice(-1)
        var yqzhuansu2 = document.getElementById('1676361947114369f').textContent.trim().slice(-1)

        //现场条件
        var tj11 = document.getElementById('16225995547132ea').textContent.trim().slice(-1)
        var tj12 = document.getElementById('16225995547139e2').textContent.trim().slice(-1)
        var tj21 = document.getElementById('162259955471356a').textContent.trim().slice(-1)
        var tj22 = document.getElementById('162259955471398a').textContent.trim().slice(-1)
        var tj31 = document.getElementById('16225995547136ff').textContent.trim().slice(-1)
        var tj32 = document.getElementById('162259955471358d').textContent.trim().slice(-1)
        var tj41 = document.getElementById('16225995547137d0').textContent.trim().slice(-1)
        var tj42 = document.getElementById('1622599554713747').textContent.trim().slice(-1)
        var tj51 = document.getElementById('1622599554713ebf').textContent.trim().slice(-1)
        var tj52 = document.getElementById('16225995547131d1').textContent.trim().slice(-1)


        //现场检验条件记录验证
        if(tj11!='√'||tj21!='√'||tj31!='√'||tj41!='√'||tj51!='√'
           ||tj12!='-'||tj22!='-'||tj32!='-'||tj42!='-'||tj52!='-')
        {
            addstrtip('注意现场检验条件是否确认，填写是否合理！')
        }
        //test.innerText



        //检验人员
        var jyrengyuan = document.getElementById('16402458366618a26').textContent.trim()
        var jyrengyuanriqi = document.getElementById('162260037386945ee').textContent.trim().slice(4).replace(/年|月|日/g, '-').slice(0, -1)//检验人员日期
        jyrengyuanriqi=YearMonthToYearMonthDay(jyrengyuanriqi)
        if(!ZifuchuanIsDate(jyrengyuanriqi))
        {
            addstrtip('检验人员日期格式错误！')
        }

        //受检人员
        var shoujianren = document.getElementById('1622600840004ef13').textContent.trim().slice(-1)
        var shoujianrenriqi = document.getElementById('16226008621676f33').textContent.trim().slice(6).replace(/年|月|日/g, '-').slice(0, -1)//受检单位签字日期
        shoujianrenriqi=YearMonthToYearMonthDay(shoujianrenriqi)
        if(!ZifuchuanIsDate(shoujianrenriqi))
        {
            addstrtip('受检单位签字日期格式错误！')
        }
        //设备概况
        var gkshiyongdengji = document.getElementById('16226021696426b07').innerText.trim()//使用登记证编号
        if(!/^([0-9a-z]{20}|梯11宁A\d{5}[\(\（]{1}\d{2}[\)\）]{1})$/g.test(gkshiyongdengji)){
            addstrtip('使用登记证编号！')
        }
        //31106401052014080025
        var gkshebeipingzhong = document.getElementById('16226021967280ab8').textContent.trim().slice(6)//设备品种
        if(gkshebeipingzhong!=sbpz)
        {
            addstrtip('注意封面与概况中设备品种是否一致！')
        }
        var gkxinghao = document.getElementById('16226022107117a57').innerText.trim()//型号
        if(!/^[a-zA-Z0-9\s-]+$/gi.test(gkxinghao)){
            addstrtip('注意型号！')
        }
        var gkchanpingbianhao = document.getElementById('1622602220085cf72').textContent.trim().slice(10)//产品编号
        if(!/^[a-z0-9\s\-]+$/gi.test(gkchanpingbianhao)){
            addstrtip('注意产品编号！')
        }
        var gkzhizaoriqi = document.getElementById('1631667654895f413').textContent.trim().slice(4).replace(/年|月|日/g, '-').slice(0, -1)//制造日期
        gkzhizaoriqi=YearMonthToYearMonthDay(gkzhizaoriqi)
        if(!ZifuchuanIsDate(gkzhizaoriqi))
        {
            addstrtip('制造日期格式错误！')
        }

        var gkzhizaodanwei = document.getElementById('16226022353839ab9').textContent.trim().slice(4)//制造单位名称
        if(!/^[\u4e00-\u9fa5]{1,39}$/g.test(gkzhizaodanwei)){
            addstrtip('注意制造单位名称！')
        }

        var gkweibaodanwei = document.getElementById('1631667624566697b').textContent.trim().slice(6)//维护保养单位名称
        if(!/^[\u4e00-\u9fa5]{1,39}$/g.test(gkweibaodanwei)){
            addstrtip('注意维护保养单位名称！')
        }
        var gkgaizaodanwei = document.getElementById('1622602275031aea2').textContent.trim().slice(6)//改造单位名称
        if(!/^(-|[\u4e00-\u9fa5]{1,39})$/g.test(gkgaizaodanwei)){
            addstrtip('注意改造单位名称！')
        }
        var gkshiyongdanweidaima = document.getElementById('1622602340351dedb').textContent.trim().slice(10)//使用单位代码
        if(!/^-$/g.test(gkshiyongdanweidaima)){
            addstrtip('注意使用单位代码！')
        }

        var gkgaizaoriqi1str = document.getElementById('1622599554714157').innerText//改造日期原始字符串
        var gkgaizaoriqi1 = document.getElementById('1622599554714157').innerText.replace(/年|月|日/g, '-').slice(0, -1)//改造日期
        var gkgaizaoriqi=YearMonthToYearMonthDay(gkgaizaoriqi1)
        if(gkgaizaoriqi1str.trim()!='-')
        {
            if(!ZifuchuanIsDate(gkgaizaoriqi))
            {
                addstrtip('改造日期格式错误！')
            }
            if(gkgaizaodanwei==='-')
            {
                addstrtip('注意是否改造！')
            }
        }
        else
        {
            if(gkgaizaodanwei!='-')
            {
                addstrtip('注意是否改造！')
            }
        }
 //alert('hello999')

        var gkshiyongdanweidizhi = document.getElementById('1622602356990bfa5').textContent.trim().slice(6)//使用单位地址
        if(gkshiyongdanweidizhi.trim()==='')
        {
            addstrtip('注意使用单位地址！')
        }

        var gkanquangaunli = document.getElementById('1622602385173feff').textContent.trim().slice(6)//安全管理人员
        if(!/^[\u4e00-\u9fa5]{2,4}$/g.test(gkanquangaunli)){
            addstrtip('注意安全管理人员！')
        }

        /* var phone = document.getElementById('1622602393275ca14')//安全管理人员电话

        phone.innerText='18709686159'
        phone.disable=true*/
        var gkanquanguanlidianhua = document.getElementById('1622602393275ca14').textContent.trim().slice(10)//安全管理人员电话
        if(!/^(1[3-9]\d{9}|\d{4}-?\d{7})$/g.test(gkanquanguanlidianhua)){
           addstrtip('安全管理人员电话不正确！')
        }
//         var dianhuaright=false
//         if(gkanquanguanlidianhua.length===11|| (gkanquanguanlidianhua.length===12&&(gkanquanguanlidianhua.search('-')!=-1)))
//         {
//             var ssgkanquanguanlidianhua=gkanquanguanlidianhua.replace('-','')
//             if(isNormalInteger(ssgkanquanguanlidianhua))
//             {
//                 dianhuaright=true
//             }
//         }
//         if(!dianhuaright)
//         {
//             addstrtip('安全管理人员电话不正确！')
//         }
        var gkxiacijianyanriqistr = document.getElementById('1622602611221f030').textContent.trim().slice(18)
        var gkxiacijianyanriqi = document.getElementById('1622602611221f030').textContent.trim().slice(18).replace(/年|月|日/g, '-').slice(0, -1)//下次检验日期
        gkxiacijianyanriqi=YearMonthToYearMonthDay(gkxiacijianyanriqi)
        if(!ZifuchuanIsDate(gkxiacijianyanriqi))
        {
            addstrtip('下次检验日期格式错误！')
        }

//alert('hello990')
        var gkxiansuqixiaciriqistr = document.getElementById('1622602622822e6cc').textContent.trim().slice(9)
        var gkxiansuqixiaciriqi = document.getElementById('1622602622822e6cc').textContent.trim().slice(9).replace(/年|月|日/g, '-').slice(0, -1)//限速器下次校验时间
        gkxiansuqixiaciriqi=YearMonthToYearMonthDay(gkxiansuqixiaciriqi)
        if(!ZifuchuanIsDate(gkxiansuqixiaciriqi))
        {
            addstrtip('限速器下次校验时间格式错误！')
        }


        var gkxiacizhidongshijianstr = document.getElementById('162260263735523e7').textContent.trim().slice(8)
        var gkxiacizhidongshijian = document.getElementById('162260263735523e7').textContent.trim().slice(8).replace(/年|月|日/g, '-').slice(0, -1)//下次制动试验时间  2020年8月5日   2020-8-5-  提取出2020-8-5
        gkxiacizhidongshijian=YearMonthToYearMonthDay(gkxiacizhidongshijian)
        if(sbpz==='曳引驱动乘客电梯')
        {
            if(!ZifuchuanIsDate(gkxiacizhidongshijian))
            {
                addstrtip('下次制动试验时间格式错误！')
            }
        }
        else
        {
            if(!(gkxiacizhidongshijianstr===''||gkxiacizhidongshijianstr==='-'))
            {
                addstrtip('货梯应无下次制动试验时间！')
            }
        }

//alert('hello9901')
        //var gkduizhongkuai = document.getElementById('1622601269543092').textContent.trim().slice(8)//对重块数量或高度
        var gkduizhongkuai = document.getElementById('1622601269543092').innerText.trim()//对重块数量或高度
        //alert(gkduizhongkuai)
        if(!/^[1-9]\d{0,3}(块|厘米|cm|毫米|mm)$/gi.test(gkduizhongkuai)){
            addstrtip('注意对重块数量或高度填写是否正确！')
        }
//         var dzright=false
//         if(gkduizhongkuai.search('块')!=-1)
//         {
//             var kuaishu=gkduizhongkuai.substr(0,gkduizhongkuai.search('块')).trim()
//             if(isNormalInteger(kuaishu)&&gkduizhongkuai.length===(gkduizhongkuai.search('块')+1))
//             {
//                 dzright=true
//             }
//         }
//         else if(gkduizhongkuai.search('mm')!=-1)
//         {
//             kuaishu=gkduizhongkuai.substr(0,gkduizhongkuai.search('mm')).trim()
//             if(isNormalInteger(kuaishu)&&gkduizhongkuai.length===(gkduizhongkuai.search('mm')+2))
//             {
//                 dzright=true
//             }
//         }
//         else if(gkduizhongkuai.search('cm')!=-1)
//         {
//             kuaishu=gkduizhongkuai.substr(0,gkduizhongkuai.search('cm')).trim()
//             if(isNormalInteger(kuaishu)&&gkduizhongkuai.length===(gkduizhongkuai.search('cm')+2))
//             {
//                 dzright=true
//             }
//         }
//         if(!dzright)
//         {
//             addstrtip('注意对重块数量或高度填写是否正确！')
//         }
        var gkanzhuangdidian = document.getElementById('1622602686672fdd5').textContent.trim().slice(10)//安装地点
        if(gkanzhuangdidian.trim()==='')
        {
            addstrtip('注意安装地点！')
        }

        var gkyonghubianhao = document.getElementById('1622601269543b99').textContent.trim().slice(4)//用户编号
        if(gkyonghubianhao.trim()==='')
        {
            addstrtip('注意用户编号是否正确！')
        }
//alert('hello9902')
        var gkedinzaizhongliang = document.getElementById('16226027567171386').textContent.trim().slice(6)//额定载重量
        if(!isNormalInteger(gkedinzaizhongliang))
        {
            addstrtip('注意额定载重量是否正确！')
        }

        var gkedinsudu = document.getElementById('16316683159874b54').textContent.trim().slice(6)//额定速度parseFloat()
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

        var gkcengshu = document.getElementById('16316681172757f05').textContent.trim().slice(4)//层数
        if(!isNormalInteger(gkcengshu))
        {
            addstrtip('注意层数是否正确！')

            addstrtip('注意层数是否正确！')
        }
        var gkzhanshu = document.getElementById('1622602864607f9f5').textContent.trim().slice(4)//站数
        if(!isNormalInteger(gkzhanshu))
        {
            addstrtip('注意站数是否正确！')
        }

        var gkmenshu = document.getElementById('1622602874934d118').textContent.trim().slice(4)//门数

        if(!isNormalInteger(gkmenshu))
        {
            addstrtip('注意门数是否正确！')
        }
        var sc=gkcengshu+'层'+gkzhanshu+'站'+gkmenshu+'门'
         addstrtip(sc)
//alert('hello9903')

        var gkkongzhifangshi = document.getElementById('1631668468764b0b5').innerText.trim()//控制方式
        if(!(gkkongzhifangshi==='集选控制'||gkkongzhifangshi==='并联控制'||gkkongzhifangshi==='群控'||gkkongzhifangshi==='集选'||gkkongzhifangshi==='并联'))
        {
            addstrtip('注意控制方式是否正确！')
        }
//         alert('hello9w903')
//         var gkxjiazhuagndianti = document.getElementById('16856959561037f1f').innerText.trim()//是否加装电梯
//         if(!(gkxjiazhuagndianti==='是'||gkxjiazhuagndianti==='否'))
//         {
//             addstrtip('注意是否加装电梯！')
//         }
//         var gkzhuzhaidianti = document.getElementById('16856959599044986').innerText.trim()//是否住宅电梯
//         if(!(gkzhuzhaidianti==='是'||gkzhuzhaidianti==='否'))
//         {
//             addstrtip('注意是否住宅电梯！')
//         }
//alert('hello99031')
        //1702605004285b1ce
        //1685696134215d617
//         var gkjiandujianyanriqi = document.getElementById('1702605004285b1ce').innerText.trim().replace(/年|月|日/g, '-').slice(0, -1)//监督检验日期
//         gkjiandujianyanriqi=YearMonthToYearMonthDay(gkjiandujianyanriqi)
//alert('hello990311')
        var gkbeizhu = document.getElementById('1622602908394fb45').innerText.trim()//概况备注
//alert('hello990312')
        var jljianyanjielun = document.getElementById('162260294680410f0').innerText.trim()//检验结论
//alert('hello990313')
        if(jljianyanjielun.search('不合格')===-1&&gkxiacijianyanriqistr==='-')
        {
            addstrtip('合格应有下次检验日期！')
        }
//alert('hello99032')
        var jljianyanrenyuan = document.getElementById('16402458631312e23').innerText.trim()//检验人员
        var jljianyanriqi = document.getElementById('1622602989596ac35').innerText.trim().replace(/年|月|日/g, '-').slice(0, -1)//检验人员日期
        jljianyanriqi=YearMonthToYearMonthDay(jljianyanriqi)
        if(!ZifuchuanIsDate(jljianyanriqi))
        {
            addstrtip('结论检验人员日期格式错误！')
        }
        //alert('hello99033')
        var jljiaoherenyuan = document.getElementById('1622603036375ab01').innerText.trim()//校核人员
        var jljiaoheriqi = document.getElementById('16226030388080a8d').innerText.trim().replace(/年|月|日/g, '-').slice(0, -1)//校核人员日期
        jljiaoheriqi=YearMonthToYearMonthDay(jljiaoheriqi)
        if(!ZifuchuanIsDate(jljiaoheriqi))
        {
            //addstrtip('结论校核人员日期格式错误！')
        }
//alert('hello9904')
        var jlbeizhu = document.getElementById('16226030569121dad').textContent.trim().slice(6)//结论备注
        var checkdoor6_7 = document.getElementById('1622534824719fce8').textContent.trim().slice(5)//自动关闭层门装置抽查
        var checkdoor6_8 = document.getElementById('1622534852260eb90').textContent.trim().slice(5)//紧急开锁装置抽查
        var checkdoor6_10 = document.getElementById('1622534854401c820').textContent.trim().slice(5)//门的闭合抽查
        var strcheckdoor6_7 = checkdoor6_7.split("、")
        var strcheckdoor6_8 = checkdoor6_8.split("、")
        var strcheckdoor6_10 = checkdoor6_10.split("、")
        var intgkcengshu=parseInt(gkcengshu)
        var intgkzhanshu=parseInt(gkzhanshu)
        var intgkmenshu=parseInt(gkmenshu)
        if(intgkcengshu<intgkzhanshu||intgkmenshu>intgkzhanshu*2||intgkzhanshu>intgkmenshu)
        {
            addstrtip('注意层站门数量是否不合理！')
            addstrtip(checkdoor6_7)
        }


        //门系统检测记录验证
        if((intgkcengshu>2&&strcheckdoor6_7.length<3)||(strcheckdoor6_7.length-2)<((intgkmenshu-2)*0.2)
           ||(strcheckdoor6_8.length-2)<((intgkmenshu-2)*0.2)
           ||(strcheckdoor6_10.length-2)<((intgkmenshu-2)*0.2))//减去2是去除基站、端站的数量，当基站与端站同为1层时为2，考虑最不利情况
        {
            addstrtip('注意抽查层门数量是否不合理！')
             addstrtip(checkdoor6_7)
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
             addstrtip(checkdoor6_7)
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
//alert('hello9905')
        //获取日期

        //改造日期
        var gkgaizaoriqidate=StringToDate(gkgaizaoriqi)

        //制造日期
        var zhizaodate=StringToDate(gkzhizaoriqi)

        //监督检验日期
       // var gkjiandujianyanriqidate=StringToDate(gkjiandujianyanriqi)


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
//alert('hello98')
        //当前日期
        var curdate = new Date()
        var curyear=curdate.getFullYear()//获取完整的年份(4位)
        var curmonth=curdate.getMonth()//获取完整的月份(2位)
        if(gkgaizaoriqi1str!='-'&&gkgaizaoriqi1str!='')
        {
            if(!(/*gkgaizaoriqidate.getTime()>=gkjiandujianyanriqidate.getTime()&&*/gkgaizaoriqidate.getTime()<=curdate.getTime()))
            {
                addstrtip('注意改造日期是否合理！')
            }
        }

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
        //下次检验日期、限速器下次校验时间、下次制动试验时间中年份验证
        if(sbpz==='曳引驱动乘客电梯')
        {
            if(!(gkxiacijianyanriqidate.getMonth()===gkxiansuqixiaciriqidate.getMonth()&&gkxiacijianyanriqidate.getMonth()===gkxiacizhidongshijiandate.getMonth()))
            {
                addstrtip('下次检验日期、限速器下次校验时间、下次制动试验时间中月份不一致！')

            }
            if(!(gkxiacijianyanriqidate.getFullYear()-jyrqdate.getFullYear()===1
                 &&gkxiansuqixiaciriqidate.getFullYear()-jyrqdate.getFullYear()>0&&gkxiansuqixiaciriqidate.getFullYear()-jyrqdate.getFullYear()<3
                 &&gkxiacizhidongshijiandate.getFullYear()-jyrqdate.getFullYear()>0&&gkxiacizhidongshijiandate.getFullYear()-jyrqdate.getFullYear()<6))
            {
                addstrtip('下次检验日期、限速器下次校验时间、下次制动试验时间中年份错误！')

            }
        }
        else
        {
            if(!(gkxiacijianyanriqidate.getMonth()===gkxiansuqixiaciriqidate.getMonth()))
            {
                addstrtip('下次检验日期、限速器下次校验时间中月份不一致！')

            }
            if(!(gkxiacijianyanriqidate.getFullYear()-jyrqdate.getFullYear()===1
                 &&gkxiansuqixiaciriqidate.getFullYear()-jyrqdate.getFullYear()>0&&gkxiansuqixiaciriqidate.getFullYear()-jyrqdate.getFullYear()<3
                ))
            {
                addstrtip('下次检验日期、限速器下次校验时间中年份错误！')

            }
        }

        //下次检验日期判断
        if(!(gkxiacijianyanriqidate.getFullYear()===jyrqdate.getFullYear()+1))
        {
            addstrtip('注意下次检验日期是否合理！')

        }

//         if(!(zhizaodate.getTime()<=gkjiandujianyanriqidate.getTime()))
//         {
//             addstrtip('制造日期与监督检验日期矛盾！')

//         }
//         if(!(gkjiandujianyanriqidate.getTime()<jyrqdate.getTime()))
//         {
//             addstrtip('监督检验日期与检验日期矛盾！')

//         }
//         if(!(jljianyanriqidate.getTime()<=jljiaoheriqidate.getTime()))
//         {
//             addstrtip('结论中检验日期与校核日期矛盾！')

//         }
        var mark1_4 = document.getElementById('1622605949356e4b9').textContent.trim().slice(-1)
        var mark1_4_1 = document.getElementById('16226229585004343').textContent.trim().slice(-1)
        if(mark1_4_1=== '×')
        {
            if(jlbeizhu==='-'||jlbeizhu==='无')
            {
                addstrtip('未注册不合格应备注说明！')
            }
        }
        var mark1_4_2 = document.getElementById('16226231421154efd').textContent.trim().slice(-1)
        var mark1_4_3 = document.getElementById('162262318148238b5').textContent.trim().slice(-1)
        var mark1_4_4 = document.getElementById('16226232146432270').textContent.trim().slice(-1)
        var mark1_4_5 = document.getElementById('1622623230634ecf7').textContent.trim().slice(-1)
        fenxiangs.push(mark1_4_1,mark1_4_2,mark1_4_3,mark1_4_4,mark1_4_5)
        fenxiangjlmap.set('mark1_4',mark1_4)
        fenxiangmap.set('mark1_4_1',mark1_4_1)
        fenxiangmap.set('mark1_4_2',mark1_4_2)
        fenxiangmap.set('mark1_4_3',mark1_4_3)
        fenxiangmap.set('mark1_4_4',mark1_4_4)
        fenxiangmap.set('mark1_4_5',mark1_4_5)
        if((mark1_4_1 === '×'||mark1_4_2 === '×'||mark1_4_3 === '×'
            ||mark1_4_4 === '×'||mark1_4_5 === '×'
           ) && mark1_4 === '×'||
           (mark1_4_1 != '×'&&mark1_4_2 != '×'&&mark1_4_3 != '×'
            &&mark1_4_4 != '×'&&mark1_4_5 != '×'
           ) && mark1_4 != '×')
        {
            // 通过
        }
        else
        {
            addstrtip('1_4结论有误！')
        }
        var mark2_1 = document.getElementById('16226059655479d6e').textContent.trim().slice(-1)
        var mark2_1_1 = document.getElementById('1622623274695a3f6').textContent.trim().slice(-1)
        var mark2_1_11 = document.getElementById('1622623316315987a').textContent.trim().slice(-1)
        var mark2_1_12 = document.getElementById('1622623362212c57d').textContent.trim().slice(-1)
        var mark2_1_13 = document.getElementById('1622623383267b022').textContent.trim().slice(-1)
        var mark2_1_14 = document.getElementById('16226234016513858').textContent.trim().slice(-1)
        var mark2_1_2 = document.getElementById('16226234536647b7e').textContent.trim().slice(-1)
        var mark2_1_31 = document.getElementById('1622624007104eee6').textContent.trim().slice(-1)
        var mark2_1_32 = document.getElementById('16226241502467ae1').textContent.trim().slice(-1)
        var mark2_1_33 = document.getElementById('16226234725272baa').textContent.trim().slice(-1)
        fenxiangs.push(mark2_1_1,mark2_1_11,mark2_1_12,mark2_1_13,mark2_1_14,mark2_1_2,mark2_1_31,mark2_1_32,mark2_1_33)
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

        if((mark2_1_1 === '×'||mark2_1_11 === '×'||mark2_1_12 === '×'
            ||mark2_1_13 === '×'||mark2_1_14 === '×'||mark2_1_2 === '×'||
            mark2_1_31 === '×'||mark2_1_32 === '×'||mark2_1_33 === '×'
           ) && mark2_1 === '×'||
           (mark2_1_1 != '×'&&mark2_1_11 != '×'&&mark2_1_12 != '×'
            &&mark2_1_13 != '×'&&mark2_1_14 != '×'&&mark2_1_2 != '×'
            &&mark2_1_31 != '×'&&mark2_1_32 != '×'&&mark2_1_33 != '×'
           ) && mark2_1 != '×')
        {
            // 通过
        }
        else
        {
            addstrtip('2_1结论有误！')
        }
        if( mark2_1_11 === '-'&&mark2_1_12 === '-' && mark2_1_13 === '-'&& mark2_1_14 === '-')
        {
            //addstrtip('2_1TIP:无爬梯！TIP')
            strinput=strinput+'无爬梯   '
        }
        else if( mark2_1_11 != '-'&&mark2_1_12 !='-' && mark2_1_13 !='-'&& mark2_1_14 !='-')
        {
            //addstrtip('2_1TIP:有爬梯！TIP')
            strinput=strinput+'有爬梯   '
        }
        else
        {
            //addstrtip('2_1TIP:爬梯部分勾选！TIP')
            strinput=strinput+'爬梯部分勾选   '
        }

        var mark2_5_1 = document.getElementById('1622605965548d584').textContent.trim().slice(-1)
        var mark2_5_11 = document.getElementById('16226242745216d1f').textContent.trim().slice(-1)
        var mark2_5_12 = document.getElementById('16226242927239e99').textContent.trim().slice(-1)
        fenxiangs.push(mark2_5_11,mark2_5_12)
        fenxiangjlmap.set('mark2_5_1',mark2_5_1)
        fenxiangmap.set('mark2_5_11',mark2_5_11)
        fenxiangmap.set('mark2_5_12',mark2_5_12)

        if((mark2_5_11 === '×'||mark2_5_12 === '×'
           ) && mark2_5_1 === '×'||
           (mark2_5_11 != '×'&&mark2_5_12 != '×'
           ) && mark2_5_1 != '×')
        {
            // 通过
        }
        else
        {
            addstrtip('2_5_1结论有误！')
        }


        var mark2_6_2 = document.getElementById('1622605965550dc6a').textContent.trim().slice(-1)
        var mark2_6_21 = document.getElementById('16226243116569258').textContent.trim().slice(-1)
        fenxiangs.push(mark2_6_21)
        fenxiangjlmap.set('mark2_6_2',mark2_6_2)
        fenxiangmap.set('mark2_6_21',mark2_6_21)

        if((mark2_6_21 === '×'
           ) && mark2_6_2 === '×'||
           (mark2_6_21 != '×'
           ) && mark2_6_2 != '×')
        {
            // 通过
        }
        else
        {
            addstrtip('2_6_2结论有误！')
        }

        var mark2_7 = document.getElementById('1622625537346a984').textContent.trim().slice(-1)
        var mark2_7_2 = document.getElementById('162262545644588e4').textContent.trim().slice(-1)
        var mark2_7_31 = document.getElementById('16226256113574a93').textContent.trim().slice(-1)
        var mark2_7_32 = document.getElementById('162262587210708a5').textContent.trim().slice(-1)
        var mark2_7_41 = document.getElementById('1622627515673cc37').textContent.trim().slice(-1)
        var mark2_7_42 = document.getElementById('1622627574179125a').textContent.trim().slice(-1)
        var mark2_7_51 = document.getElementById('1622628452686c0d9').textContent.trim().slice(-1)
        var mark2_7_52 = document.getElementById('1622628690989142c').textContent.trim().slice(-1)
        var mark2_7_53 = document.getElementById('1622628744657ad9f').textContent.trim().slice(-1)
        var mark2_7_54 = document.getElementById('1622628779311a1dd').textContent.trim().slice(-1)
        var mark2_7_55 = document.getElementById('162262886735300ea').textContent.trim().slice(-1)
        var mark2_7_56 = document.getElementById('16226291081506e86').textContent.trim().slice(-1)
        fenxiangs.push(mark2_7_2,mark2_7_31,mark2_7_32,mark2_7_41,mark2_7_42,mark2_7_51,mark2_7_52,mark2_7_53,mark2_7_54,mark2_7_55,mark2_7_56)

        fenxiangjlmap.set('mark2_7',mark2_7)
        fenxiangmap.set('mark2_7_2',mark2_7_2)
        fenxiangmap.set('mark2_7_31',mark2_7_31)
        fenxiangmap.set('mark2_7_32',mark2_7_32)
        fenxiangmap.set('mark2_7_41',mark2_7_41)
        fenxiangmap.set('mark2_7_42',mark2_7_42)
        fenxiangmap.set('mark2_7_51',mark2_7_51)
        fenxiangmap.set('mark2_7_52',mark2_7_52)
        fenxiangmap.set('mark2_7_53',mark2_7_53)
        fenxiangmap.set('mark2_7_54',mark2_7_54)
        fenxiangmap.set('mark2_7_55',mark2_7_55)
        fenxiangmap.set('mark2_7_56',mark2_7_56)
//alert('hello99')
        if((mark2_7_2 === '×'||mark2_7_31 === '×'||mark2_7_32 === '×'
            ||mark2_7_41 === '×'||mark2_7_42 === '×'||mark2_7_51 === '×'||mark2_7_52 === '×'
            ||mark2_7_53 === '×'||mark2_7_54 === '×'||mark2_7_55 === '×'||mark2_7_56 === '×'
           ) && mark2_7 === '×'||
           (mark2_7_2 != '×'&&mark2_7_31 != '×'&&mark2_7_32 != '×'
            &&mark2_7_41 != '×'&&mark2_7_42 != '×'&&mark2_7_51 != '×'
            &&mark2_7_52 != '×'&&mark2_7_53 != '×'&&mark2_7_54 != '×'
            &&mark2_7_55 != '×'&&mark2_7_56 != '×'
           ) && mark2_7 != '×')
        {
            // 通过
        }
        else
        {
            addstrtip('2_7结论有误！')
        }
        if(mark2_7_51==='-'&&mark2_7_52==='-'&&mark2_7_53==='-'&&mark2_7_54==='-'&&mark2_7_55==='-')
        {
            strinput=strinput+'无盘车   '
        }
        else if(mark2_7_51==='√'&&mark2_7_52==='√'&&mark2_7_53==='√'&&mark2_7_54==='√'&&mark2_7_55==='√')
        {
            strinput=strinput+'有盘车   '
        }
        else
        {
            strinput=strinput+'盘车松闸部分勾选   '
        }

        var mark2_8 = document.getElementById('16226321128877c08').textContent.trim().slice(-1)
        var mark2_8_21 = document.getElementById('16226291780336716').textContent.trim().slice(-1)
        var mark2_8_22 = document.getElementById('1622629208803e5b1').textContent.trim().slice(-1)
        var mark2_8_41 = document.getElementById('16226305269821f1b').textContent.trim().slice(-1)
        var mark2_8_42 = document.getElementById('16226305543715ba1').textContent.trim().slice(-1)
        var mark2_8_43 = document.getElementById('16226305844672593').textContent.trim().slice(-1)
        var mark2_8_51 = document.getElementById('162263066846881eb').textContent.trim().slice(-1)
        var mark2_8_52 = document.getElementById('16226306913595e6e').textContent.trim().slice(-1)
        var mark2_8_53 = document.getElementById('1623056899052f01e').textContent.trim().slice(-1)
        var mark2_8_54 = document.getElementById('16226307152156428').textContent.trim().slice(-1)
        var mark2_8_61 = document.getElementById('16226307948263a58').textContent.trim().slice(-1)
        var mark2_8_62 = document.getElementById('1622630878621b224').textContent.trim().slice(-1)
        var mark2_8_63 = document.getElementById('1622631019745316b').textContent.trim().slice(-1)
        var mark2_8_64 = document.getElementById('162263090219191ee').textContent.trim().slice(-1)
        var mark2_8_71 = document.getElementById('1622631181329e02d').textContent.trim().slice(-1)
        var mark2_8_72 = document.getElementById('1622631174714fd77').textContent.trim().slice(-1)
        var mark2_8_8 = document.getElementById('16226312296918632').textContent.trim().slice(-1)
        var mark2_8_91 = document.getElementById('1622631286845fa54').textContent.trim().slice(-1)
        var mark2_8_92= document.getElementById('162263127824644b1').textContent.trim().slice(-1)
        var mark2_8_93 = document.getElementById('16226312905824b50').textContent.trim().slice(-1)
        fenxiangs.push(mark2_8_21,mark2_8_22,mark2_8_41,mark2_8_42,mark2_8_43,mark2_8_51,mark2_8_52,mark2_8_53,mark2_8_54,mark2_8_61,mark2_8_62,mark2_8_63,mark2_8_64,mark2_8_71,mark2_8_72,mark2_8_8,mark2_8_91,mark2_8_92,mark2_8_93)
        fenxiangjlmap.set('mark2_8',mark2_8)
        fenxiangmap.set('mark2_8_21',mark2_8_21)
        fenxiangmap.set('mark2_8_22',mark2_8_22)
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
        if((mark2_8_21 === '×'||mark2_8_22 === '×'
            ||mark2_8_41 === '×'||mark2_8_42 === '×'||mark2_8_43 === '×'
            ||mark2_8_51 === '×'||mark2_8_52 === '×'||mark2_8_53 === '×'||mark2_8_54 === '×'
            ||mark2_8_61 === '×'||mark2_8_62 === '×'||mark2_8_63 === '×'||mark2_8_64 === '×'
            ||mark2_8_71 === '×'||mark2_8_72 === '×'
            ||mark2_8_8 === '×'
            ||mark2_8_91 === '×'||mark2_8_92 === '×'||mark2_8_93 === '×'
           ) && mark2_8 === '×'||
           (mark2_8_21 != '×'&&mark2_8_22 != '×'
            &&mark2_8_41 != '×'&&mark2_8_42 != '×'&&mark2_8_43 != '×'
            &&mark2_8_51 != '×'&&mark2_8_52 != '×'&&mark2_8_53 != '×'&&mark2_8_54 != '×'
            &&mark2_8_61 != '×'&&mark2_8_62 != '×'&&mark2_8_63 != '×'&&mark2_8_64 != '×'
            &&mark2_8_71 != '×'&&mark2_8_72 != '×'
            &&mark2_8_8 != '×'
            &&mark2_8_91 != '×'&&mark2_8_92 != '×'&&mark2_8_93 != '×'
           ) && mark2_8 != '×')
        {
            // 通过
        }
        else
        {
            addstrtip('2_8结论有误！')
        }

        if(mark2_8_41==='-'&&mark2_8_42==='-'&&mark2_8_43==='-')
        {
            strinput=strinput+'无紧急电动   '
        }
        else if(mark2_8_41==='√'&&mark2_8_42==='√'&&mark2_8_43==='√')
        {
            strinput=strinput+'有紧急电动   '
        }

        var mark2_9 = document.getElementById('1622633843049e2b3').textContent.trim().slice(-1)
        var mark2_9_2 = document.getElementById('1622632737420f5f0').textContent.trim().slice(-1)
        var mark2_9_3 = document.getElementById('16226328371235edc').textContent.trim().slice(-1)
        var mark2_9_41 = document.getElementById('162263289497603b2').textContent.trim().slice(-1)
        var mark2_9_42 = document.getElementById('16226328920009794').textContent.trim().slice(-1)
        fenxiangs.push(mark2_9_2,mark2_9_3,mark2_9_41,mark2_9_42)

        fenxiangjlmap.set('mark2_9',mark2_9)
        fenxiangmap.set('mark2_9_2',mark2_9_2)
        fenxiangmap.set('mark2_9_3',mark2_9_3)
        fenxiangmap.set('mark2_9_41',mark2_9_41)
        fenxiangmap.set('mark2_9_42',mark2_9_42)
        if((mark2_9_2 === '×'||mark2_9_3 === '×'
            ||mark2_9_41 === '×'||mark2_9_42 === '×'
           ) && mark2_9 === '×'||
           (mark2_9_2 != '×'&&mark2_9_3 != '×'
            &&mark2_9_41 != '×'&&mark2_9_42 != '×'
           ) && mark2_9 != '×')
        {
            // 通过
        }
        else
        {
            addstrtip('2_9结论有误！')
        }

        var mark2_10_2 = document.getElementById('1622633934071feef').textContent.trim().slice(-1)
        var mark2_10_21 = document.getElementById('1622632931017f52f').textContent.trim().slice(-1)
        fenxiangs.push(mark2_10_21)

        fenxiangjlmap.set('mark2_10_2',mark2_10_2)
        fenxiangmap.set('mark2_10_21',mark2_10_21)
        if((
            //start1
            mark2_10_21 === '×'
            //end1
        ) && mark2_10_2 === '×'||(
            //start2
            mark2_10_21 != '×'
            //end2
        ) && mark2_10_2 != '×')
        {
            // 通过
        }
        else
        {
            addstrtip('2_10_2结论有误！')
        }

        var mark2_11 = document.getElementById('1622633934072cdd3').textContent.trim().slice(-1)
        var mark2_111 = document.getElementById('16226330760141551').textContent.trim().slice(-1)
        fenxiangs.push(mark2_111)
        fenxiangjlmap.set('mark2_11',mark2_11)
        fenxiangmap.set('mark2_111',mark2_111)

        if((
            //start1
            mark2_111 === '×'
            //end1
        ) && mark2_11 === '×'||(
            //start2
            mark2_111 != '×'
            //end2
        ) && mark2_11 != '×')
        {
            // 通过
        }
        else
        {
            addstrtip('2_11结论有误！')
        }
        if(mark2_111!='√')
        {
            addstrtip('2_11电气绝缘项目应该实测！')
        }

        var mark3_4 = document.getElementById('162263393407216b6').textContent.trim().slice(-1)
        var mark3_4_3 = document.getElementById('1622633184204ca96').textContent.trim().slice(-1)
        var mark3_4_4 = document.getElementById('16226332715608daa').textContent.trim().slice(-1)
        fenxiangs.push(mark3_4_3,mark3_4_4)

        fenxiangjlmap.set('mark3_4',mark3_4)
        fenxiangmap.set('mark3_4_3',mark3_4_3)
        fenxiangmap.set('mark3_4_4',mark3_4_4)
        if((//start1
            mark3_4_3 === '×'||mark3_4_4 === '×'
            //end1
        ) && mark3_4 === '×'||(
            //start2
            mark3_4_3 != '×'&&mark3_4_4 != '×'
            //end2
        ) && mark3_4 != '×')
        {// 通过
        }
        else{addstrtip('3_4结论有误！')}
        if( mark3_4_3 === '-'&&mark3_4_4 === '-' && mark3_4 === '-')
        {
            //addstrtip('3_4TIP:无井道安全门！TIP')
            strinput=strinput+'无井道安全门   '
        }
        else if( mark3_4_3 != '-'&&mark3_4_4 !='-' && mark3_4 !='-')
        {
            //addstrtip('3_4TIP:有井道安全门！TIP')
            strinput=strinput+'有井道安全门   '
        }
        else
        {
            //addstrtip('3_4TIP:井道安全门部分勾选！TIP')
            strinput=strinput+'井道安全门部分勾选   '
        }

        var mark3_5 = document.getElementById('16226339340733197').textContent.trim().slice(-1)
        var mark3_5_3 = document.getElementById('1622633302250c697').textContent.trim().slice(-1)
        var mark3_5_4 = document.getElementById('1622633328481b2ac').textContent.trim().slice(-1)

        fenxiangs.push(mark3_5_3,mark3_5_4)

        fenxiangjlmap.set('mark3_5',mark3_5)
        fenxiangmap.set('mark3_5_3',mark3_5_3)
        fenxiangmap.set('mark3_5_4',mark3_5_4)
        if((//start1
            mark3_5_3 === '×'||mark3_5_4 === '×'
            //end1
        ) && mark3_5 === '×'||(
            //start2
            mark3_5_3 != '×'&&mark3_5_4 != '×'
            //end2
        ) && mark3_5 != '×')
        {// 通过
        }
        else{addstrtip('3_5结论有误！')

            }
        if( mark3_5_3 === '-'&&mark3_5_4 === '-' && mark3_5 === '-')
        {
            //addstrtip('3_5TIP:无井道检修门！TIP')
            strinput=strinput+'无井道检修门   '
        }
        else if( mark3_5_3 != '-'&&mark3_5_4 !='-' && mark3_5 !='-')
        {
            //addstrtip('3_5TIP:有井道检修门！TIP')
            strinput=strinput+'有井道检修门   '
        }
        else
        {
            //addstrtip('3_5TIP:井道检修门部分勾选！TIP')
            strinput=strinput+'井道检修门部分勾选   '
        }

        var mark3_7 = document.getElementById('16226339340735da4').textContent.trim().slice(-1)
        var mark3_71 = document.getElementById('1622683546059c966').textContent.trim().slice(-1)
        var mark3_72 = document.getElementById('16226334902175f99').textContent.trim().slice(-1)
        var mark3_73 = document.getElementById('1622683675614e708').textContent.trim().slice(-1)
        var mark3_74 = document.getElementById('1622633499166f26d').textContent.trim().slice(-1)
        var mark3_75 = document.getElementById('162263349436649ed').textContent.trim().slice(-1)
        fenxiangs.push(mark3_71,mark3_72,mark3_73,mark3_74,mark3_75)

        fenxiangjlmap.set('mark3_7',mark3_7)
        fenxiangmap.set('mark3_71',mark3_71)
        fenxiangmap.set('mark3_72',mark3_72)
        fenxiangmap.set('mark3_73',mark3_73)
        fenxiangmap.set('mark3_74',mark3_74)
        fenxiangmap.set('mark3_75',mark3_75)
        if((//start1
            mark3_71 === '×'||mark3_72 === '×'||mark3_73 === '×'||mark3_74 === '×'||mark3_75 === '×'
            //end1
        ) && mark3_7 === '×'||(
            //start2
            mark3_71 != '×'&&mark3_72 != '×'&&mark3_73 != '×'&&mark3_74 != '×'&&mark3_75 != '×'
            //end2
        ) && mark3_7 != '×')
        {// 通过
        }
        else{addstrtip('3_7结论有误！')

            }

        var mark3_10 = document.getElementById('16226339340746393').textContent.trim().slice(-1)
        var mark3_101 = document.getElementById('16226336101017b0d').textContent.trim().slice(-1)
        var mark3_102 = document.getElementById('16226336141150147').textContent.trim().slice(-1)
        fenxiangs.push(mark3_101,mark3_102)

        fenxiangjlmap.set('mark3_10',mark3_10)
        fenxiangmap.set('mark3_101',mark3_101)
        fenxiangmap.set('mark3_102',mark3_102)
        if((//start1
            mark3_101 === '×'||mark3_102 === '×'
            //end1
        ) && mark3_10 === '×'||(
            //start2
            mark3_101 != '×'&&mark3_102 != '×'
            //end2
        ) && mark3_10 != '×')
        {// 通过
        }
        else{addstrtip('3_10结论有误！')

            }
//alert('hello100')
        var mark3_11 = document.getElementById('1622633934074a11d').textContent.trim().slice(-1)
        var mark3_111 = document.getElementById('1622633660117fec8').textContent.trim().slice(-1)
        var mark3_112 = document.getElementById('1622633663572fe18').textContent.trim().slice(-1)

        fenxiangs.push(mark3_111,mark3_112)

        fenxiangjlmap.set('mark3_11',mark3_11)
        fenxiangmap.set('mark3_111',mark3_111)
        fenxiangmap.set('mark3_112',mark3_112)
        if((//start1
            mark3_111 === '×'||mark3_112 === '×'
            //end1
        ) && mark3_11 === '×'||(
            //start2
            mark3_111 != '×'&&mark3_112 != '×'
            //end2
        ) && mark3_11 != '×')
        {// 通过
        }
        else{addstrtip('3_11结论有误！')

            }

        var mark3_12 = document.getElementById('1622633934074a11d').textContent.trim().slice(-1)
        var mark3_12_1 = document.getElementById('16226337093378386').textContent.trim().slice(-1)
        var mark3_12_31 = document.getElementById('1622633732315f517').textContent.trim().slice(-1)
        var mark3_12_32 = document.getElementById('1622633741250b908').textContent.trim().slice(-1)
        fenxiangs.push(mark3_12_1,mark3_12_31,mark3_12_32)

        fenxiangjlmap.set('mark3_12',mark3_12)
        fenxiangmap.set('mark3_12_1',mark3_12_1)
        fenxiangmap.set('mark3_12_31',mark3_12_31)
        fenxiangmap.set('mark3_12_32',mark3_12_32)
        if((//start1
            mark3_12_1 === '×'
            ||mark3_12_31 === '×'||mark3_12_32 === '×'
            //end1
        ) && mark3_12 === '×'||(
            //start2
            mark3_12_1 != '×'
            &&mark3_12_31 != '×'&&mark3_12_32 != '×'
            //end2
        ) && mark3_12 != '×')
        {// 通过
        }
        else{addstrtip('3_12结论有误！')

            }

        var mark3_14 = document.getElementById('162263617205343cf').textContent.trim().slice(-1)
        var mark3_141 = document.getElementById('16226347273896360').textContent.trim().slice(-1)

        fenxiangs.push(mark3_141)
        fenxiangjlmap.set('mark3_14',mark3_14)
        fenxiangmap.set('mark3_141',mark3_141)
        if((//start1
            mark3_141 === '×'
            //end1
        ) && mark3_14 === '×'||(
            //start2
            mark3_141 != '×'
            //end2
        ) && mark3_14 != '×')
        {// 通过
        }
        else{addstrtip('3_14结论有误！')

            }

        var mark3_15 = document.getElementById('16226362466719889').textContent.trim().slice(-1)
        var mark3_15_3 = document.getElementById('16226347766727e6d').textContent.trim().slice(-1)
        var mark3_15_4 = document.getElementById('162263482233647d5').textContent.trim().slice(-1)
        var mark3_15_5 = document.getElementById('1622634850769efc7').textContent.trim().slice(-1)
        fenxiangs.push(mark3_15_3,mark3_15_4,mark3_15_5)
        fenxiangjlmap.set('mark3_15',mark3_15)
        fenxiangmap.set('mark3_15_3',mark3_15_3)
        fenxiangmap.set('mark3_15_4',mark3_15_4)
        fenxiangmap.set('mark3_15_5',mark3_15_5)

        if((//start1
            mark3_15_3 === '×'||mark3_15_4 === '×'||mark3_15_5 === '×'
            //end1
        ) && mark3_15 === '×'||(
            //start2
            mark3_15_3 != '×'&&mark3_15_4 != '×'&&mark3_15_5 != '×'
            //end2
        ) && mark3_15 != '×')
        {// 通过
        }
        else{addstrtip('3_15结论有误！')}
        if(mark3_15_4==='-')
        {
            //addstrtip('3_15_4TIP:蓄能缓冲器！TIP')
            strinput=strinput+'蓄能缓冲器   '
        }
        else
        {
            //addstrtip('3_15_4TIP:耗能缓冲器！TIP')
            strinput=strinput+'耗能缓冲器   '
        }


        var mark4_1 = document.getElementById('1622636246672f56c').textContent.trim().slice(-1)
        var mark4_1_11 = document.getElementById('16226348923869e57').textContent.trim().slice(-1)
        var mark4_1_12 = document.getElementById('16226348985142e8e').textContent.trim().slice(-1)
        var mark4_1_13 = document.getElementById('16226349071072722').textContent.trim().slice(-1)
        var mark4_1_14 = document.getElementById('1622634911010e58b').textContent.trim().slice(-1)
        var mark4_1_15 = document.getElementById('16226349167969e5c').textContent.trim().slice(-1)
        var mark4_1_21 = document.getElementById('1622635055496aa6a').textContent.trim().slice(-1)
        var mark4_1_22 = document.getElementById('16226350586554055').textContent.trim().slice(-1)
        var mark4_1_23 = document.getElementById('16226350609984d62').textContent.trim().slice(-1)
        fenxiangs.push(mark4_1_11,mark4_1_12,mark4_1_13,mark4_1_14,mark4_1_15,mark4_1_21,mark4_1_22,mark4_1_23)

        fenxiangjlmap.set('mark4_1',mark4_1)
        fenxiangmap.set('mark4_1_11',mark4_1_11)
        fenxiangmap.set('mark4_1_12',mark4_1_12)
        fenxiangmap.set('mark4_1_13',mark4_1_13)
        fenxiangmap.set('mark4_1_14',mark4_1_14)
        fenxiangmap.set('mark4_1_15',mark4_1_15)
        fenxiangmap.set('mark4_1_21',mark4_1_21)
        fenxiangmap.set('mark4_1_22',mark4_1_22)
        fenxiangmap.set('mark4_1_23',mark4_1_23)

        if((//start1
            mark4_1_11 === '×'||mark4_1_12 === '×'||mark4_1_13 === '×'||mark4_1_14 === '×'||mark4_1_15 === '×'
            ||mark4_1_21 === '×'||mark4_1_22 === '×'||mark4_1_23 === '×'
            //end1
        ) && mark4_1 === '×'||(
            //start2
            mark4_1_11 != '×'&&mark4_1_12 != '×'&&mark4_1_13 != '×'&&mark4_1_14 != '×'&&mark4_1_15 != '×'
            &&mark4_1_21 != '×'&&mark4_1_22 != '×'&&mark4_1_23 != '×'
            //end2
        ) && mark4_1 != '×')
        {// 通过
        }
        else{addstrtip('4_1结论有误！')}

        var mark4_3 = document.getElementById('1622636246672f56c').textContent.trim().slice(-1)
        var mark4_31 = document.getElementById('16226351283951233').textContent.trim().slice(-1)
        fenxiangs.push(mark4_31)
        fenxiangjlmap.set('mark4_3',mark4_3)
        fenxiangmap.set('mark4_31',mark4_31)

        if((//start1
            mark4_31 === '×'
            //end1
        ) && mark4_3 === '×'||(
            //start2
            mark4_31 != '×'
            //end2
        ) && mark4_3 != '×')
        {// 通过
        }
        else{addstrtip('4_3结论有误！')}
        if(mark4_31==='-')
        {
            //addstrtip('4_3TIP:无安全窗！TIP')
            strinput=strinput+'无安全窗   '
        }
        else
        {
            //addstrtip('4_3TIP:有安全窗！TIP')
            strinput=strinput+'有安全窗   '
        }



        var mark4_5 = document.getElementById('1622636246672cf20').textContent.trim().slice(-1)
        var mark4_5_1 = document.getElementById('162263538580040e3').textContent.trim().slice(-1)
        var mark4_5_2 = document.getElementById('162263540584166da').textContent.trim().slice(-1)
        fenxiangs.push(mark4_5_1,mark4_5_2)
        fenxiangjlmap.set('mark4_5',mark4_5)
        fenxiangmap.set('mark4_5_1',mark4_5_1)
        fenxiangmap.set('mark4_5_2',mark4_5_2)

        if((//start1
            mark4_5_1 === '×'||mark4_5_2 === '×'
            //end1
        ) && mark4_5 === '×'||(
            //start2
            mark4_5_1 != '×'&&mark4_5_2 != '×'
            //end2
        ) && mark4_5 != '×')
        {// 通过
        }
        else{addstrtip('4_5结论有误！')}


        var mark4_6 = document.getElementById('16226362466732a5d').textContent.trim().slice(-1)
        var mark4_6_21 = document.getElementById('1622635437844b23b').textContent.trim().slice(-1)
        var mark4_6_22 = document.getElementById('1622635440515dd6c').textContent.trim().slice(-1)
        var mark4_6_23 = document.getElementById('162263544387463e8').textContent.trim().slice(-1)
        fenxiangs.push(mark4_6_21,mark4_6_22,mark4_6_23)

        fenxiangjlmap.set('mark4_6',mark4_6)
        fenxiangmap.set('mark4_6_21',mark4_6_21)
        fenxiangmap.set('mark4_6_22',mark4_6_22)
        fenxiangmap.set('mark4_6_23',mark4_6_23)
        if((//start1
            mark4_6_21 === '×'||mark4_6_22 === '×'||mark4_6_23 === '×'
            //end1
        ) && mark4_6 === '×'||(
            //start2
            mark4_6_21 != '×'&&mark4_6_22 != '×'&&mark4_6_23 != '×'
            //end2
        ) && mark4_6 != '×')
        {// 通过
        }
        else{addstrtip('4_6结论有误！')}

        var mark4_8 = document.getElementById('16226362466732a5d').textContent.trim().slice(-1)
        var mark4_8_1 = document.getElementById('162263552524094b8').textContent.trim().slice(-1)
        var mark4_8_21 = document.getElementById('1622635566832fee8').textContent.trim().slice(-1)
        var mark4_8_22 = document.getElementById('162263557105402b6').textContent.trim().slice(-1)
        var mark4_8_23 = document.getElementById('16226355811861969').textContent.trim().slice(-1)
        var mark4_8_24 = document.getElementById('16226355983445441').textContent.trim().slice(-1)
        fenxiangs.push(mark4_8_1,mark4_8_21,mark4_8_22,mark4_8_23,mark4_8_24)

        fenxiangjlmap.set('mark4_8',mark4_8)
        fenxiangmap.set('mark4_8_1',mark4_8_1)
        fenxiangmap.set('mark4_8_21',mark4_8_21)
        fenxiangmap.set('mark4_8_22',mark4_8_22)
        fenxiangmap.set('mark4_8_23',mark4_8_23)
        fenxiangmap.set('mark4_8_24',mark4_8_24)

        if((//start1
            mark4_8_1 === '×'
            ||mark4_8_21 === '×'||mark4_8_22 === '×'||mark4_8_23 === '×'||mark4_8_24 === '×'
            //end1
        ) && mark4_8 === '×'||(
            //start2
            mark4_8_1 != '×'
            &&mark4_8_21 != '×'&&mark4_8_22 != '×'&&mark4_8_23 != '×'&&mark4_8_24 != '×'
            //end2
        ) && mark4_8 != '×')
        {// 通过
        }
        else{addstrtip('4_8结论有误！')}

        var mark4_9 = document.getElementById('1622637228033c049').textContent.trim().slice(-1)
        var mark4_91 = document.getElementById('1622636321748b6e2').textContent.trim().slice(-1)
        fenxiangs.push(mark4_91)
        fenxiangjlmap.set('mark4_9',mark4_9)
        fenxiangmap.set('mark4_91',mark4_91)
        if((//start1
            mark4_91 === '×'
            //end1
        ) && mark4_9 === '×'||(
            //start2
            mark4_91 != '×'
            //end2
        ) && mark4_9 != '×')
        {// 通过
        }
        else{addstrtip('4_9结论有误！')}

        var mark4_10 = document.getElementById('16226372558258b7b').textContent.trim().slice(-1)
        var mark4_101 = document.getElementById('1622636378759d6a6').textContent.trim().slice(-1)
        var mark4_102 = document.getElementById('16226363819482d4a').textContent.trim().slice(-1)
        fenxiangs.push(mark4_101,mark4_102)

        fenxiangjlmap.set('mark4_10',mark4_10)
        fenxiangmap.set('mark4_101',mark4_101)
        fenxiangmap.set('mark4_102',mark4_102)
        if((//start1
            mark4_101 === '×'||mark4_102 === '×'
            //end1
        ) && mark4_10 === '×'||(
            //start2
            mark4_101 != '×'&&mark4_102 != '×'
            //end2
        ) && mark4_10 != '×')
        {// 通过
        }
        else{addstrtip('4_10结论有误！')}

        var mark5_1 = document.getElementById('1622637255826397b').textContent.trim().slice(-1)
        var mark5_11 = document.getElementById('1622636442617faed').textContent.trim().slice(-1)
        var mark5_12 = document.getElementById('16226364937654575').textContent.trim().slice(-1)
        var mark5_13 = document.getElementById('16226364983600db2').textContent.trim().slice(-1)
        var mark5_14 = document.getElementById('162263650406210f0').textContent.trim().slice(-1)
        fenxiangs.push(mark5_11,mark5_12,mark5_13,mark5_14)

        fenxiangjlmap.set('mark5_1',mark5_1)
        fenxiangmap.set('mark5_11',mark5_11)
        fenxiangmap.set('mark5_12',mark5_12)
        fenxiangmap.set('mark5_13',mark5_13)
        fenxiangmap.set('mark5_14',mark5_14)
        if((//start1
            mark5_11 === '×'||mark5_12 === '×'||mark5_13 === '×'||mark5_14 === '×'
            //end1
        ) && mark5_1 === '×'||(
            //start2
            mark5_11 != '×'&&mark5_12 != '×'&&mark5_13 != '×'&&mark5_14 != '×'
            //end2
        ) && mark5_1 != '×')
        {// 通过
        }
        else{addstrtip('5_1结论有误！')}
        if(mark5_14==='-')
        {
            //addstrtip('5_1TIP:钢丝绳！TIP')
            strinput=strinput+'钢丝绳   '
        }
        else
        {
            //addstrtip('5_1TIP:钢带！TIP')
            strinput=strinput+'钢带   '
        }

        var mark5_2 = document.getElementById('162263725582627f7').textContent.trim().slice(-1)
        var mark5_21 = document.getElementById('16226366643100d3f').textContent.trim().slice(-1)
        var mark5_22 = document.getElementById('16226367105413b31').textContent.trim().slice(-1)
        var mark5_23 = document.getElementById('16226367166521519').textContent.trim().slice(-1)
        fenxiangs.push(mark5_21,mark5_22,mark5_23)

        fenxiangjlmap.set('mark5_2',mark5_2)
        fenxiangmap.set('mark5_21',mark5_21)
        fenxiangmap.set('mark5_22',mark5_22)
        fenxiangmap.set('mark5_23',mark5_23)
        if((//start1
            mark5_21 === '×'||mark5_22 === '×'||mark5_23 === '×'
            //end1
        ) && mark5_2 === '×'||(
            //start2
            mark5_21 != '×'&&mark5_22 != '×'&&mark5_23 != '×'
            //end2
        ) && mark5_2 != '×')
        {// 通过
        }
        else{addstrtip('5_2结论有误！')}

        var mark5_3 = document.getElementById('16226372558281987').textContent.trim().slice(-1)
        var mark5_3_1 = document.getElementById('1622636804881c8e2').textContent.trim().slice(-1)
        var mark5_3_2 = document.getElementById('1622636838018762d').textContent.trim().slice(-1)
        var mark5_3_31 = document.getElementById('16226368597391b03').textContent.trim().slice(-1)
        var mark5_3_32 = document.getElementById('1622636864660b1ff').textContent.trim().slice(-1)
        fenxiangs.push(mark5_3_1,mark5_3_2,mark5_3_31,mark5_3_32)

        fenxiangjlmap.set('mark5_3',mark5_3)
        fenxiangmap.set('mark5_3_1',mark5_3_1)
        fenxiangmap.set('mark5_3_2',mark5_3_2)
        fenxiangmap.set('mark5_3_31',mark5_3_31)
        fenxiangmap.set('mark5_3_32',mark5_3_32)
        if((//start1
            mark5_3_1 === '×'||mark5_3_2 === '×'
            ||mark5_3_31 === '×'||mark5_3_32 === '×'
            //end1
        ) && mark5_3 === '×'||(
            //start2
            mark5_3_1 != '×'&&mark5_3_2 != '×'
            &&mark5_3_31 != '×'&&mark5_3_32 != '×'
            //end2
        ) && mark5_3 != '×')
        {// 通过
        }
        else{addstrtip('5_3结论有误！')}
        if(mark5_3_1!='-')
        {
            //addstrtip('5_3TIP:有补偿绳！TIP')
            strinput=strinput+'有补偿   '
        }
        else
        {
            //addstrtip('5_3TIP:无补偿绳！TIP')
            strinput=strinput+'无补偿    '
        }

        var mark5_5 = document.getElementById('16226372558295cb0').textContent.trim().slice(-1)
        var mark5_51 = document.getElementById('1622637721825adc7').textContent.trim().slice(-1)
        fenxiangs.push(mark5_51)
        fenxiangjlmap.set('mark5_5',mark5_5)
        fenxiangmap.set('mark5_51',mark5_51)
        if((//start1
            mark5_51 === '×'
            //end1
        ) && mark5_5 === '×'||(
            //start2
            mark5_51 != '×'
            //end2
        ) && mark5_5 != '×')
        {// 通过
        }
        else{addstrtip('5_5结论有误！')}

        var mark5_6 = document.getElementById('16226383327841407').textContent.trim().slice(-1)
        var mark5_61 = document.getElementById('162263783812159f9').textContent.trim().slice(-1)
        var mark5_62 = document.getElementById('16226377831256587').textContent.trim().slice(-1)
        var mark5_63 = document.getElementById('16226378782316c74').textContent.trim().slice(-1)
        var mark5_64 = document.getElementById('16226378805184ce8').textContent.trim().slice(-1)
        fenxiangs.push(mark5_61,mark5_62,mark5_63,mark5_64)
        fenxiangjlmap.set('mark5_6',mark5_6)
        fenxiangmap.set('mark5_61',mark5_61)
        fenxiangmap.set('mark5_62',mark5_62)
        fenxiangmap.set('mark5_63',mark5_63)
        fenxiangmap.set('mark5_64',mark5_64)
        if((//start1
            mark5_61 === '×'||mark5_62 === '×'||mark5_63 === '×'||mark5_64 === '×'
            //end1
        ) && mark5_6 === '×'||(
            //start2
            mark5_61 != '×'&&mark5_62 != '×'&&mark5_63 != '×'&&mark5_64 != '×'
            //end2
        ) && mark5_6 != '×')
        {// 通过
        }
        else{addstrtip('5_6结论有误！')}
        var date20040101=StringToDate('2004-01-01')
        if(zhizaodate.getTime()<date20040101.getTime())
        {
            addstrtip('注意5_6是否按照老标准勾选！')
        }

        var mark6_3 = document.getElementById('1622638354286c87f').textContent.trim().slice(-1)
        var mark6_3_11 = document.getElementById('1622684046093cab4').textContent.trim().slice(-1)
        var mark6_3_12 = document.getElementById('1622637980155c092').textContent.trim().slice(-1)
        var mark6_3_13 = document.getElementById('162268407749166a8').textContent.trim().slice(-1)
        var mark6_3_14 = document.getElementById('1622637982136e0d2').textContent.trim().slice(-1)
        var mark6_3_15 = document.getElementById('16226379846513a0e').textContent.trim().slice(-1)
        var mark6_3_21 = document.getElementById('162268410831033f7').textContent.trim().slice(-1)
        var mark6_3_22 = document.getElementById('162263805124657fa').textContent.trim().slice(-1)
        var mark6_3_23 = document.getElementById('1622684163138ff0e').textContent.trim().slice(-1)
        var mark6_3_24 = document.getElementById('1622638053756e5df').textContent.trim().slice(-1)
        fenxiangs.push(mark6_3_11,mark6_3_12,mark6_3_13,mark6_3_14,mark6_3_15,mark6_3_21,mark6_3_22,mark6_3_23,mark6_3_24)

        fenxiangjlmap.set('mark6_3',mark6_3)
        fenxiangmap.set('mark6_3_11',mark6_3_11)
        fenxiangmap.set('mark6_3_12',mark6_3_12)
        fenxiangmap.set('mark6_3_13',mark6_3_13)
        fenxiangmap.set('mark6_3_14',mark6_3_14)
        fenxiangmap.set('mark6_3_15',mark6_3_15)
        fenxiangmap.set('mark6_3_21',mark6_3_21)
        fenxiangmap.set('mark6_3_22',mark6_3_22)
        fenxiangmap.set('mark6_3_23',mark6_3_23)
        fenxiangmap.set('mark6_3_24',mark6_3_24)
        if((//start1
            mark6_3_11 === '×'||mark6_3_12 === '×'||mark6_3_13 === '×'||mark6_3_14 === '×'||mark6_3_15 === '×'
            ||mark6_3_21 === '×'||mark6_3_22 === '×'||mark6_3_23 === '×'||mark6_3_24 === '×'
            //end1
        ) && mark6_3 === '×'||(
            //start2
            mark6_3_11 != '×'&&mark6_3_12 != '×'&&mark6_3_13 != '×'&&mark6_3_14 != '×'&&mark6_3_15 != '×'
            &&mark6_3_21 != '×'&&mark6_3_22 != '×'&&mark6_3_23 != '×'&&mark6_3_24 != '×'
            //end2
        ) && mark6_3 != '×')
        {// 通过
        }
        else{addstrtip('6_3结论有误！')}
        if(mark6_3_21!='-'&&mark6_3_22!='-')
        {
            strinput=strinput+'旁开门    '
        }
        if(mark6_3_23!='-'&&mark6_3_24!='-')
        {
            strinput=strinput+'中分门    '
        }

        var mark6_4 = document.getElementById('16226383542879d6b').textContent.trim().slice(-1)
        var mark6_41 = document.getElementById('162263809039876da').textContent.trim().slice(-1)
        fenxiangs.push(mark6_41)
        fenxiangjlmap.set('mark6_4',mark6_4)
        fenxiangmap.set('mark6_41',mark6_41)
        if((//start1
            mark6_41 === '×'
            //end1
        ) && mark6_4 === '×'||(
            //start2
            mark6_41 != '×'
            //end2
        ) && mark6_4 != '×')
        {// 通过
        }
        else{addstrtip('6_4结论有误！')}
        if(mark6_41==='-')
        {
            strinput=strinput+'无玻璃防拖曳   '
        }
        else if(mark6_41!=='-')
        {
            strinput=strinput+'有玻璃防拖曳    '
        }

        var mark6_5 = document.getElementById('162263835428754f8').textContent.trim().slice(-1)
        var mark6_51 = document.getElementById('1622638115567ba84').textContent.trim().slice(-1)
        fenxiangs.push(mark6_51)
        fenxiangjlmap.set('mark6_5',mark6_5)
        fenxiangmap.set('mark6_51',mark6_51)
        if((//start1
            mark6_51 === '×'
            //end1
        ) && mark6_5 === '×'||(
            //start2
            mark6_51 != '×'
            //end2
        ) && mark6_5 != '×')
        {// 通过
        }
        else{addstrtip('6_5结论有误！')}
        var mark6_6 = document.getElementById('16226383542884303').textContent.trim().slice(-1)
        var mark6_61 = document.getElementById('1622638145880ac6e').textContent.trim().slice(-1)
        var mark6_62 = document.getElementById('162263814045329f0').textContent.trim().slice(-1)
        fenxiangs.push(mark6_61,mark6_62)

        fenxiangjlmap.set('mark6_6',mark6_6)
        fenxiangmap.set('mark6_61',mark6_61)
        fenxiangmap.set('mark6_62',mark6_62)
        if((//start1
            mark6_61 === '×'||mark6_62 === '×'
            //end1
        ) && mark6_6 === '×'||(
            //start2
            mark6_61 != '×'&&mark6_62 != '×'
            //end2
        ) && mark6_6 != '×')
        {// 通过
        }
        else{addstrtip('6_6结论有误！')}
        if(mark6_62!='-')
        {
            //addstrtip('6_6TIP:有应急导向装置！TIP')
            strinput=strinput+'有应急导向装置    '

        }
        else
        {
            //addstrtip('6_6TIP:无应急导向装置！TIP')
            strinput=strinput+'无应急导向装置    '
        }

        var mark6_7 = document.getElementById('1622638354288fda8').textContent.trim().slice(-1)
        var mark6_71 = document.getElementById('1622638204105eab1').textContent.trim().slice(-1)
        var mark6_72 = document.getElementById('1622638207327fb89').textContent.trim().slice(-1)
        fenxiangs.push(mark6_71,mark6_72)
        fenxiangjlmap.set('mark6_6',mark6_6)
        fenxiangmap.set('mark6_71',mark6_71)
        fenxiangmap.set('mark6_72',mark6_72)
        if((//start1
            mark6_71 === '×'||mark6_72 === '×'
            //end1
        ) && mark6_7 === '×'||(
            //start2
            mark6_71 != '×'&&mark6_72 != '×'
            //end2
        ) && mark6_7 != '×')
        {// 通过
        }
        else{addstrtip('6_7结论有误！')}
        if(mark6_72!='-')
        {
            //addstrtip('6_7TIP:有重锤！TIP')
            strinput=strinput+'层门重锤   '
        }
        else
        {
            //addstrtip('6_7TIP:无重锤！TIP')
            strinput=strinput+'层门弹簧    '
        }


        var mark6_8 = document.getElementById('16226383542886641').textContent.trim().slice(-1)
        var mark6_81 = document.getElementById('16226382606541953').textContent.trim().slice(-1)
        fenxiangs.push(mark6_81)

        fenxiangjlmap.set('mark6_8',mark6_8)
        fenxiangmap.set('mark6_81',mark6_81)
        if((//start1
            mark6_81 === '×'
            //end1
        ) && mark6_8 === '×'||(
            //start2
            mark6_81 != '×'
            //end2
        ) && mark6_8 != '×')
        {// 通过
        }
        else{addstrtip('6_8结论有误！')}

        var mark6_9 = document.getElementById('1622639394954209c').textContent.trim().slice(-1)
        var mark6_9_11 = document.getElementById('1622638586665a192').textContent.trim().slice(-1)
        var mark6_9_12 = document.getElementById('1622639678761fb39').textContent.trim().slice(-1)
        var mark6_9_13 = document.getElementById('16226385820419dbf').textContent.trim().slice(-1)
        var mark6_9_14 = document.getElementById('16226385890643af8').textContent.trim().slice(-1)
        var mark6_9_2 = document.getElementById('1622638663794bf17').textContent.trim().slice(-1)
        fenxiangs.push(mark6_9_11,mark6_9_12,mark6_9_13,mark6_9_14,mark6_9_2)

        fenxiangjlmap.set('mark6_9',mark6_9)
        fenxiangmap.set('mark6_9_11',mark6_9_11)
        fenxiangmap.set('mark6_9_12',mark6_9_12)
        fenxiangmap.set('mark6_9_13',mark6_9_13)
        fenxiangmap.set('mark6_9_14',mark6_9_14)
        fenxiangmap.set('mark6_9_2',mark6_9_2)
        if((//start1
            mark6_9_11 === '×'||mark6_9_12 === '×'||mark6_9_13 === '×'||mark6_9_14 === '×'
            ||mark6_9_2 === '×'
            //end1
        ) && mark6_9 === '×'||(
            //start2
            mark6_9_11 != '×'&&mark6_9_12 != '×'&&mark6_9_13 != '×'&&mark6_9_14 != '×'
            &&mark6_9_2 != '×'
            //end2
        ) && mark6_9 != '×')
        {// 通过
        }
        else{addstrtip('6_9结论有误！')}
        var floatnieheshendu=parseFloat(mark6_9_12)
        if(floatnieheshendu<7)
        {
            if(mark6_9!='×')
            {
                addstrtip('6_9结论有误！')
            }
        }

        var mark6_10 = document.getElementById('16226394303935eab').textContent.trim().slice(-1)
        var mark6_10_1 = document.getElementById('1622638686308c586').textContent.trim().slice(-1)
        var mark6_10_21 = document.getElementById('16226390388491270').textContent.trim().slice(-1)
        var mark6_10_22 = document.getElementById('16226390422715419').textContent.trim().slice(-1)
        fenxiangs.push(mark6_10_1,mark6_10_21,mark6_10_22)

        fenxiangjlmap.set('mark6_10',mark6_10)
        fenxiangmap.set('mark6_10_1',mark6_10_1)
        fenxiangmap.set('mark6_10_21',mark6_10_21)
        fenxiangmap.set('mark6_10_22',mark6_10_22)
        if((//start1
            mark6_10_1 === '×'
            ||mark6_10_21 === '×'||mark6_10_22 === '×'
            //end1
        ) && mark6_10 === '×'||(
            //start2
            mark6_10_1 != '×'
            &&mark6_10_21 != '×'&&mark6_10_22 != '×'
            //end2
        ) && mark6_10 != '×')
        {// 通过
        }
        else{addstrtip('6_10结论有误！')}

        var mark6_11 = document.getElementById('16226394303940599').textContent.trim().slice(-1)
        var mark6_11_1 = document.getElementById('162263907220764ef').textContent.trim().slice(-1)
        var mark6_11_2 = document.getElementById('162263910081611fa').textContent.trim().slice(-1)
        fenxiangs.push(mark6_11_1,mark6_11_2)

        fenxiangjlmap.set('mark6_11',mark6_11)
        fenxiangmap.set('mark6_11_1',mark6_11_1)
        fenxiangmap.set('mark6_11_2',mark6_11_2)
        if((//start1
            mark6_11_1 === '×'||mark6_11_2 === '×'
            //end1
        ) && mark6_11 === '×'||(
            //start2
            mark6_11_1 != '×'&&mark6_11_2 != '×'
            //end2
        ) && mark6_11 != '×')
        {// 通过
        }
        else{addstrtip('6_11结论有误！')}



        var mark6_12 = document.getElementById('1622639430394d0ba').textContent.trim().slice(-1)
        var mark6_121 = document.getElementById('16226842877452614').textContent.trim().slice(-1)
        var mark6_122 = document.getElementById('16226391246835b1d').textContent.trim().slice(-1)
        var mark6_123 = document.getElementById('162263912998791a4').textContent.trim().slice(-1)
        fenxiangs.push(mark6_121,mark6_122,mark6_123)

        fenxiangjlmap.set('mark6_12',mark6_12)
        fenxiangmap.set('mark6_121',mark6_121)
        fenxiangmap.set('mark6_122',mark6_122)
        fenxiangmap.set('mark6_123',mark6_123)
        if((//start1
            mark6_121 === '×'||mark6_122 === '×'||mark6_123 === '×'
            //end1
        ) && mark6_12 === '×'||(
            //start2
            mark6_121 != '×'&&mark6_122 != '×'&&mark6_123 != '×'
            //end2
        ) && mark6_12 != '×')
        {// 通过
        }
        else{addstrtip('6_12结论有误！')}
        var floatjianxi=parseFloat(mark6_121)
        if(floatjianxi<5)
        {
            if(mark6_12!='×')
            {
                addstrtip('6_12结论有误！')
            }
        }

        var mark7_1 = document.getElementById('16226394303959a82').textContent.trim().slice(-1)
        var mark7_1_2 = document.getElementById('16226391803070d4a').textContent.trim().slice(-1)
        var mark7_1_41 = document.getElementById('162263921827798f0').textContent.trim().slice(-1)
        var mark7_1_42 = document.getElementById('16226392211408b7f').textContent.trim().slice(-1)
        fenxiangs.push(mark7_1_2,mark7_1_41,mark7_1_42)

        fenxiangjlmap.set('mark7_1',mark7_1)
        fenxiangmap.set('mark7_1_2',mark7_1_2)
        fenxiangmap.set('mark7_1_41',mark7_1_41)
        fenxiangmap.set('mark7_1_42',mark7_1_42)
        if((//start1
            mark7_1_2 === '×'
            ||mark7_1_41 === '×'||mark7_1_42 === '×'
            //end1
        ) && mark7_1 === '×'||(
            //start2
            mark7_1_2 != '×'
            &&mark7_1_41 != '×'&&mark7_1_42 != '×'
            //end2
        ) && mark7_1 != '×')
        {// 通过
        }
        else{addstrtip('7_1结论有误！')}

        var mark7_2 = document.getElementById('1622639430395a8b4').textContent.trim().slice(-1)
        var mark7_2_2 = document.getElementById('1622639261534cd1f').textContent.trim().slice(-1)
        var mark7_2_3 = document.getElementById('16226392778878b6a').textContent.trim().slice(-1)
        fenxiangs.push(mark7_2_2,mark7_2_3)

        fenxiangjlmap.set('mark7_2',mark7_2)
        fenxiangmap.set('mark7_2_2',mark7_2_2)
        fenxiangmap.set('mark7_2_3',mark7_2_3)
        if((//start1
            mark7_2_2 === '×'||mark7_2_3 === '×'
            //end1
        ) && mark7_2 === '×'||(
            //start2
            mark7_2_2 != '×'&&mark7_2_3 != '×'
            //end2
        ) && mark7_2 != '×')
        {// 通过
        }
        else{addstrtip('7_2结论有误！')}

        var mark7_3 = document.getElementById('1622685445263274c').textContent.trim().slice(-1)
        var mark7_3_1 = document.getElementById('1622684171810731e').textContent.trim().slice(-1)
        var mark7_3_2 = document.getElementById('16226842512489be4').textContent.trim().slice(-1)
        var mark7_3_3 = document.getElementById('1622684265094c62a').textContent.trim().slice(-1)
        var mark7_3_4 = document.getElementById('16226842859320478').textContent.trim().slice(-1)
        var mark7_3_51 = document.getElementById('16226843235779e56').textContent.trim().slice(-1)
        var mark7_3_52 = document.getElementById('16226843296712c53').textContent.trim().slice(-1)
        fenxiangs.push(mark7_3_1,mark7_3_2,mark7_3_3,mark7_3_4,mark7_3_51,mark7_3_52)

        fenxiangjlmap.set('mark7_3',mark7_3)
        fenxiangmap.set('mark7_3_1',mark7_3_1)
        fenxiangmap.set('mark7_3_2',mark7_3_2)
        fenxiangmap.set('mark7_3_3',mark7_3_3)
        fenxiangmap.set('mark7_3_4',mark7_3_4)
        fenxiangmap.set('mark7_3_51',mark7_3_51)
        fenxiangmap.set('mark7_3_52',mark7_3_52)
        if((//start1
            mark7_3_1 === '×'||mark7_3_2 === '×'||mark7_3_3 === '×'||mark7_3_4 === '×'
            ||mark7_3_51 === '×'||mark7_3_52 === '×'
            //end1
        ) && mark7_3 === '×'||(
            //start2
            mark7_3_1 != '×'&&mark7_3_2 != '×'&&mark7_3_3 != '×'&&mark7_3_4 != '×'
            &&mark7_3_51 != '×'&&mark7_3_52 != '×'
            //end2
        ) && mark7_3 != '×')
        {// 通过
        }
        else{addstrtip('7_3结论有误！')}

        var mark7_4 = document.getElementById('162268546947068e2').textContent.trim().slice(-1)
        var mark7_4_21 = document.getElementById('16226851922861e1c').textContent.trim().slice(-1)
        var mark7_4_22 = document.getElementById('1622685206789f8f0').textContent.trim().slice(-1)
        fenxiangs.push(mark7_4_21,mark7_4_22)

        fenxiangjlmap.set('mark7_4',mark7_4)
        fenxiangmap.set('mark7_4_21',mark7_4_21)
        fenxiangmap.set('mark7_4_22',mark7_4_22)
        if((//start1
            mark7_4_21 === '×'||mark7_4_22 === '×'
            //end1
        ) && mark7_4 === '×'||(
            //start2
            mark7_4_21 != '×'&&mark7_4_22 != '×'
            //end2
        ) && mark7_4 != '×')
        {// 通过
        }
        else{addstrtip('7_4结论有误！')}

        var mark8_1 = document.getElementById('16226854694716f9c').textContent.trim().slice(-1)
        var mark8_11 = document.getElementById('1622685238550d9b4').textContent.trim().slice(-1)
        var mark8_12 = document.getElementById('1622685248535ba95').textContent.trim().slice(-1)
        fenxiangs.push(mark8_11,mark8_12)

        fenxiangjlmap.set('mark8_1',mark8_1)
        fenxiangmap.set('mark8_11',mark8_11)
        fenxiangmap.set('mark8_12',mark8_12)
        if((//start1
            mark8_11 === '×'||mark8_12 === '×'
            //end1
        ) && mark8_1 === '×'||(
            //start2
            mark8_11 != '×'&&mark8_12 != '×'
            //end2
        ) && mark8_1 != '×')
        {// 通过
        }
        else{addstrtip('8_1结论有误！')}
        if(mark8_11==='√')
        {
            addstrtip('8_1 注意平衡系数勾选须附实测表！')

        }
        if(mark8_11!='-'&&mark8_12!='-')
        {
            addstrtip('8_1 注意平衡系数勾选矛盾！')
        }

        var mark8_2 = document.getElementById('1622685469471afb2').textContent.trim().slice(-1)
        var mark8_21 = document.getElementById('1622685283233ed3a').textContent.trim().slice(-1)
        var mark8_22 = document.getElementById('162268530383776c9').textContent.trim().slice(-1)
        var mark8_23 = document.getElementById('16226853242494543').textContent.trim().slice(-1)
        fenxiangs.push(mark8_21,mark8_22,mark8_23)

        fenxiangjlmap.set('mark8_2',mark8_2)
        fenxiangmap.set('mark8_21',mark8_21)
        fenxiangmap.set('mark8_22',mark8_22)
        fenxiangmap.set('mark8_23',mark8_23)
        if((//start1
            mark8_21 === '×'||mark8_22 === '×'||mark8_23 === '×'
            //end1
        ) && mark8_2 === '×'||(
            //start2
            mark8_21 != '×'&&mark8_22 != '×'&&mark8_23 != '×'
            //end2
        ) && mark8_2 != '×')
        {// 通过
        }
        else{addstrtip('8_2结论有误！')}
        if(mark8_21 === '-'&&mark8_22 === '-'&&mark8_23 === '-'&& mark8_2 === '-')
        {
            //addstrtip('8_2TIP:无上行超速保护！TIP')
            strinput=strinput+'无上行超速保护    '
        }
        else if(mark8_21 === '√'&&mark8_22 === '√'&&mark8_23 === '√'&& mark8_2 === '√')
        {
            //addstrtip('8_2TIP:有上行超速保护！TIP')
            strinput=strinput+'有上行超速保护    '
        }
        else
        {
            //addstrtip('8_2TIP:上行超速保护部分勾选！TIP')
            strinput=strinput+'上行超速保护部分勾选    '
        }

        var mark8_3 = document.getElementById('16226854694724e3f').textContent.trim().slice(-1)
        var mark8_3_1 = document.getElementById('162268533977528e8').textContent.trim().slice(-1)
        var mark8_3_2 = document.getElementById('1622685411625937c').textContent.trim().slice(-1)
        fenxiangs.push(mark8_3_1,mark8_3_2)

        fenxiangjlmap.set('mark8_3',mark8_3)
        fenxiangmap.set('mark8_3_1',mark8_3_1)
        fenxiangmap.set('mark8_3_2',mark8_3_2)
        if((//start1
            mark8_3_1 === '×'||mark8_3_2 === '×'
            //end1
        ) && mark8_3 === '×'||(
            //start2
            mark8_3_1 != '×'&&mark8_3_2 != '×'
            //end2
        ) && mark8_3 != '×')
        {// 通过
        }
        else{addstrtip('8_3结论有误！')}
        if(sbpz.trim()==='曳引驱动载货电梯')
        {
            if(mark8_3_2!= '-')
            {
                addstrtip('若是蜗轮蜗杆，mark8_3_2应为无此项！')
            }
        }

        var mark8_4 = document.getElementById('1622685469473a26c').textContent.trim().slice(-1)
        var mark8_41 = document.getElementById('16226854288022ceb').textContent.trim().slice(-1)
        fenxiangs.push(mark8_41)

        fenxiangjlmap.set('mark8_4',mark8_4)
        fenxiangmap.set('mark8_41',mark8_41)
        if((//start1
            mark8_41 === '×'
            //end1
        ) && mark8_4 === '×'||(
            //start2
            mark8_41 != '×'
            //end2
        ) && mark8_4 != '×')
        {// 通过
        }
        else{addstrtip('8_4结论有误！')}

        var mark8_5 = document.getElementById('16226844581925544').textContent.trim().slice(-1)
        var mark8_51 = document.getElementById('16226845381934d39').textContent.trim().slice(-1)
        fenxiangs.push(mark8_51)

        fenxiangjlmap.set('mark8_5',mark8_5)
        fenxiangmap.set('mark8_51',mark8_51)
        if((//start1
            mark8_51 === '×'
            //end1
        ) && mark8_5 === '×'||(
            //start2
            mark8_51 != '×'
            //end2
        ) && mark8_5 != '×')
        {// 通过
        }
        else{addstrtip('8_5结论有误！')}

        var mark8_6 = document.getElementById('1622684530916bc34').textContent.trim().slice(-1)
        var mark8_61 = document.getElementById('1622684569486b4c6').textContent.trim().slice(-1)
        var mark8_62 = document.getElementById('16226845860186f33').textContent.trim().slice(-1)
        fenxiangs.push(mark8_61,mark8_62)

        fenxiangjlmap.set('mark8_6',mark8_6)
        fenxiangmap.set('mark8_61',mark8_61)
        fenxiangmap.set('mark8_62',mark8_62)
        if((//start1
            mark8_61 === '×'||mark8_62 === '×'
            //end1
        ) && mark8_6 === '×'||(
            //start2
            mark8_61 != '×'&&mark8_62 != '×'
            //end2
        ) && mark8_6 != '×')
        {// 通过
        }
        else{addstrtip('8_6结论有误！')}
        if(mark8_62!='-')
        {
            //addstrtip('8_6TIP:有IC卡！TIP')
            strinput=strinput+'有IC卡   '
        }
        else
        {
            //addstrtip('8_6TIP:无IC卡！TIP')
            strinput=strinput+'无IC卡   '
        }


        var mark8_7 = document.getElementById('1622684530917ef14').textContent.trim().slice(-1)
        var mark8_7_1 = document.getElementById('162268460340395da').textContent.trim().slice(-1)
        var mark8_7_2 = document.getElementById('1622684621848108e').textContent.trim().slice(-1)
        var mark8_7_3 = document.getElementById('16226846429187b73').textContent.trim().slice(-1)
        fenxiangs.push(mark8_7_1,mark8_7_2,mark8_7_3)

        fenxiangjlmap.set('mark8_7',mark8_7)
        fenxiangmap.set('mark8_7_1',mark8_7_1)
        fenxiangmap.set('mark8_7_2',mark8_7_2)
        fenxiangmap.set('mark8_7_3',mark8_7_3)
        if((//start1
            mark8_7_1 === '×'||mark8_7_2 === '×'||mark8_7_3 === '×'
            //end1
        ) && mark8_7 === '×'||(
            //start2
            mark8_7_1 != '×'&&mark8_7_2 != '×'&&mark8_7_3 != '×'
            //end2
        ) && mark8_7 != '×')
        {// 通过
        }
        else{addstrtip('8_7结论有误！')}


        var mark8_9 = document.getElementById('16304802871259247').textContent.trim().slice(-1)
        var mark8_91 = document.getElementById('1630480334863dd9e').textContent.trim().slice(-1)
        fenxiangs.push(mark8_91)

        fenxiangjlmap.set('mark8_9',mark8_9)
        fenxiangmap.set('mark8_91',mark8_91)
        if((//start1
            mark8_91 === '×'
            //end1
        ) && mark8_9 === '×'||(
            //start2
            mark8_91 != '×'
            //end2
        ) && mark8_9 != '×')
        {// 通过
        }
        else{addstrtip('8_9结论有误！')}


        var mark8_10 = document.getElementById('16226845309184003').textContent.trim().slice(-1)
        var mark8_101 = document.getElementById('1622684662344d3af').textContent.trim().slice(-1)
        fenxiangs.push(mark8_101)

        fenxiangjlmap.set('mark8_10',mark8_10)
        fenxiangmap.set('mark8_101',mark8_101)
        if((//start1
            mark8_101 === '×'
            //end1
        ) && mark8_10 === '×'||(
            //start2
            mark8_101 != '×'
            //end2
        ) && mark8_10 != '×')
        {// 通过
        }
        else{addstrtip('8_10结论有误！')}

        //与mark8_11冲突，此处取为mark8_11_
        var mark8_11_ = document.getElementById('162268453091883ad').textContent.trim().slice(-1)
        var mark8_111 = document.getElementById('1622684679176a5b2').textContent.trim().slice(-1)
        fenxiangs.push(mark8_111)

        fenxiangjlmap.set('mark8_11_',mark8_11_)
        fenxiangmap.set('mark8_111',mark8_111)
        if((//start1
            mark8_111 === '×'
            //end1
        ) && mark8_11_ === '×'||(
            //start2
            mark8_111 != '×'
            //end2
        ) && mark8_11_ != '×')
        {// 通过
        }
        else{addstrtip('8_11结论有误！')}

        //与mark8_12冲突，此处取为mark8_12_
        var mark8_12_ = document.getElementById('1622684530919d5cf').textContent.trim().slice(-1)
        var mark8_121 = document.getElementById('1622684709087d08e').textContent.trim().slice(-1)
        var mark8_122 = document.getElementById('16226847404085b59').textContent.trim().slice(-1)
        var mark8_123 = document.getElementById('16226847876683939').textContent.trim().slice(-1)
        fenxiangs.push(mark8_121,mark8_122,mark8_123)

        fenxiangjlmap.set('mark8_12_',mark8_12_)
        fenxiangmap.set('mark8_121',mark8_121)
        fenxiangmap.set('mark8_122',mark8_122)
        fenxiangmap.set('mark8_123',mark8_123)
        if((//start1
            mark8_121 === '×'||mark8_122 === '×'||mark8_123 === '×'
            //end1
        ) && mark8_12_ === '×'||(
            //start2
            mark8_121 != '×'&&mark8_122 != '×'&&mark8_123 != '×'
            //end2
        ) && mark8_12_ != '×')
        {// 通过
        }
        else{addstrtip('8_12结论有误！')}

        var mark8_13 = document.getElementById('162268453092073fe').textContent.trim().slice(-1)
        var mark8_131 = document.getElementById('1622684834199c264').textContent.trim().slice(-1)
        fenxiangs.push(mark8_131)

        fenxiangjlmap.set('mark8_13',mark8_13)
        fenxiangmap.set('mark8_131',mark8_131)
        if((//start1
            mark8_131 === '×'
            //end1
        ) && mark8_13 === '×'||(
            //start2
            mark8_131 != '×'
            //end2
        ) && mark8_13 != '×')
        {// 通过
        }
        else{addstrtip('8_13结论有误！')}
        //下次制动是否勾选
        var betmonths=(gkxiacizhidongshijiandate.getFullYear()-curyear)*12+(gkxiacizhidongshijiandate.getMonth()-curmonth)+1
        if(betmonths>=59&&betmonths<=61)
        {
            addstrtip('下次制动时间与当前相隔5年左右，是否做制动试验并勾选8_13项！')
        }
        if(mark8_131!='-')
        {
            //addstrtip('8_13TIP:有制动！TIP')
            strinput=strinput+'有制动   '
        }
        else
        {
            //addstrtip('8_13TIP:无制动！TIP')
            strinput=strinput+'无制动   '
        }

        //input.value=strinput

        if((mark2_1_11!='-'||mark2_1_12!='-'||mark2_1_13!='-'||mark2_1_14!='-'//机房爬梯
            ||mark2_1_31!='-'||mark2_1_32!='-'||mark2_1_33!='-' //机房门
            ||mark2_7_51!='-'||mark2_7_52!='-'||mark2_7_53!='-'||mark2_7_54!='-'||mark2_7_55!='-'||mark2_7_56!='-')//盘车松闸
           &&(mark2_8_51 !='-'||mark2_8_52 !='-'||mark2_8_53 !='-'||mark2_8_54 !='-'//无机房紧急操作及动态测试装置
              ||mark7_1!='-'||mark7_2!='-'||mark7_3!='-'))
        {
            addstrtip('无机房与有机房项目同时勾选！')
        }
        //无机房项目校验，若不是无机房，通过使用登记编号判断是否为无机房
        if(mark7_1==='-'&&mark7_2==='-'&&mark7_3==='-')
        {
            if(mark2_1_31 === '-'&&mark2_1_32 === '-'&&mark2_1_33 === '-' )//机房门
            {
                addstrtip('无机房项目7与机房门同为无此项！')
            }
            if(mark2_8_51 !='-'||mark2_8_52 !='-'||mark2_8_53 !='-'||mark2_8_54 !='-')//无机房紧急操作及动态测试装置
            {
                addstrtip('无机房项目7与紧急操作及动态测试装置矛盾！')
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
            if(mark2_1_11!='-'||mark2_1_12!='-'||mark2_1_13!='-'||mark2_1_14!='-')//机房爬梯
            {
                addstrtip('无机房项目7与机房爬梯矛盾！')
            }
            if(mark2_1_31!='-'||mark2_1_32!='-'||mark2_1_33!='-' )//机房门
            {
                addstrtip('无机房项目7与机房门矛盾！')
            }
            if(mark2_7_51!='-'||mark2_7_52!='-'||mark2_7_53!='-'||mark2_7_54!='-'||mark2_7_55!='-'||mark2_7_56!='-')//盘车松闸
            {
                addstrtip('无机房项目7与盘车松闸矛盾！')
            }
            if(mark2_8_51 === '-'&&mark2_8_52 === '-'&&mark2_8_53 === '-'&&mark2_8_54 === '-')//无机房紧急操作及动态测试装置
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
        if(gkshebeipingzhong==='曳引驱动载货电梯')
        {
            if(!(gkxiacizhidongshijian==='-'||gkxiacizhidongshijian===''))
            {
                addstrtip('设备品种与下次制动时间矛盾！')
            }
            if(mark6_3_13==='-'&&mark6_3_14==='-'&&mark6_3_15==='-')//货梯没画货梯项目
            {
                addstrtip('设备品种与6_3项矛盾！')
            }
        }
        if(gkshebeipingzhong==='曳引驱动乘客电梯')
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
            if(mark4_6!='-'||mark4_6_21!='-'||mark4_6_22!='-'||mark4_6_23!='-')//超面积载货电梯
            {
                addstrtip('设备品种与4_6项矛盾！')
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
        //注意制造日期与轿门机械锁是否矛盾
        if(zhizaodate.getTime()>=date20171001.getTime())
        {
            if(mark3_75=== '-'&& mark6_9_2=== '-'&&mark6_11_1=== '-'&&mark6_11_2=== '-')
            {
                addstrtip('注意制造日期与轿门机械锁、轿门开门限制是否矛盾！')
            }
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

        //注意是否限速器一年一次校验
//         if(curyear-gkjiandujianyanriqidate.getFullYear()>=15&&mark2_9_42==='-')
//         {
//             addstrtip('注意限速器是否一年一次校验！')
//         }
//         if(curyear-gkjiandujianyanriqidate.getFullYear()<15&&mark2_9_42!='-')
//         {
//             addstrtip('注意限速器是否两年一次校验！')
//         }
        if(mark2_9_42!='-')//一年一次校验
        {
            if(gkxiansuqixiaciriqidate.getFullYear()-jyrqdate.getFullYear()!=1)
            {
                addstrtip('限速器下次校验日期与2_9_4项目矛盾！')
            }
        }
        //注意是否限速器两年一次校验
//         if((curyear-gkjiandujianyanriqidate.getFullYear())%2===0)
//         {
//             addstrtip('注意限速器是否两年一次校验,附校验记录！')
//         }
        //限速器校验年限互斥
        if(!((mark2_9_41==='-'&&mark2_9_42!='-')||(mark2_9_42==='-'&&mark2_9_41!='-')))
        {
            addstrtip('2_9_4项目矛盾！')
        }
        //3.7轿门机械锁与井道壁距离互斥
        if(!((mark3_71==='-'&&mark3_72==='-'&&mark3_75!='-')||(mark3_71!='-'&&mark3_72!='-'&&mark3_75==='-')))
        {
            addstrtip('3_7项目矛盾！')
        }
        //验证使用登记证编号
        if(gkshiyongdengji.length!=20&&gkshiyongdengji.length!=14)
        {
            addstrtip('使用登记证编号位数错误！')
        }
        else
        {
            if(gkshiyongdengji.length===20)
            {
                yanzhengshiyongdengjihaoold(gkshiyongdengji)
            }
            if(gkshiyongdengji.length===14)
            {
//                 if(gkjiandujianyanriqidate.getTime<date20180101.getTime())
//                 {
//                     addstrtip('注意使用登记证编号是否合理！')
//                 }
//                 else
//                 {
//                     yanzhengshiyongdengjihaonew(gkshiyongdengji)
//                 }
            }
        }

        if ((mark1_4 === '×'||mark2_1 === '×'||mark2_5_1 === '×'
             ||mark2_6_2 === '×'||mark2_7 === '×'||mark2_8 === '×'||mark2_9 === '×'||mark2_10_2 === '×'||mark2_11 === '×'
             ||mark3_4 === '×'||mark3_5 === '×'||mark3_7 === '×'
             ||mark3_10 === '×'||mark3_11 === '×'||mark3_12 === '×'
             ||mark3_14 === '×'||mark3_15 === '×'||mark4_1 === '×'
             ||mark4_3 === '×'||mark4_5 === '×'||mark4_6 === '×'
             ||mark4_8=== '×'||mark4_9 === '×'||mark4_10 === '×'
             ||mark5_1 === '×'||mark5_2 === '×'||mark5_3 === '×'
             ||mark5_5 === '×'||mark5_6 === '×'||mark6_3 === '×'
             ||mark6_4 === '×'||mark6_5 === '×'||mark6_6 === '×'
             ||mark6_7 === '×'||mark6_8 === '×'||mark6_9 === '×'
             ||mark6_10 === '×'||mark6_11 === '×'||mark6_12 === '×'
             ||mark7_1 === '×'||mark7_2 === '×'||mark7_3 === '×'
             ||mark7_4 === '×'||mark8_1 === '×'||mark8_2 === '×'
             ||mark8_3 === '×'||mark8_4 === '×'||mark8_5 === '×'
             ||mark8_6 === '×'||mark8_7 === '×'||mark8_9 === '×'
             ||mark8_10 === '×'||mark8_11 === '×'||mark8_12 === '×'
             ||mark8_13 === '×'
            ) &&(jljianyanjielun==='合格'||jljianyanjielun==='复检合格') ||
            (mark1_4 != '×'&&mark2_1 != '×'&&mark2_5_1 != '×'
             &&mark2_6_2 != '×'&&mark2_7 != '×'&&mark2_8 != '×'&&mark2_9 != '×'&&mark2_10_2 != '×'&&mark2_11 != '×'
             &&mark3_4 != '×'&&mark3_5 != '×'&&mark3_7 != '×'
             &&mark3_10 != '×'&&mark3_11 != '×'&&mark3_12 != '×'
             &&mark3_14 != '×'&&mark3_15 != '×'&&mark4_1 != '×'
             &&mark4_3 != '×'&&mark4_5 != '×'&&mark4_6 != '×'
             &&mark4_8 != '×'&&mark4_9 != '×'&&mark4_10 != '×'
             &&mark5_1 != '×'&&mark5_2 != '×'&&mark5_3 != '×'
             &&mark5_5 != '×'&&mark5_6 != '×'&&mark6_3 != '×'
             &&mark6_4 != '×'&&mark6_5 != '×'&&mark6_6 != '×'
             &&mark6_7 != '×'&&mark6_8 != '×'&&mark6_9 != '×'
             &&mark6_10 != '×'&&mark6_11 != '×'&&mark6_12 != '×'
             &&mark7_1 != '×'&&mark7_2 != '×'&&mark7_3 != '×'
             &&mark7_4 != '×'&&mark8_1 != '×'&&mark8_2 != '×'
             &&mark8_3 != '×'&&mark8_4 != '×'&&mark8_5 != '×'
             &&mark8_6 != '×'&&mark8_7 != '×'&&mark8_9 != '×'
             &&mark8_10 != '×'&&mark8_11 != '×'&&mark8_12 != '×'
             &&mark8_13!= '×'
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
               &&gkshebeipingzhong==='曳引驱动载货电梯')
            {
                addstrtip('使用登记证编号与概况中设备品种不一致！')
            }
            if(gkshiyongdengji.substr(0,4)!=sbfenleimap.get('曳引式客梯')
               &&gkshiyongdengji.substr(0,4)!=sbfenleimap.get('无机房客梯')
               &&gkshiyongdengji.substr(0,4)!=sbfenleimap.get('观光客梯')
               &&gkshiyongdengji.substr(0,4)!=sbfenleimap.get('病床客梯')
               &&gkshebeipingzhong==='曳引驱动乘客电梯')
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
            if(!(/*dengjiriqidate.getTime()>=gkjiandujianyanriqidate.getTime()&&*/parseInt(gkshiyongdengji.substr(10,4))<2018 ))
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
               &&gkshebeipingzhong==='曳引驱动载货电梯')
            {
                addstrtip('使用登记证编号与概况中设备品种不一致！')
            }
            if(gkshiyongdengji.substr(1,2)!=sbtezhengdaihaomap.get('曳引驱动乘客电梯')
               &&gkshebeipingzhong==='曳引驱动乘客电梯')
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

//             var cur =parseInt(curyear.toString().substr(2,2))
//             //var jianduyear =parseInt(gkjiandujianyanriqidate.getFullYear().toString().substr(2,2))
//             var dengjiyear=parseInt(gkshiyongdengji.substr(11,2))
//             if(!(dengjiyear<=cur&&dengjiyear>=jianduyear))
//             {
//                 addstrtip('使用登记证号登记年份与监督检验年份矛盾，且不能超过当前日期！')
//             }

        }
        //概况信息


        //显示提示信息
        if(strtip.trim()==='')
        {
            strtip='未发现问题'
        }
        //alert(strtip)
        input.value=strtip+'\n\n'+strinput+'\n\n'+strreport
        strtip=''
        strinput=''
        strreport=''
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


//                 if(parseInt(gkshiyongdengji.substr(11,2))>cur||parseInt(gkshiyongdengji.substr(11,2))<parseInt(gkjiandujianyanriqidate.getFullYear().toString().substr(2,2)))
//                 {

//                     addstrtip('注意使用登记证号登记年份是否合理！')
//                 }
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
//             if(isNormalInteger(gkshiyongdengji.substr(10,6)))
//             {
//                 if(parseInt(gkshiyongdengji.substr(10,4))>=gkjiandujianyanriqidate.getFullYear()&&parseInt(gkshiyongdengji.substr(10,4))<2018
//                    &&parseInt(gkshiyongdengji.substr(14,2))>0&&parseInt(gkshiyongdengji.substr(14,2))<=12)
//                 {
//                     nianyueright=true
//                 }
//             }
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
    function ZifuchuanIsDate(strdate)
    {
        //isNaN(strdate)返回为false则是日期格式；排除data为纯数字的情况（此处不考虑只有年份的日期，如‘2020）
        if(isNaN(strdate)&&!isNaN(Date.parse(strdate)))
        {
            return true
        }else{
            return false
        }
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