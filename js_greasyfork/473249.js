// ==UserScript==
// @name         天扬网络自动答题
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  获取题目信息，自动答题
// @author       kakasearch
// @match        http://www.tianyangtax.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @connect      localhost
// @connect      127.0.0.1
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473249/%E5%A4%A9%E6%89%AC%E7%BD%91%E7%BB%9C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/473249/%E5%A4%A9%E6%89%AC%E7%BD%91%E7%BB%9C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

var api = "http://localhost:25912/submit"

function submit(data){
    GM_xmlhttpRequest({
        method: 'POST',
        url: api,
        data:JSON.stringify(data),
        headers: {
            'referer':location.href,
            'Content-type': 'application/json',
            "connection":"close"
        },
        timeout: 5000,
        onload: function(xhr) {
            if (xhr.status == 200) {
                var obj = JSON.parse(xhr.responseText) || {};
                console.log(obj);
                if(obj.code==0){
                    new ElegantAlertBox("上传成功")
                }
            }
        },
        ontimeout: function() {
            //
        },
        onerror:function(){
            new ElegantAlertBox("上传失败，服务器错误！！")
        }
    });
}
var datas = {
    "question1433579": {
        "id": "question1433579",
        "stem": "配置混凝土时，选用的粗骨料最大粒径不得超过钢筋最小间距的()。",
        "choices": "A.\n1/4\nB.\n1/2\nC.\n2/3\nD.\n3/4",
        "result": "D"
    },
    "question1433580": {
        "id": "question1433580",
        "stem": "抗渗性要求较高且要求早强的防水工程，拌制混凝土时应掺加()。",
        "choices": "A.\n减水剂\nB.\n密实剂\nC.\n膨胀剂\nD.\n速凝剂",
        "result": "B"
    },
    "question1433582": {
        "id": "question1433582",
        "stem": "某基坑要求降水深度22m，土的渗透系数为100m/d，采用井点降水时宜选用()。",
        "choices": "A.\n管井井点\nB.\n深井井点\nC.\n喷射井点\nD.\n一级轻型井点",
        "result": "B"
    },
    "question1433583": {
        "id": "question1433583",
        "stem": "关于拱型可缩性支架安装的说法，正确的是( )。",
        "choices": "A.\n节间卡箍处可增加楔子以增大摩擦力\nB.\n采用专用扳手，尽可能拧紧卡箍螺栓\nC.\n安装到位后直接将节间连接焊牢\nD.\n应采用扭力扳手按规定力矩拧紧节间螺栓",
        "result": "D"
    },
    "question1433584": {
        "id": "question1433584",
        "stem": "不宜冬期施工的项目（）。",
        "choices": "A.\n含水流动性开挖\nB.\n河滩地段开挖\nC.\n整修路基边坡\nD.\n岩石地段的路堑开挖",
        "result": "C"
    },
    "question1433585": {
        "id": "question1433585",
        "stem": "热拌沥青碎石配合比设计采用（）设计。",
        "choices": "A.\n正交试验\nB.\n针入度试验\nC.\n马歇尔试验\nD.\n洛杉矶磨耗试验",
        "result": "C"
    },
    "question1433586": {
        "id": "question1433586",
        "stem": "关于预应力钢筋混凝土拆模说法错误的是（）。",
        "choices": "A.\n承包人应在拟定拆模时间的12h以前，并应取得监理工程师同意\nB.\n非承重侧模板应在混凝土强度，设计未规定达到2.5MPa时方可拆除侧模板\nC.\n钢筋混凝土结构的承重模板、支架，应在混凝土强度能承受其自重荷载及其他可能的叠加荷载时，方可拆除\nD.\n预应力混凝土结构，其侧模、底模及支架在结构建立预应力后即可拆除",
        "result": "D"
    },
    "question1433588": {
        "id": "question1433588",
        "stem": "关于先张法预制梁板说法错误的是（）。",
        "choices": "A.\n钢横梁受力后，挠度不能大于2mm\nB.\n对热轧带肋钢筋，可采用乙炔一氧气切割\nC.\n同一构件内预应力钢丝、钢绞线的断丝数量不得超过1%\nD.\n其位置与设计位置的偏差应不大于10cm",
        "result": "D"
    },
    "question1433590": {
        "id": "question1433590",
        "stem": "山区公路中,雨期路基施工地段不宜选择()。",
        "choices": "A.\n砂类士地段\nB.\n路堑的弃方地段\nC.\n碎砾石地段\nD.\n重黏土地段",
        "result": "D"
    },
    "question1433592": {
        "id": "question1433592",
        "stem": "使用滑模摊铺机进行水泥混凝土路面施工的路面是()。",
        "choices": "A.\n纵坡大于5%的上坡路段\nB.\n纵坡大于6%的下坡路段\nC.\n平面半径为50mm~100mm的平曲线路段\nD.\n超高横坡大于7%的路段",
        "result": "C"
    },
    "question1433593": {
        "id": "question1433593",
        "stem": "预应力张拉的千斤顶与压力表,不需要重新标定的情形是()。",
        "choices": "A.\n使用时间达到3个月\nB.\n张拉次数超过300次\nC.\n千斤顶检修后\nD.\n更换新压力表",
        "result": "A"
    },
    "question1433594": {
        "id": "question1433594",
        "stem": "关于特大桥、隧道、拌合站和预制场等进出口便道200m范围宜采用的路面的说法,正确的是()。",
        "choices": "A.\n预制场进出口宜釆用泥结碎石路面\nB.\n隧道洞口宜釆用洞渣铺筑的路面\nC.\n特大桥进出便道路面宜采用不小于20m厚C20混凝土路面\nD.\n拌合站进出口宜采用级配碎石路面",
        "result": "C"
    },
    "question1433595": {
        "id": "question1433595",
        "stem": "下列施工机械中,属于隧道施工专用设备的是()。",
        "choices": "A.\n轴流风机\nB.\n装载机\nC.\n凿岩台机\nD.\n混凝土喷射机",
        "result": "C"
    },
    "question1433596": {
        "id": "question1433596",
        "stem": "下列大型临时工程中。需编制专项施工方案且需专家论证,审查的是()。",
        "choices": "A.\n水深5m围堰工程\nB.\n便桥\nC.\n临时码头\nD.\n猫道",
        "result": "D"
    },
    "question1433597": {
        "id": "question1433597",
        "stem": "钻孔灌注桩施工中，钻孔至设计孔深后，其紧后工序是()。",
        "choices": "A.\n下放导管\nB.\n清孔\nC.\n钢筋笼制作及安放\nD.\n灌注水下混凝土",
        "result": "B"
    },
    "question1433602": {
        "id": "question1433602",
        "stem": "下列分项工程中,应进行隐蔽验收的是()工程。",
        "choices": "A.\n支架搭设\nB.\n基坑降水\nC.\n基础钢筋\nD.\n基础模板",
        "result": "C"
    },
    "question1433603": {
        "id": "question1433603",
        "stem": "预制桩的接桩不宜使用的连接方法是()。",
        "choices": "A.\n焊接\nB.\n法兰连接\nC.\n环氧类结构胶连接\nD.\n机械连接",
        "result": "C"
    },
    "question1433605": {
        "id": "question1433605",
        "stem": "适用于中砂以上的砂性土和有裂隙的岩石土层的注浆方法是()",
        "choices": "A.\n劈裂注浆\nB.\n渗透注浆\nC.\n压密注浆\nD.\n电动化学注浆",
        "result": "B"
    },
    "question1433606": {
        "id": "question1433606",
        "stem": "主要材料可反复使用，止水性好的基坑围护结构是()",
        "choices": "A.\n钢管桩\nB.\n灌注桩\nC.\nSMW工法桩\nD.\n型钢桩",
        "result": "C"
    },
    "question1433608": {
        "id": "question1433608",
        "stem": "基坑边坡坡度是直接影响基坑稳定的重要因素，当基坑边坡土体重的剪应力大于土体的()强度时，边坡就会失稳坍塌。",
        "choices": "A.\n抗扭\nB.\n抗拉\nC.\n抗压\nD.\n抗剪",
        "result": "D"
    },
    "question1433613": {
        "id": "question1433613",
        "stem": "地面横坡陡于1:5时，应按设计在原地面开挖台阶，台阶宽度不小于（）m。",
        "choices": "A.\n1.0\nB.\n2.0\nC.\n3.0\nD.\n4.0",
        "result": "B"
    },
    "question1433615": {
        "id": "question1433615",
        "stem": "刚性路面主要代表是水泥混凝土路面，其破坏主要取决于（ ）。",
        "choices": "A.\n极限垂直变形\nB.\n极限弯拉应变\nC.\n极限弯拉强度\nD.\n极限剪切变形",
        "result": "C"
    },
    "question1433617": {
        "id": "question1433617",
        "stem": "道路结构中起承重层作用的结构层是（ ）",
        "choices": "A.\n面层\nB.\n基层\nC.\n垫层\nD.\n路基",
        "result": "B"
    },
    "question1433620": {
        "id": "question1433620",
        "stem": "基层材料应根据道路交通等级和路基（ ）来选择。",
        "choices": "A.\n承载能力\nB.\n抗冲刷能力\nC.\n变形协调能力\nD.\n抗弯能力",
        "result": "B"
    },
    "question1433622": {
        "id": "question1433622",
        "stem": "沥青路面必须满足设计年限的使用需要，具有足够（ ）破坏和塑性变形的能力。",
        "choices": "A.\n抗冲刷\nB.\n抗冲击\nC.\n抗疲劳\nD.\n抗剪切",
        "result": "C"
    },
    "question1433623": {
        "id": "question1433623",
        "stem": "桩基混凝土灌注完成后，需进行（）方面检测并合格后，方可进行下一步施工。",
        "choices": "A.\n中心偏位、混凝土完整性\nB.\n平整度、预留孔\nC.\n预埋件、倾斜度\nD.\n垂直度、断面尺寸",
        "result": "A"
    },
    "question1433625": {
        "id": "question1433625",
        "stem": "采用常规压浆工艺的后张法预应力混凝土梁施工中，曲线预应力孔道最低部位应设置（ ）",
        "choices": "A.\n压浆孔\nB.\n溢浆孔\nC.\n排气孔\nD.\n排水孔",
        "result": "D"
    },
    "question1433627": {
        "id": "question1433627",
        "stem": "下列指标中，不属于沥青路面使用指标的是（ ）。",
        "choices": "A.\n透水性\nB.\n变形量\nC.\n平整度\nD.\n承载能力",
        "result": "B"
    },
    "question1433630": {
        "id": "question1433630",
        "stem": "下列关于砌筑结构井室施工错误的是（）。",
        "choices": "A.\n砌筑前砌块应充分湿润，砌筑砂浆配合比符合设计要求\nB.\n排水管道检查井内的流槽应在井壁砌筑完成后进行砌筑\nC.\n收口砌筑时，应按设计要求的位置设置钢筋混凝土梁进行收口\nD.\n砌筑时应同时安装踏步，踏步安装后在砌筑未达到规定抗压强度前不得踩压",
        "result": "B"
    },
    "question1433631": {
        "id": "question1433631",
        "stem": "三种土压力中，土压力最小（ ）。",
        "choices": "A.\n主动土压力\nB.\n被动土压力\nC.\n静止土压力\nD.\n刚性土压力",
        "result": "A"
    },
    "question1433632": {
        "id": "question1433632",
        "stem": "水泥混凝土路面的纵向接缝是根据（ ）设置的。",
        "choices": "A.\n路面宽度\nB.\n施工铺筑宽度\nC.\n路面宽度及施工铺筑宽度\nD.\n单幅可变宽度",
        "result": "C"
    },
    "question1433634": {
        "id": "question1433634",
        "stem": "钢筋分批检验时，同一批号、同一炉罐号、同一尺寸的钢筋进行组批，每批的质量不宜大于（）t。",
        "choices": "A.\n30\nB.\n40\nC.\n50\nD.\n60",
        "result": "D"
    },
    "question1433635": {
        "id": "question1433635",
        "stem": "预应力原材料必须保持清洁，避免损伤、锈蚀。进场后的存放时间不宜超过（）个月，且宜存放在干燥、防潮、通风良好、无腐蚀气体和介质的仓库内。",
        "choices": "A.\n2\nB.\n4\nC.\n6\nD.\n8",
        "result": "C"
    },
    "question1433636": {
        "id": "question1433636",
        "stem": "预应力筋张拉前应根据设计要求对孔道的（）进行实测，以便确定张拉控制应力，并确定预应力筋的理论伸长值。",
        "choices": "A.\n摩阻损失\nB.\n直径\nC.\n强度\nD.\n长度",
        "result": "A"
    },
    "question1433638": {
        "id": "question1433638",
        "stem": "人工挖孔作业时，孔深大于（）m时，必须采取机械强制通风措施。",
        "choices": "A.\n5\nB.\n8\nC.\n9\nD.\n10",
        "result": "D"
    },
    "question1433639": {
        "id": "question1433639",
        "stem": "城镇道路分类方法有多种形式，无论如何分类，主要是满足道路的（）功能。",
        "choices": "A.\n服务\nB.\n交通运输\nC.\n生活\nD.\n货运",
        "result": "B"
    },
    "question1433642": {
        "id": "question1433642",
        "stem": "CFG桩施工桩页标高宜高出设计标高不少于（）cm。",
        "choices": "A.\n30\nB.\n40\nC.\n50\nD.\n60",
        "result": "C"
    },
    "question1433643": {
        "id": "question1433643",
        "stem": "地面横坡陡于1:5时，应按设计在原地面开挖台阶，台阶宽度不小于（）m。",
        "choices": "A.\n1.0\nB.\n2.0\nC.\n3.0\nD.\n4.0",
        "result": "B"
    },
    "question1433645": {
        "id": "question1433645",
        "stem": "钻孔灌注桩施工时，为防止扩孔，通常采取措施之一是（）。",
        "choices": "A.\n控制进尺速度\nB.\n部分回填黏性土\nC.\n全部回填黏性土\nD.\n上下反复提钻扫孔",
        "result": "A"
    },
    "question1433646": {
        "id": "question1433646",
        "stem": "水中圆形双墩柱桥梁的盖梁模板支架宜采用（）。",
        "choices": "A.\n扣件式钢管支架\nB.\n门式钢管支架\nC.\n钢抱箍析架\nD.\n碗扣式钢管支架",
        "result": "C"
    },
    "question1433647": {
        "id": "question1433647",
        "stem": "混凝土运输、浇筑及间歇的全部时间不应超过混凝土的（）。",
        "choices": "A.\n初凝时间\nB.\n终凝时间\nC.\n水化时间\nD.\n假凝时间",
        "result": "A"
    },
    "question1433649": {
        "id": "question1433649",
        "stem": "装配式桥的构件在脱底模、移运、存放和吊装时，混凝土的强度应不低于设计规定的吊装强度;设计未规定时，应不低于设计强度的（）。",
        "choices": "A.\n1\nB.\n0.8\nC.\n0.6\nD.\n0.5",
        "result": "B"
    },
    "question1433650": {
        "id": "question1433650",
        "stem": "桩身砼质量应均质、完整，应（）进行无损检测。",
        "choices": "A.\n全部\nB.\n0.02\nC.\n部分\nD.\n0.1",
        "result": "A"
    },
    "question1433651": {
        "id": "question1433651",
        "stem": "图纸会审先由（）组织技术和相关人员结合踏勘情况对施工图纸进行初审。",
        "choices": "A.\n设计单位\nB.\n监理单位\nC.\n建设单位\nD.\n项目总工",
        "result": "D"
    },
    "question1433653": {
        "id": "question1433653",
        "stem": "桩基混凝土灌注完成后，需进行（）方面检测并合格后，方可进行下一步施工。",
        "choices": "A.\n中心偏位、混凝土完整性\nB.\n平整度、预留孔\nC.\n预埋件、倾斜度\nD.\n垂直度、断面尺寸",
        "result": "A"
    },
    "question1433654": {
        "id": "question1433654",
        "stem": "某河道最高洪水位标高为2.3m，施工搭设土围堰最低标高为（）。",
        "choices": "A.\n2.5m\nB.\n2.8m\nC.\n3.3m\nD.\n4.8m",
        "result": "B"
    },
    "question1433656": {
        "id": "question1433656",
        "stem": "适用于各种地质条件的隧道地质超前预报方法是（）。",
        "choices": "A.\n超前钻探法\nB.\n地质调查法\nC.\n物理勘探法\nD.\n水力联系观测",
        "result": "B"
    },
    "question1433657": {
        "id": "question1433657",
        "stem": "下列施工工艺属于干作业成孔的是（）。",
        "choices": "A.\n地下连续墙\nB.\n人工挖孔桩\nC.\n冲击钻\nD.\n循环钻",
        "result": "B"
    },
    "question1433658": {
        "id": "question1433658",
        "stem": "在城市进行爆破施工，必须事先编制爆破方案，报城市主管部门批准，并经（）同意后方可施工。",
        "choices": "A.\n建设主管部门\nB.\n公安部门\nC.\n交通主管部门\nD.\n建设单位",
        "result": "B"
    },
    "question1433662": {
        "id": "question1433662",
        "stem": "管基有效支撑角范围应采用（）填充密实，与管壁紧密接触。",
        "choices": "A.\n原状土\nB.\n细砂\nC.\n中粗砂\nD.\n碎石",
        "result": "C"
    },
    "question1433663": {
        "id": "question1433663",
        "stem": "管道两侧和管顶以上（）m范围内胸腔夯实，应采用轻型压实机具。",
        "choices": "A.\n0.5\nB.\n1\nC.\n1.5\nD.\n2",
        "result": "A"
    },
    "question1433665": {
        "id": "question1433665",
        "stem": "预应力筋张拉前应根据设计要求对孔道的（）进行实测，以便确定张拉控制应力，并确定预应力筋的理论伸长值。",
        "choices": "A.\n摩阻损失\nB.\n直径\nC.\n强度\nD.\n长度",
        "result": "A"
    },
    "question1433667": {
        "id": "question1433667",
        "stem": "下列路基采用爆破施工的是（）。",
        "choices": "A.\n土质路堑\nB.\n石质路堑\nC.\n填土路堤\nD.\n填石路堤",
        "result": "B"
    },
    "question1433670": {
        "id": "question1433670",
        "stem": "根据《安全生产法》，国家对严重危及施工安全的工艺、设备实行（）制度。",
        "choices": "A.\n禁止生产\nB.\n销毁\nC.\n淘汰\nD.\n限制使用",
        "result": "C"
    },
    "question1433673": {
        "id": "question1433673",
        "stem": "灌注的桩顶高程应比设计高程高出不小于（ ）m。",
        "choices": "A.\n0.5\nB.\n1\nC.\n1.5\nD.\n2",
        "result": "A"
    },
    "question1433675": {
        "id": "question1433675",
        "stem": "边坡开挖中如遇到地下水涌出，应（）。",
        "choices": "A.\n先排水，后开挖\nB.\n先开挖，后排水\nC.\n边排水，边开挖\nD.\n开挖时不用排水",
        "result": "A"
    },
    "question1433677": {
        "id": "question1433677",
        "stem": "隧道围岩为 I〜III 级的中小跨度隧道，宜采用（ ）。",
        "choices": "A.\n全断面\nB.\n预留核心土法\nC.\n中导洞法\nD.\n双侧壁导坑法",
        "result": "A"
    },
    "question1433678": {
        "id": "question1433678",
        "stem": "隧道初期支护施工中，施工现场喷射混凝土的工艺中使用较多的是（ ）。",
        "choices": "A.\n干喷法\nB.\n潮喷法\nC.\n湿喷法\nD.\n混合喷射法",
        "result": "C"
    },
    "question1433679": {
        "id": "question1433679",
        "stem": "钻孔桩灌注水下混凝土必须连续施工，并控制提拔导管速度，严禁将导管提出（ ）。",
        "choices": "A.\n混凝土灌注面\nB.\n地下水面\nC.\n地面\nD.\n护筒顶面",
        "result": "A"
    },
    "question1433681": {
        "id": "question1433681",
        "stem": "钻孔灌注桩施工时，为防止扩孔，通常采取措施之一是（）。",
        "choices": "A.\n控制进尺速度\nB.\n部分回填黏性土\nC.\n全部回填黏性土\nD.\n上下反复提钻扫孔",
        "result": "A"
    },
    "question1433684": {
        "id": "question1433684",
        "stem": "地铁基坑采用的围护结构形式很多。其中强度大、开挖深度大，同时可兼做主体结构部分的围护结构是()。",
        "choices": "A.\n重力式水泥土挡墙\nB.\n地下连续墙\nC.\n预制混凝土板桩\nD.\nSMW工法桩",
        "result": "B"
    },
    "question1433685": {
        "id": "question1433685",
        "stem": "盾构接收施工，工序可分为①洞门清除、②到达段挺进、③接收基座安装与固定、④洞门密封安装、⑤盾构接收。施工程序正确的是()。",
        "choices": "A.\n①-③-④-②-⑤\nB.\n①-②-③-④-⑤\nC.\n①-④-②-③-⑤\nD.\n①-②-④-③-⑤",
        "result": "A"
    },
    "question1433686": {
        "id": "question1433686",
        "stem": "根据交通运输部《公路水路行业安全生产风险管理暂行办法》,公路水路行业安全生产风险是指生产经营过程中发生安全生产事故的（）。",
        "choices": "A.\n可能性\nB.\n必要性\nC.\n偶然性\nD.\n必然性",
        "result": "A"
    },
    "question1433687": {
        "id": "question1433687",
        "stem": "下列盾构类型中，属于密闭式盾构的是()",
        "choices": "A.\n泥土加压式盾构\nB.\n手掘式盾构\nC.\n半机械挖掘时盾构\nD.\n机械挖掘时盾构",
        "result": "A"
    },
    "question1433689": {
        "id": "question1433689",
        "stem": "施工组织（总）设计应在工程开工前完成编制和审批，由（）主持编制，召开策划会，项目部相关系统领导及部门人员参与。",
        "choices": "A.\n项目负责人\nB.\n项目技术负责人\nC.\n技术部经理\nD.\n专业工程师",
        "result": "A"
    },
    "question1433690": {
        "id": "question1433690",
        "stem": "存在于地下两个隔水层之间，具有一定水头高度的水，称为()。",
        "choices": "A.\n上层滞水\nB.\n潜水\nC.\n承压水\nD.\n毛细水",
        "result": "C"
    },
    "question1433691": {
        "id": "question1433691",
        "stem": "以下不属于第一类危险源的控制方法的是（）。",
        "choices": "A.\n隔离\nB.\n限制能量\nC.\n提高可靠性\nD.\n限制危险物质",
        "result": "C"
    },
    "question1433692": {
        "id": "question1433692",
        "stem": "钻孔灌注桩灌注水下混凝土，在桩顶设计标高以上加灌一定高度，其作用是（ ）。",
        "choices": "A.\n避免导管漏浆\nB.\n桩身夹泥断桩\nC.\n保证桩顶混凝土质量\nD.\n放慢混凝土灌注速度",
        "result": "C"
    },
    "question1433693": {
        "id": "question1433693",
        "stem": "隧道逃生通道距离开挖掌子面不得大于（）。",
        "choices": "A.\n20m\nB.\n30m\nC.\n40m\nD.\n50m",
        "result": "A"
    },
    "question1433694": {
        "id": "question1433694",
        "stem": "安全生产法第二十一条，生产经营单位的主要负责人对本单位安全生产工作负有下列职责，哪一条不是主要负责人的法定职责（ ）。",
        "choices": "A.\n建立健全并落实本单位全员安全生产责任制，加强安全生产标准化建设\nB.\n组织制定并实施本单位安全生产教育和培训计划\nC.\n保证本单位安全生产投入的有效实施\nD.\n制止和纠正违章指挥、强令冒险作业、违反操作规程的行为",
        "result": "D"
    },
    "question1433696": {
        "id": "question1433696",
        "stem": "关于公路施工弃方作业的说法，错误的是（）。",
        "choices": "A.\n弃方作业应遵循“边支护，边弃土”的原则\nB.\n涵洞口处不得弃方\nC.\n弃土场四周均应设立警戒标志\nD.\n在施工完毕的桥墩台处不得弃土",
        "result": "A"
    },
    "question1433697": {
        "id": "question1433697",
        "stem": "关于预制梁场布设错误的是（ ）。",
        "choices": "A.\n结合梁板的尺寸、数量、架设要求以及运输条件等情况进行综合选址\nB.\n完全按照监理指定的预制场位置\nC.\n周围无塌方、滑坡、落石、泥石流、洪涝等地质灾害\nD.\n场地建设前施工单位应将梁场布置方案报监理工程师审批",
        "result": "B"
    },
    "question1433699": {
        "id": "question1433699",
        "stem": "工期预警是对项目工期的进展情况进行状态预警，分别采用红色预警、黄色预警和蓝色预警表示，（ ）以上为红色预警。",
        "choices": "A.\n工期滞后35天\nB.\n工期滞后30天\nC.\n工期滞后25天\nD.\n工期滞后20天",
        "result": "B"
    },
    "question1433700": {
        "id": "question1433700",
        "stem": "关于高陡边坡处施工，下列说法错误的是（）。",
        "choices": "A.\n开挖工作应与装运作业面相互错开，严禁上、下双重作业\nB.\n现场监理人员负责随时观察高边坡是否有滑动的可能并及时采取安全措施\nC.\n作业人员要系安全带、戴安全帽\nD.\n弃土下方和有滚石危险的区域，应设警告标志，下方有道路时，作业时严禁通过",
        "result": "B"
    },
    "question1433701": {
        "id": "question1433701",
        "stem": "关于混凝土连续梁合龙的说法，错误的是（ ）。",
        "choices": "A.\n合龙段长度宜为2m\nB.\n合龙顺序一般是先边跨，后次跨，再中跨\nC.\n合龙宜在一天中气温最高时进行\nD.\n合龙段混凝土宜提高一级",
        "result": "C"
    },
    "question1433703": {
        "id": "question1433703",
        "stem": "起重钢丝绳吊索的安全系数正确的要求是（）。",
        "choices": "A.\n当利用吊索上的吊钩、卡环钩挂重物上的起重吊环时，安全系数不得小于1.5\nB.\n当利用吊索上的吊钩、卡环钩挂重物上的起重吊环时，安全系数不得小于3\nC.\n当用吊索直接捆绑重物，吊索与重物棱角间应采取妥善的保护措施\nD.\n当用吊索直接捆绑重物，安全系数不得小于6",
        "result": "D"
    },
    "question1433705": {
        "id": "question1433705",
        "stem": "隧道围岩为 I〜III 级的中小跨度隧道，宜采用（ ）。",
        "choices": "A.\n全断面\nB.\n预留核心土法\nC.\n中导洞法\nD.\n双侧壁导坑法",
        "result": "A"
    },
    "question1433708": {
        "id": "question1433708",
        "stem": "施工项目经理检查施工进度时,发现施工进度滞后是由于管理的原因造成的,则不应采取的纠偏措施是( )。",
        "choices": "A.\n调整工程进度目标\nB.\n调整进度管理的方法和手段\nC.\n改进施工方法\nD.\n及时解决工程款支付和落实加快工程进度所需的资金",
        "result": "A"
    },
    "question1433711": {
        "id": "question1433711",
        "stem": "隧道监控量测时，当位移-时间曲线出现反弯点时，则表明围岩（ ）。",
        "choices": "A.\n刚刚稳定\nB.\n已经稳定\nC.\n不稳定\nD.\n已经跨塌",
        "result": "C"
    },
    "question1433712": {
        "id": "question1433712",
        "stem": "喷锚暗挖法二次衬砌施工最佳时机是( )",
        "choices": "A.\n初期支护变形稳定\nB.\n地层变形稳定\nC.\n隧道贯通\nD.\n防水层施工完成",
        "result": "A"
    },
    "question1433714": {
        "id": "question1433714",
        "stem": "关于小型构件预制场场地建设的说法，错误的是（ ）",
        "choices": "A.\n宜采用开放式管理\nB.\n场内路面宜做硬化处理\nC.\n场内不允许积水\nD.\n四周宜设置砖砌排水沟",
        "result": "A"
    },
    "question1433716": {
        "id": "question1433716",
        "stem": "快速路、 主干路的横向胀缝应加设()。",
        "choices": "A.\n加强钢筋\nB.\n拉杆\nC.\n传力杆\nD.\n角隔钢筋",
        "result": "C"
    },
    "question1433717": {
        "id": "question1433717",
        "stem": "在软土地层修建地铁车站， 需要尽快恢复上部路面交通时， 车站基坑施工方法宜选择（ ）。",
        "choices": "A.\n明挖法\nB.\n盖挖法\nC.\n盾构法\nD.\n浅埋暗挖法",
        "result": "B"
    },
    "question1433718": {
        "id": "question1433718",
        "stem": "不开槽管道施工，在城区地下障碍物较复杂地段，采用（） 会是较好的选择。",
        "choices": "A.\n浅埋暗挖\nB.\n定向钻\nC.\n夯管\nD.\n泥水平衡顶管机施工",
        "result": "A"
    },
    "question1433719": {
        "id": "question1433719",
        "stem": "通风道及地面通风亭的作用是（ ）。",
        "choices": "A.\n维持地下车站内空气质量\nB.\n应急逃生通道\nC.\n供乘客集散、候车、换车\nD.\n加强地面、地下通讯联系",
        "result": "A"
    },
    "question1433720": {
        "id": "question1433720",
        "stem": "盾构管片的吊装预埋件首次使用前必须进行（ ）试验。",
        "choices": "A.\n抗拉拔\nB.\n抗压\nC.\n疲劳\nD.\n抗弯曲",
        "result": "A"
    },
    "question1433723": {
        "id": "question1433723",
        "stem": "桥梁施工前应测桥梁中线和各墩、台的（ ）定位桩，作为施工控制依据。",
        "choices": "A.\n中心坐标\nB.\n纵轴与横轴线\nC.\n四角坐标\nD.\n边线",
        "result": "B"
    },
    "question1433724": {
        "id": "question1433724",
        "stem": "危险源的（）是指危险源所处的物理、化学状态和约束条件状态。",
        "choices": "A.\n必然发生事故\nB.\n潜在危险性\nC.\n存在条件\nD.\n触发因素",
        "result": "C"
    },
    "question1433726": {
        "id": "question1433726",
        "stem": "以下关于锚固注浆支护施工安全控制要点中，错误的是（）。",
        "choices": "A.\n注浆工作面的操作人员应戴防护口罩、防护眼镜、橡胶手套及专用披套\nB.\n钻孔作业抽换钻杆时，应防止钻杆被高压泥水冲出孔口伤人\nC.\n钻孔中发生大量突泥涌水时，应集中全力及时注浆封堵\nD.\n向锚杆孔压注砂浆，压力应不大于0.8Mpa，注浆管喷嘴，可对人放置",
        "result": "D"
    },
    "question1433727": {
        "id": "question1433727",
        "stem": "压路机靠近路堤边缘作业时，应根据路堤（）留有必要的安全距离。",
        "choices": "A.\n宽度\nB.\n高度\nC.\n平整度\nD.\n坡度",
        "result": "B"
    },
    "question1433730": {
        "id": "question1433730",
        "stem": "配置混凝土时，选用的粗骨料最大粒径不得超过钢筋最小间距的( )。",
        "choices": "A.\n1/4\nB.\n1/2\nC.\n2/3\nD.\n3/4",
        "result": "D"
    },
    "question1433731": {
        "id": "question1433731",
        "stem": "需要摘挂钩的斜井提升用钢丝绳宜采用的旋捻方向是( )。",
        "choices": "A.\n顺捻\nB.\n反捻\nC.\n交互捻\nD.\n混合捻",
        "result": "C"
    },
    "question1433732": {
        "id": "question1433732",
        "stem": "抗渗性要求较高且要求早强的防水工程，拌制混凝土时应掺加( )。",
        "choices": "A.\n减水剂\nB.\n密实剂\nC.\n膨胀剂\nD.\n速凝剂",
        "result": "B"
    },
    "question1433733": {
        "id": "question1433733",
        "stem": "某基坑要求降水深度22m，土的渗透系数为100m/d，采用井点降水时宜选用( )。",
        "choices": "A.\n管井井点\nB.\n深井井点\nC.\n喷射井点\nD.\n一级轻型井点",
        "result": "B"
    },
    "question1433734": {
        "id": "question1433734",
        "stem": "下列爆破器材中，不得在有瓦斯作业地点使用的是( )。",
        "choices": "A.\n导爆管\nB.\n煤矿许用电子雷管\nC.\n安全导爆索\nD.\n三级煤矿许用炸药",
        "result": "A"
    },
    "question1433735": {
        "id": "question1433735",
        "stem": "某矿井水仓掘进断面积12㎡，岩石普氏系数?=6，采用光面爆破。关于该水仓周边眼施工技术要求的说法，错误的是( )。",
        "choices": "A.\n装药集中度应为70g/m~100g/m\nB.\n炮眼底部应落在同一平面上\nC.\n开孔位置应位于巷道断面轮廓线上\nD.\n应采用不耦合装药结构",
        "result": "A"
    },
    "question1433736": {
        "id": "question1433736",
        "stem": "立井井筒最常用的施工作业方式是( )。",
        "choices": "A.\n掘、砌单行作业\nB.\n掘、砌平行作业\nC.\n掘、砌混合作业\nD.\n掘、砌、安一次成井",
        "result": "C"
    },
    "question1433738": {
        "id": "question1433738",
        "stem": "为利用永久井架施工，施工准备期应完成的主要工作是( )。",
        "choices": "A.\n协调设计单位完成永久井架的设计\nB.\n完成提升机改造\nC.\n做好永久井架结构受力性能校核\nD.\n建立新的劳动组织和安全管理制度",
        "result": "C"
    },
    "question1433739": {
        "id": "question1433739",
        "stem": "可加快矿业工程施工进度的组织措施是( )。",
        "choices": "A.\n合理调配劳动力及施工机械设备\nB.\n改进施工工艺，缩短技术间歇时间\nC.\n优化施工方案，采用先进的施工技术\nD.\n采用先进的施工机械设备",
        "result": "A"
    },
    "question1433741": {
        "id": "question1433741",
        "stem": "关于井巷工程施工质量验收的合格要求，正确的是( )。",
        "choices": "A.\n裸体井巷光面爆破周边眼的眼痕率不应小于50%\nB.\n现浇混凝土井壁表面应无明显裂痕\nC.\n井巷掘进的坡度偏差应小于5%\nD.\n井下主排水泵房不允许渗水",
        "result": "B"
    },
    "question1433742": {
        "id": "question1433742",
        "stem": "关于矿业工程设备购置的优先顺序，正确的是( )。",
        "choices": "A.\n通用设备优于专用设备\nB.\n成套设备优于单体设备\nC.\n小型设优于大型设备\nD.\n单体设备优于大型设备",
        "result": "B"
    },
    "question1433743": {
        "id": "question1433743",
        "stem": "下列合同文件中对同一内容的规定不一致时，应以( )中的规定为准。",
        "choices": "A.\n通用合同条款\nB.\n技术标准\nC.\n专用合同条款\nD.\n已标价工程量清单",
        "result": "C"
    },
    "question1433744": {
        "id": "question1433744",
        "stem": "立井凿井期间局部通风机的安装位置距离井口不得小于( )。",
        "choices": "A.\n5m\nB.\n10m\nC.\n15m\nD.\n20m",
        "result": "D"
    },
    "question1433746": {
        "id": "question1433746",
        "stem": "关于民用爆破器材许可证制度的说法，错误的是( )。",
        "choices": "A.\n民用爆炸物品生产单位，必须办理生产许可证\nB.\n民用爆炸物品销售单位，必须办理销售许可证\nC.\n民用爆炸物品的收货单位，必须办理运输许可证\nD.\n民用爆炸物品的使用单位，必须办理存储许可证",
        "result": "D"
    },
    "question1433747": {
        "id": "question1433747",
        "stem": "矿井入风井巷和采掘工作面的风源含尘量不得超过( )。",
        "choices": "A.\n0.5mg/m3\nB.\n1.0mg/m3\nC.\n2.0mg/m3\nD.\n5.0mg/m3",
        "result": "A"
    },
    "question1433749": {
        "id": "question1433749",
        "stem": "不宜采用强夯法施工的是（ ）。",
        "choices": "A.\n高饱和度的粉土\nB.\n碎石土\nC.\n杂填土\nD.\n软土",
        "result": "A"
    },
    "question1433751": {
        "id": "question1433751",
        "stem": "热拌沥青碎石配合比设计采用（ ）设计。",
        "choices": "A.\n正交试验\nB.\n针入度试验\nC.\n马歇尔试验\nD.\n洛杉矶磨耗试验",
        "result": "C"
    },
    "question1433752": {
        "id": "question1433752",
        "stem": "液体石油沥青施工说法正确的是（ ）。",
        "choices": "A.\n液体石油沥青宜采用针入度较小的石油沥青\nB.\n与沥青稀释剂混合加热，再搅拌、稀释制成\nC.\n掺配比例根据使用要求由经验确定\nD.\n基质沥青的加热温度严禁超过140℃",
        "result": "D"
    },
    "question1433753": {
        "id": "question1433753",
        "stem": "关于透层施工说法错误的是（ ）。",
        "choices": "A.\n气温低于10℃或大风、即将降雨时不得喷洒透层油\nB.\n透层油洒布后应自由流淌，应渗入基层一定深度，在表面形成油膜\nC.\n应按设计喷油量一次均匀洒布，当有漏洒时，应人工补洒\nD.\n在摊铺沥青前，应将局部尚有多余的未渗入基层的沥青清除",
        "result": "B"
    },
    "question1433754": {
        "id": "question1433754",
        "stem": "关于预应力钢筋混凝土拆模说法错误的是（ ）。",
        "choices": "A.\n承包人应在拟定拆模时间的12h以前，并应取得监理工程师同意\nB.\n非承重侧模板应在混凝土强度，设计未规定达到2.5MPa时方可拆除侧模板\nC.\n钢筋混凝土结构的承重模板、支架，应在混凝土强度能承受其自重荷载及其他可能的叠加荷载时，方可拆除\nD.\n预应力混凝土结构，其侧模、底模及支架应在结构建立预应力后方可拆除",
        "result": "D"
    },
    "question1433757": {
        "id": "question1433757",
        "stem": "中、小型突水泥的地段地质灾害分级为（ ）。",
        "choices": "A.\nA级\nB.\nB级\nC.\nC级\nD.\nD级",
        "result": "B"
    },
    "question1433758": {
        "id": "question1433758",
        "stem": "湿式凿岩水、风操作正确的是（ ）。",
        "choices": "A.\n先开风后开水，先关水后关风\nB.\n先开风后开水，先关风后关水\nC.\n先开水后开风，先关风后关水\nD.\n先开水后开风，先关水后关风",
        "result": "C"
    },
    "question1433759": {
        "id": "question1433759",
        "stem": "不属于安全设施的是（ ）。",
        "choices": "A.\n交通标志\nB.\n交通标线\nC.\n自动报警\nD.\n隔离栅",
        "result": "C"
    },
    "question1433760": {
        "id": "question1433760",
        "stem": "水泥混凝土抗压强度试件为边长（ ）mm正方体",
        "choices": "A.\n100\nB.\n150\nC.\n200\nD.\n250",
        "result": "B"
    },
    "question1433761": {
        "id": "question1433761",
        "stem": "应急预案评估每（ ）一次",
        "choices": "A.\n半年\nB.\n一年\nC.\n两年\nD.\n三年",
        "result": "D"
    },
    "question1433762": {
        "id": "question1433762",
        "stem": "合同约定共同延误按不利于承包商原则，由于恶劣环境和业主延迟发放图纸共同存在，承包商可以索赔（ ）。",
        "choices": "A.\n工期补偿和经济补偿\nB.\n工期补偿，不可以经济补偿\nC.\n工期不可补偿，经济可以补偿\nD.\n工期和经济都不可补偿",
        "result": "B"
    },
    "question1433763": {
        "id": "question1433763",
        "stem": "应单独计量的是（ ）。",
        "choices": "A.\n模板\nB.\n脚手架\nC.\n垫圈\nD.\n箍筋",
        "result": "D"
    },
    "question1433765": {
        "id": "question1433765",
        "stem": "工程各合同段交工验收结束后，由（ ）对整个工程项目进行工程质量评定。",
        "choices": "A.\n项目法人\nB.\n监督机构\nC.\n监理单位\nD.\n竣工验收委员会",
        "result": "A"
    },
    "question1433767": {
        "id": "question1433767",
        "stem": "一般土质路基中,低路堤应对地基表层土(),分层回填压实,其处理深度不应小于路床深度。",
        "choices": "A.\n超挖\nB.\n振动碾压\nC.\n掺粉煤灰拌合\nD.\n整平",
        "result": "A"
    },
    "question1433768": {
        "id": "question1433768",
        "stem": "山区公路中,雨期路基施工地段不宜选择()",
        "choices": "A.\n砂类士地段\nB.\n路堑的弃方地段\nC.\n碎砾石地段\nD.\n重黏土地段",
        "result": "D"
    },
    "question1433770": {
        "id": "question1433770",
        "stem": "下列沥青路面面层施工缝处理的做法,错误的是()。",
        "choices": "A.\n半幅施工不能采用热接缝时,采用人工顺直刨缝或切缝\nB.\n半幅施工铺另半幅前必须将边缘凊扫干净,并涂洒少量黏层沥青\nC.\n横接缝首先用3m直尺检查端部平整度,不符合要求时,按45°斜交于路中线切齐清除\nD.\n纵向冷接缝求层的缝错开15cm以上横向接缝错开1m以上",
        "result": "C"
    },
    "question1433771": {
        "id": "question1433771",
        "stem": "使用滑模摊铺机进行水泥混凝土路面施工的路面是()。",
        "choices": "A.\n纵坡大于5%的上坡路段\nB.\n纵坡大于6%的下坡路段\nC.\n平面半径为50mm~100mm的平曲线路段\nD.\n超高横坡大于7%的路段",
        "result": "C"
    },
    "question1433773": {
        "id": "question1433773",
        "stem": "关于桥梁上部结构竖转法施工特点的说法,正确的是()。",
        "choices": "A.\n在桥台处设置转盘,将两岸预制的整垮或半跨转至设计合拢位置\nB.\n转体重量大,施工中需设置转体平衡重\nC.\n主要适用于转体重量不大的拱桥\nD.\n主要针对大跨度拱桥施工,采用锚固体系代替平衡重",
        "result": "C"
    },
    "question1433774": {
        "id": "question1433774",
        "stem": "隧道地质灾害分为四类,属于A级地质灾害的是()。",
        "choices": "A.\n存在中、小型突水,突泥隐患地段、物探有较大异常地段、断裂带\nB.\n非可溶岩地段,发生突水、突泥可能性较小地段\nC.\n存在重大地质灾害地段,特殊地质地段、重大物探异常地段、可能发生大型、特大型突水、突泥隐患地段\nD.\n小型断层破碎带、发生突水、突泥可能性较小地段",
        "result": "C"
    },
    "question1433775": {
        "id": "question1433775",
        "stem": "隧道衬砌裂缝形成的原因不包括()。",
        "choices": "A.\n围岩压力不均\nB.\n衬砌背后有空洞\nC.\n钢筋保护层厚度大于3cm\nD.\n衬砌厚度严重不足",
        "result": "C"
    },
    "question1433777": {
        "id": "question1433777",
        "stem": "下列计划中,不属于资源计划的是()。",
        "choices": "A.\n劳动力计划\nB.\n施工进度计划\nC.\n材料计划\nD.\n施工机械设备计划",
        "result": "B"
    },
    "question1433778": {
        "id": "question1433778",
        "stem": "下列施工段落划分中,不符合通常划分原则的是()。",
        "choices": "A.\n各段落之间工程量基本平衡\nB.\n土方段落中的小型构造物另划分一个工段\nC.\n避免造成段落之间的施工干扰\nD.\n保护构造物的完整性",
        "result": "B"
    },
    "question1433780": {
        "id": "question1433780",
        "stem": "滑模摊铺机摊铺速度应根据（）。",
        "choices": "A.\n板厚\nB.\n碾压能力\nC.\n布料能力\nD.\n振捣混凝土排气效果\nE.\n混凝土工作性能",
        "result": "A,C,D,E"
    },
    "question1433781": {
        "id": "question1433781",
        "stem": "项目部驻地建设说法正确的是（）。",
        "choices": "A.\n自建房屋最低标准为活动板房\nB.\n宜为独立式庭院，四周设有围墙，有固定出入口\nC.\n离集中爆破区200m以外\nD.\n在适当位置设置临时室外消防水池和消防砂池\nE.\n项目部驻地办公用房总面积不得低于1200㎡",
        "result": "A,B,D"
    },
    "question1433785": {
        "id": "question1433785",
        "stem": "下列桥梁设计计算荷载中，属于偶然荷载的有()。",
        "choices": "A.\n.船舶的撞击\nB.\n汽车制动力\nC.\n汽车撞击\nD.\n地震荷载\nE.\n冰压力",
        "result": "A,C,D"
    },
    "question1433787": {
        "id": "question1433787",
        "stem": "不适用于卵石、漂石地质条件下灌注桩钻孔施工的机械有()。",
        "choices": "A.\n螺旋钻机\nB.\n冲击钻机\nC.\n旋挖钻机\nD.\n回转斗钻机\nE.\n地质钻机",
        "result": "A,C,E"
    },
    "question1433788": {
        "id": "question1433788",
        "stem": "根据《公路水运工程安全生产监督管理办法》(交通部令2007年第1号)，施工单位在工程中使用()前，应当组织有关单位进行验收，或者委托具有相应资质的检验检测机构进行验收，并在验收合格后30日内向当地交通主管部门登记。()",
        "choices": "A.\n施工起重机械\nB.\n施工测量仪器\nC.\n整体提升式脚手架\nD.\n滑模爬模\nE.\n架桥机",
        "result": "A,C,D,E"
    },
    "question1433789": {
        "id": "question1433789",
        "stem": "排除滑坡地段地表水的方法有()。",
        "choices": "A.\n设置环形截水沟\nB.\n设置渗沟\nC.\n设置平孔\nD.\n设置树枝状排水沟\nE.\n平整夯实滑坡体表面的土层，形成排水顺坡",
        "result": "A,D,E"
    },
    "question1433790": {
        "id": "question1433790",
        "stem": "为检查，维修渗沟，宜设置检查井的地点有()。",
        "choices": "A.\n路线平曲线焦点处\nB.\n渗沟平面转折处\nC.\n渗沟纵坡由陡变缓处\nD.\n路线凸型竖曲线处\nE.\n渗沟纵坡坡由缓变陡处",
        "result": "B,C"
    },
    "question1433791": {
        "id": "question1433791",
        "stem": "关于水泥稳定砂砾基层施工的说法，正确的有()。",
        "choices": "A.\n运送混合料应覆盖\nB.\n施工期的最低温度不得低于0℃\nC.\n禁止用薄层贴补的方法进行找平\nD.\n自搅拌至摊铺完成不应超过3h\nE.\n常温下养护不少于7d",
        "result": "A,C,D,E"
    },
    "question1433795": {
        "id": "question1433795",
        "stem": "关于工程竣工验收的说法，正确的有()。",
        "choices": "A.\n重要部位的地基与基础，由总监理工程师组织，施工单位、设计单位项目负责人参加验收\nB.\n检验批及分项工程，由专业监理工程师组织施工单位专业质量或技术负责人验收\nC.\n单位工程中的分包工程，由分包单位直接向监理单位提出验收申请\nD.\n整个建设项目验收程序为：施工单位自验合格，总监理工程师验收认可后，由建设单位组织各方正式验收\nE.\n验收时，对涉及结构安全、施工功能等重要的分部工程，需提供抽样检测合格报告",
        "result": "B,D,E"
    },
    "question1433796": {
        "id": "question1433796",
        "stem": "支架搭设作业人员应经过相应部门的专业培训，包括( )",
        "choices": "A.\n定期体检\nB.\n文化考核\nC.\n持证上岗\nD.\n部门批准\nE.\n考试合格",
        "result": "A,C,E"
    },
    "question1433798": {
        "id": "question1433798",
        "stem": "关于地下连续墙的导墙作用的说法,正确的有()。",
        "choices": "A.\n挡土作用\nB.\n测量的基准和重物的支撑\nC.\n存蓄泥浆，防止泥浆漏失\nD.\n提高墙体的刚度\nE.\n保证墙壁的稳定",
        "result": "A,B,C"
    },
    "question1433800": {
        "id": "question1433800",
        "stem": "大树移植后，为提高大树的成活率，可采取的措施有( )。",
        "choices": "A.\n支撑树干\nB.\n平衡株势\nC.\n包裹树干\nD.\n立即施肥\nE.\n合理使用营养液",
        "result": "A,B,C,E"
    },
    "question1433801": {
        "id": "question1433801",
        "stem": "以下属于施工组织总设计的是（）",
        "choices": "A.\n工程概况\nB.\n施工部署\nC.\n计算书及相关图纸\nD.\n施工进度计划\nE.\n主要施工方法",
        "result": "A,B,D,E"
    },
    "question1433802": {
        "id": "question1433802",
        "stem": "土质路基检验与验收主控项目有（）。",
        "choices": "A.\n弯沉值\nB.\n平整度\nC.\n压实度\nD.\n拌合均匀性\nE.\n压实遍数",
        "result": "A,C"
    },
    "question1433803": {
        "id": "question1433803",
        "stem": "以下选项中关于土质路基压实原则说法正确的是（ ）。",
        "choices": "A.\n先轻后重\nB.\n先慢后快\nC.\n先高后低\nD.\n先静后振\nE.\n压路机最快速度不宜超过 6km/h",
        "result": "A,B,D"
    },
    "question1433804": {
        "id": "question1433804",
        "stem": "以下属于基层性能主要指标的是（ ）。",
        "choices": "A.\n整体稳定性\nB.\n水稳性\nC.\n平整度\nD.\n抗冻性\nE.\n结构强度",
        "result": "B,D,E"
    },
    "question1433805": {
        "id": "question1433805",
        "stem": "混凝土路面板在温度变化影响下会产生胀缩，以下表述正确的是（）。",
        "choices": "A.\n混凝土板设有垂直相交的纵向和横向缝\nB.\n混凝土板分为矩形板，一般相邻的接缝可错开\nC.\n每块矩形板的板长按面层类型.厚度并由应力计算确定\nD.\n一般相邻的接缝对齐，不错缝\nE.\n横向缩缝为假缝时，可等间距或变间距布置，但应设传力杆",
        "result": "A,C,D"
    },
    "question1433807": {
        "id": "question1433807",
        "stem": "关于现浇预应力混凝土连续梁施工的说法，正确的有（ ）",
        "choices": "A.\n采用支架法，支架验算的倾覆稳定系数不得小于1\nB.\n采用移动模架法时，浇筑分段施工缝必须设在弯矩最大值部位\nC.\n采用悬浇法时，挂篮质量与梁段混凝土的质量比值一般控制在0.3~0.5之间，特殊情况下也不应超过0.7\nD.\n悬臂浇筑时，0号段应实施临时固结\nE.\n悬臂浇筑时，通常最后浇筑中跨合龙段",
        "result": "C,D,E"
    },
    "question1433808": {
        "id": "question1433808",
        "stem": "对于季节性冻土，为了防止路面因路基冻胀发生变形而破坏，在路基施工中以下说法正确的有：（）。",
        "choices": "A.\n可增加路基总高度\nB.\n防冻层厚度可按地区经验确定\nC.\n地下水在冻结前或冻结过程中应渗入到路基顶部，不得渗入路基底部\nD.\n选用不发生冻胀的路面结构层材料\nE.\n可采用多孔矿渣作为隔温材料",
        "result": "A,D,E"
    },
    "question1433810": {
        "id": "question1433810",
        "stem": "浇筑大体积混凝土质量控制措施主要有（ ）。",
        "choices": "A.\n混凝土养护得当\nB.\n浇筑与振捣措施\nC.\n缩短混凝土的凝结时间\nD.\n优化混凝土配合比\nE.\n增加水泥用量",
        "result": "A,B,D"
    },
    "question1433811": {
        "id": "question1433811",
        "stem": "城市道路土方路基施工时，应分层填土压实，以下关于压实作业施工要点说法正确的是（）。",
        "choices": "A.\n碾压前检查铺筑土层的宽度与厚度\nB.\n碾压“先重后轻”\nC.\n碾压“先轻后重”\nD.\n最后碾压可采用小于12t级的压路机\nE.\n填方高度内的管涵顶面500mm以上才能用压路机碾压",
        "result": "A,C,E"
    },
    "question1433812": {
        "id": "question1433812",
        "stem": "土质路基检验与验收主控项目有（）。",
        "choices": "A.\n弯沉值\nB.\n平整度\nC.\n压实度\nD.\n拌合均匀性\nE.\n压实遍数",
        "result": "A,C"
    },
    "question1433813": {
        "id": "question1433813",
        "stem": "城镇道路路基施工质量检验与验收的主控项目有（）。",
        "choices": "A.\n压实度\nB.\n弯沉值\nC.\n路基宽度\nD.\n路基允许偏差\nE.\n平整度",
        "result": "A,B"
    },
    "question1433814": {
        "id": "question1433814",
        "stem": "路基施工时挖方路基的施工要点包括（）。",
        "choices": "A.\n根据测量中线和边桩开挖\nB.\n压路机不小于8t级，碾压应自路两边向路中心进行\nC.\n碾压时，应视土的干湿程度而采取洒水或换土、晾晒等措施\nD.\n压路机不小于12t级，碾压应自路路中心向两边进行\nE.\n过街雨水支管沟槽及检查井周围应用石灰土或石灰粉、煤灰、砂砾填实",
        "result": "A,C,E"
    },
    "question1433815": {
        "id": "question1433815",
        "stem": "—般在施工工程中涉及（）的专项施工方案，施工单位还应当组织专家进行论证审查。",
        "choices": "A.\n深基坑\nB.\n地下暗挖工程\nC.\n脚手架工程\nD.\n高大模板工程\nE.\n钢筋工程",
        "result": "A,B,D"
    },
    "question1433816": {
        "id": "question1433816",
        "stem": "下列施工工序中，属于无粘结预应力施工工序的有（）。",
        "choices": "A.\n预埋管道\nB.\n安装锚具\nC.\n张拉\nD.\n压浆\nE.\n封锚",
        "result": "B,C,E"
    },
    "question1433817": {
        "id": "question1433817",
        "stem": "下列关于支架的叙述正确的是（）。",
        "choices": "A.\n支架不得与施工脚手架相连\nB.\n支架安装完毕后即可使用\nC.\n支架立柱必须落在有足够承载力的地基上\nD.\n支架地基严禁被水浸泡\nE.\n支架通行孔的两边应加护栏和警示灯",
        "result": "A,C,D,E"
    },
    "question1433818": {
        "id": "question1433818",
        "stem": "对于季节性冻土，为了防止路面因路基冻胀发生变形而破坏，在路基施工中以下说法正确的有：（）。",
        "choices": "A.\n可增加路基总高度\nB.\n防冻层厚度可按地区经验确定\nC.\n地下水在冻结前或冻结过程中应渗入到路基顶部，不得渗入路基底部\nD.\n选用不发生冻胀的路面结构层材料\nE.\n可采用多孔矿渣作为隔温材料",
        "result": "A,D,E"
    },
    "question1433820": {
        "id": "question1433820",
        "stem": "为了使水泥混凝土路面层有较大的粗糙度，可采用（）的方法。",
        "choices": "A.\n刻槽\nB.\n压槽\nC.\n拉槽\nD.\n拉毛\nE.\n胀裂",
        "result": "A,B,C,D"
    },
    "question1433823": {
        "id": "question1433823",
        "stem": "基坑开挖至设计高程后应由（）单位共同验收。",
        "choices": "A.\n设计\nB.\n勘察\nC.\n施工\nD.\n监理\nE.\n质监站",
        "result": "A,B,C,D"
    },
    "question1433824": {
        "id": "question1433824",
        "stem": "废水处理方法主要有（）",
        "choices": "A.\n物理处理\nB.\n化学处理法\nC.\n生物处理法\nD.\n机械处理法\nE.\n人工处理法",
        "result": "A,B,C"
    },
    "question1433825": {
        "id": "question1433825",
        "stem": "绿化工程中大树移植后，为提高大树的成活率，可采取的措施有（）。",
        "choices": "A.\n支撑树干\nB.\n平衡株势\nC.\n包裹树干\nD.\n立即施肥\nE.\n合理施用营养液",
        "result": "A,B,C,E"
    },
    "question1433826": {
        "id": "question1433826",
        "stem": "三级交底主要包含哪三级（）",
        "choices": "A.\n环保交底\nB.\n施工组织设计交底\nC.\n施工方案交底\nD.\n安全技术交底",
        "result": "B,C,D"
    },
    "question1433827": {
        "id": "question1433827",
        "stem": "土质路基检验与验收主控项目有（）。",
        "choices": "A.\n弯沉值\nB.\n平整度\nC.\n压实度\nD.\n拌合均匀性\nE.\n压实遍数",
        "result": "A,C"
    },
    "question1433828": {
        "id": "question1433828",
        "stem": "以下选项中关于土质路基压实原则说法正确的是（ ）。",
        "choices": "A.\n先轻后重\nB.\n先慢后快\nC.\n先高后低\nD.\n先静后振\nE.\n压路机最快速度不宜超过 6km/h",
        "result": "A,B,D"
    },
    "question1433830": {
        "id": "question1433830",
        "stem": "关于地下连续墙的导墙作用的说法,正确的有()。",
        "choices": "A.\n控制挖槽精度\nB.\n手受水土压力\nC.\n手受施工机具设备的荷载\nD.\n提高墙体的刚度\nE.\n保证墙壁的稳定",
        "result": "A,B,C"
    },
    "question1433832": {
        "id": "question1433832",
        "stem": "地下工程防水设计和施工应遵循()相结合的原则。",
        "choices": "A.\n防\nB.\n排\nC.\n降\nD.\n截\nE.\n堵",
        "result": "A,B,D,E"
    },
    "question1433833": {
        "id": "question1433833",
        "stem": "盾构法施工时，要控制好盾构机姿态，出现偏差时，应本着()的原则。",
        "choices": "A.\n快纠\nB.\n勤纠\nC.\n少纠\nD.\n慢纠\nE.\n适度",
        "result": "B,C,E"
    },
    "question1433837": {
        "id": "question1433837",
        "stem": "关于填土路基施工要点的说法，正确的有（）。",
        "choices": "A.\n原地面标高低于设计路基标高时，需要填筑土方\nB.\n土层填筑后，立即采用8t级压路机碾压\nC.\n填筑前，应妥善处理井穴、树根等\nD.\n填方高度应按设计标高增加预沉量值\nE.\n管涵顶面填土300mm以上才能用压路机碾压",
        "result": "A,C,D"
    },
    "question1433838": {
        "id": "question1433838",
        "stem": "隧道穿越下列地段时,容易发生坍方的有()。",
        "choices": "A.\n洞口浅埋段\nB.\n断层破碎带\nC.\n两种岩性接触带\nD.\n高地应力硬岩段\nE.\n有害气体地段",
        "result": "A,B"
    },
    "question1433840": {
        "id": "question1433840",
        "stem": "盾构法施工隧道的优点有（）。",
        "choices": "A.\n不影响地面交通\nB.\n对附近居民干扰少\nC.\n适宜于建造覆土较深的隧道\nD.\n不受风雨气候影响\nE.\n对结构断面尺寸多变的区段适应能力很强",
        "result": "A,B,C,D"
    },
    "question1433842": {
        "id": "question1433842",
        "stem": "关于安全带使用说法，正确的有（）。",
        "choices": "A.\n安全带应低挂高用\nB.\n安全带的安全绳与悬吊绳应共用连接器\nC.\n安全带的安全绳可作为悬吊绳\nD.\n安全带的安全绳严禁打结使用\nE.\n安全带的安全绳上严禁挂钩",
        "result": "D,E"
    },
    "question1433843": {
        "id": "question1433843",
        "stem": "高速公路在正式进行路基压实作业前，一般应做试验段，以便取得路基或基层施工相关的技术参数。试验的主要目的是()。",
        "choices": "A.\n确定虚铺厚度\nB.\n合理选用压实机具\nC.\n选择压实方式\nD.\n确定最佳含水量\nE.\n确定压实遍数",
        "result": "A,B,C,E"
    },
    "question1433845": {
        "id": "question1433845",
        "stem": "马头门施工技术中，说法正确的是（ ）。",
        "choices": "A.\n破除马头门前，应做好支撑体系的受力转换\nB.\n马头门开启应随机进行\nC.\n同一竖井内的马头门不得同时施工\nD.\n同一竖井内一侧隧道掘进 15m 后，方可开启另一侧马头门\nE.\n马头门标高不一致，宜遵循“先高后低” 的原则",
        "result": "A,C,D"
    },
    "question1433846": {
        "id": "question1433846",
        "stem": "刚性路面施工时，应在（）处设置胀缝。",
        "choices": "A.\n检查井周围\nB.\n纵向施工缝\nC.\n小半径平曲线\nD.\n板厚改变\nE.\n邻近桥梁",
        "result": "C,D,E"
    },
    "question1433847": {
        "id": "question1433847",
        "stem": "关于填土路基施工要点的说法，正确的有（）。",
        "choices": "A.\n原地面标高低于设计路基标高时，需要填筑土方\nB.\n层填筑后，立即采用8t级压路机碾压\nC.\n填筑前，应妥善处理井穴、树根等\nD.\n填方高度应按设计标高增加预沉量值\nE.\n管涵顶面填土300mm以上才能用压路机碾压",
        "result": "A,C,D"
    },
    "question1433848": {
        "id": "question1433848",
        "stem": "石灰稳定土集中拌合时，影响拌合用水量的因素有（）。",
        "choices": "A.\n施工压实设备变化\nB.\n施工温度的变化\nC.\n原材料含水量变化\nD.\n集料的颗粒组成变化\nE.\n运输距离变化",
        "result": "B,C,D,E"
    },
    "question1433849": {
        "id": "question1433849",
        "stem": "下列质量检验项目中，属于支座施工质量检验主控项目的有（）。",
        "choices": "A.\n支座顶面高程\nB.\n支座垫石顶面高程\nC.\n盖梁顶面高程\nD.\n支座与垫石的密贴程度\nE.\n支座进场检验",
        "result": "B,D,E"
    },
    "question1433850": {
        "id": "question1433850",
        "stem": "关于钢-混凝土结合梁施工技术的说法,正确的有()。",
        "choices": "A.\n一般由钢梁和钢筋混凝土桥面板两部分组成\nB.\n在钢梁与钢筋混凝土板之间设传剪器都作用是使二者共同工作\nC.\n适用于城市大跨径桥梁\nD.\n桥面混凝土浇筑应分车道分段施工\nE.\n浇筑混凝土桥面时,横桥向应由两侧向中间合拢",
        "result": "A,B,C"
    },
    "question1433851": {
        "id": "question1433851",
        "stem": "盾构法施工隧道的优点有（）。",
        "choices": "A.\n不影响地面交通\nB.\n对附近居民干扰少\nC.\n适宜于建造覆土较深的隧道\nD.\n不受风雨气候影响\nE.\n对结构断面尺寸多变的区段适应能力较好",
        "result": "A,B,C,D"
    },
    "question1433852": {
        "id": "question1433852",
        "stem": "下列场地水处理构筑物中，属于给水处理构筑物的有（）。",
        "choices": "A.\n消化池\nB.\n集水池\nC.\n澄清池\nD.\n.曝气池\nE.\n清水池",
        "result": "B,C,E"
    },
    "question1433853": {
        "id": "question1433853",
        "stem": "关于供热管道安装前准备工作的说法，正确的有（）。",
        "choices": "A.\n管道安装前，应完成支、吊架的安装和防腐处理\nB.\n管道的管径、壁厚和材质应符合设计要求，并经验收合格\nC.\n管件制作和可预组装的部分宜在管道安装前完成\nD.\n补偿器应在管道安装前先与管道连接\nE.\n安装前应对中心线和支架高程进行复核",
        "result": "A,B,C,E"
    },
    "question1433854": {
        "id": "question1433854",
        "stem": "下列基坑工程监控量测项目中，属于一级基坑应测的项目有（）。",
        "choices": "A.\n孔隙水压力\nB.\n土压力\nC.\n坡顶水平位移\nD.\n周围建筑物水平位移\nE.\n地下水位",
        "result": "C,E"
    },
    "question1433856": {
        "id": "question1433856",
        "stem": "路面基层的性能指标包括( )。",
        "choices": "A.\n强度\nB.\n扩散荷载的能力\nC.\n水稳定性\nD.\n抗滑\nE.\n低噪",
        "result": "A,B,C"
    },
    "question1433857": {
        "id": "question1433857",
        "stem": "关于水泥稳定砂砾基层施工的说法，正确的有( )。",
        "choices": "A.\n运送混合料应覆盖\nB.\n施工期的最低温度不得低于0℃\nC.\n禁止用薄层贴补的方法进行找平\nD.\n自搅拌至摊铺完成不应超过3h\nE.\n常温下养护不少于7d",
        "result": "A,C,D,E"
    },
    "question1433858": {
        "id": "question1433858",
        "stem": "预制桩接头一般采用的连接方式有()。",
        "choices": "A.\n焊接\nB.\n硫磺胶泥\nC.\n法兰\nD.\n机械连接\nE.\n搭接",
        "result": "A,C,D"
    },
    "question1433859": {
        "id": "question1433859",
        "stem": "关于重力式砌体墩台砌筑的说法，正确的有( )。",
        "choices": "A.\n砌筑前应清理基础，保持洁净\nB.\n砌体应采用坐浆法分层砌筑\nC.\n砌筑墩台拉结石应从直线中间部分开始\nD.\n分水体镶面石的抗压强度不得低于设计要求\nE.\n砌筑的石料应清洁干净，保持湿润",
        "result": "A,B,D,E"
    },
    "question1433861": {
        "id": "question1433861",
        "stem": "地下工程防水设计和施工应遵循( )相结合的原则。",
        "choices": "A.\n防\nB.\n排\nC.\n降\nD.\n截\nE.\n堵",
        "result": "A,B,D,E"
    },
    "question1433862": {
        "id": "question1433862",
        "stem": "城市排水体制选择中，对旧城区改造与新区建设必须树立的生态文明理念有( )。",
        "choices": "A.\n尊重自然\nB.\n认识自然\nC.\n顺应自然\nD.\n保护自然\nE.\n绿化自然",
        "result": "A,C,D"
    },
    "question1433863": {
        "id": "question1433863",
        "stem": "泥质防水层检测项目包括( )试验。",
        "choices": "A.\n强度\nB.\n压实度\nC.\n渗水\nD.\n冲击\nE.\n满水",
        "result": "B,C"
    },
    "question1433866": {
        "id": "question1433866",
        "stem": "城镇沥青路面道路结构组成有()。",
        "choices": "A.\n路基\nB.\n基层\nC.\n面层\nD.\n热层\nE.\n排水层",
        "result": "A,B,C"
    },
    "question1433867": {
        "id": "question1433867",
        "stem": "用于路面裂缝防治的土工合成材料应满足的技术要求有()。",
        "choices": "A.\n抗拉强度\nB.\n最大负荷延伸率\nC.\n单位面积质量\nD.\n网孔尺寸\nE.\n搭接长度",
        "result": "A,B,C,D"
    },
    "question1433869": {
        "id": "question1433869",
        "stem": "当基坑底有承压水时,应进行坑底突涌验算,必要时可采取()保证坑底土层稳定。",
        "choices": "A.\n截水\nB.\n水平封底隔渗\nC.\n设置集水井\nD.\n钻孔减压\nE.\n回灌",
        "result": "B,D"
    },
    "question1433871": {
        "id": "question1433871",
        "stem": "新建市政公用工程不开槽成品管的常用施工方法有()。",
        "choices": "A.\n顶管法\nB.\n夯管法\nC.\n裂管法\nD.\n沉管法\nE.\n后构法",
        "result": "A,B,E"
    },
    "question1433872": {
        "id": "question1433872",
        "stem": "关于供热管网工程试运行的说法,错误的有()。",
        "choices": "A.\n工程完工后即可进行试运行\nB.\n试运行应按建设单位、设计单位认可的参数进行\nC.\n试运行中严禁对紧件进行热拧紧\nD.\n试运行中应重点检查支架的工作状况\nE.\n试运行的时间应为连续运行48h",
        "result": "A,C,E"
    },
    "question1433874": {
        "id": "question1433874",
        "stem": "市政工程投标文件经济部分内容有()。",
        "choices": "A.\n投标保证金\nB.\n已标价的工程量\nC.\n投标报价\nD.\n资金风险管理体系及措施\nE.\n拟分包项目情况",
        "result": "B,C,E"
    },
    "question1433875": {
        "id": "question1433875",
        "stem": "工程施工过程中,影响施工安全生产的主要环境因素有()。",
        "choices": "A.\n水文地质\nB.\n项目人文氛围\nC.\n防护设施\nD.\n冬雨期施工\nE.\n邻近建构(筑)物",
        "result": "A,C,D,E"
    },
    "question1433877": {
        "id": "question1433877",
        "stem": "桥梁的“五大部件”包括()。",
        "choices": "A.\n伸缩缝\nB.\n支座系统\nC.\n桥面铺装\nD.\n桥跨结构\nE.\n防撞栏杆",
        "result": "B,D"
    }
}

function get_data(){
    let document = unsafeWindow.document.querySelector("#task-content-iframe").contentDocument
    let data = []
    let questions = document.querySelectorAll(".testpaper-question")
    for(let q of questions){
        let id = q.id
        let stem = q.querySelector("div.testpaper-question-stem").innerText
        let choices= q.querySelector("ul") ?q.querySelector("ul").innerText:""
        let result = q.querySelector("div.testpaper-question-result > strong").innerText
        data.push({
            "id":id,
            "stem":stem,
            "choices":choices,
            "result":result
        })
        GM_setValue(id,{
            "id":id,
            "stem":stem,
            "choices":choices,
            "result":result
        })
    }
    return{
        "data":data
    }
}
function answer(){
    //答题
    let document = unsafeWindow.document.querySelector("#task-content-iframe").contentDocument
    let questions = document.querySelectorAll(".testpaper-question")
    for(let q of questions){
        let id = q.id
        let data = datas[id] || GM_getValue(id)
        if(data){
            let result =data["result"]
            for(let i of result.split(",")){
                i = "ABCDEFG".indexOf(i) //A->0
                q.querySelectorAll("input")[i].click()
            }
        }else{
            //not found answers
        }
    }
}

function start(){
    let page = "doing"
    let a = setInterval(function(){
        let document = unsafeWindow.document.querySelector("#task-content-iframe").contentDocument

        if( document.querySelector(".testpaper-question-result")){
            page = "result"
            let data = get_data()
            console.log(data)
            //submit(data)
        }else{
            page = "doing"
        }
        if (document.querySelector("a.btn-primary")){
            document.querySelector("a.btn-primary").click()
        }
        if(document.querySelector("#finishPaper") ){
            if(page == "doing"){answer()}
            document.querySelector("#finishPaper").click()
        }
        if( document.querySelector("#testpaper-finish-btn")){
            document.querySelector("#testpaper-finish-btn").click()
        }
    },3000)
    }

function init(){
    new ElegantAlertBox("开始运行")
    start()
}

GM_registerMenuCommand(`【自动答题】`,init)
GM_registerMenuCommand(`【手动答题】（点一次答一次）`,answer)

