
(function () {
    "use strict";
    var origSend;
    var origOpen;
    var button;
    var initialX, initialY;
    var isDragging;
    var input;
    var isDragging1;
    var initialX1, initialY1;
    var offsetX1, offsetY1;
    preprocessData();
    //变量定义
    //变量定义
    var strtip = "";
    var tipnum = 0;
    var enable = true;
    var strinput = "";
    var strreport = "报告模板：\n";
    var keyvalarr1 = null,
        keyvalarr2 = null,
        keyvalarr3 = null,
        keyvalarr4 = null;
    var keyvalArr;
    var manufactureStr = '';
    var supervisionStr = '';
    var renovationStr = '';
    var coverInspectionStr = '';
    var nextInspectionStr = '';
    var lastBrakingStr = '';
    var generalInspectionStr = document
    var manufactureDate = null;
    var supervisionDate = null;
    var renovationDate = null;
    var coverInspectionDate = null;
    var nextInspectionDate = null;
    var lastBrakingDate = null;
    var username = '';
    var usernameGK = '';
    var jyrq;
    var zhizaorq;
    var gaizaorq;
    var zhidongrq;
    var jiandurq;
    var gkxiacijianyanriqi;
    var jyrqgk;
    var keyname;
    var qgsf;
    var regions;
    var nx;
    var dat;

    function main() {
        MyVarObject();
        XiaoHe();
    }
    function XiaoHe() {
        isItemsEmpty();
        //封面信息
        //封面信息
        CoverInfo();
        //概况信息
        //概况信息
        ProfileInfo();
        //概况日期比较和检验记录
        //概况日期比较和检验记录
        DateInfo();
        //检验记录
        //检验记录  
        //验证检验结论是否正确，检验项目备注是否有填写
        InspectionRecordInfo();
        displayResult();
    }
    function MyVarObject() {
        keyname = [
            "JYJG1_JYJL1",
            "DTBZ1",
            "JYJG2_JYJL1",
            "DTBZ2",
            "JYJG3_JYJL1",
            "DTBZ3",
            "JYJG4_JYJL2",
            "DTBZ4",
            "JYJG5_JYJL2",
            "DTBZ5",
            "JYJG6_JYJL3",
            "DTBZ6",
            "JYJG7_JYJL4",
            "DTBZ7",
            "JYJG8_JYJL4",
            "DTBZ8",
            "JYJG9_JYJL4",
            "DTBZ9",
            "JYJG10_JYJL4",
            "DTBZ10",
            "JYJG11_JYJL5",
            "DTBZ11",
            "JYJG12_JYJL6",
            "DTBZ12",
            "JYJG13_JYJL6",
            "DTBZ13",
            "JYJG14_JYJL6",
            "DTBZ14",
            "JYJG15_JYJL6",
            "DTBZ15",
            "JYJG16_JYJL7",
            "DTBZ16",
            "JYJG17_JYJL8",
            "DTBZ17",
            "JYJG18_JYJL8",
            "DTBZ18",
            "JYJG19_JYJL9",
            "DTBZ19",
            "JYJG20_JYJL10",
            "DTBZ20",
            "JYJG21_JYJL11",
            "DTBZ21",
            "JYJG22_JYJL12",
            "DTBZ22",
            "JYJG23_JYJL12",
            "DTBZ23",
            "JYJG24_JYJL12",
            "DTBZ24",
            "JYJG25_JYJL13",
            "DTBZ25",
            "JYJG26_JYJL13",
            "DTBZ26",
            "JYJG27_JYJL13",
            "DTBZ27",
            "JYJG28_JYJL13",
            "DTBZ28",
            "JYJG29_JYJL13",
            "DTBZ29",
            "JYJG30_JYJL14",
            "DTBZ30",
            "JYJG31_JYJL14",
            "DTBZ31",
            "JYJG32_JYJL15",
            "DTBZ32",
            "JYJG33_JYJL15",
            "DTBZ33",
            "JYJG34_JYJL15",
            "DTBZ34",
            "JYJG35_JYJL16",
            "DTBZ35",
            "JYJG36_JYJL17",
            "DTBZ36",
            "JYJG37_JYJL18",
            "DTBZ37",
            "JYJG38_JYJL18",
            "DTBZ38",
            "JYJG39_JYJL18",
            "DTBZ39",
            "JYJG40_JYJL18",
            "DTBZ40",
            "JYJG41_JYJL19",
            "DTBZ41",
            "JYJG42_JYJL20",
            "DTBZ42",
            "JYJG43_JYJL21",
            "DTBZ43",
            "JYJG44_JYJL21",
            "DTBZ44",
            "JYJG45_JYJL21",
            "DTBZ45",
            "JYJG46_JYJL21",
            "DTBZ46",
            "JYJG47_JYJL22",
            "DTBZ47",
            "JYJG48_JYJL22",
            "DTBZ48",
            "JYJG49_JYJL23",
            "DTBZ49",
            "DTSJ503",
            "JYJG50_JYJL24",
            "DTBZ50",
            "DTSJ504",
            "JYJG51_JYJL24",
            "DTBZ51",
            "JYJG52_JYJL25",
            "DTBZ52",
            "JYJG53_JYJL26",
            "DTBZ53",
            "JYJG54_JYJL26",
            "DTBZ54",
            "JYJG55_JYJL26",
            "DTBZ55",
            "JYJG56_JYJL27",
            "DTBZ56",
            "JYJG57_JYJL27",
            "DTBZ57",
            "JYJG58_JYJL28",
            "DTBZ58",
            "JYJG59_JYJL28",
            "DTBZ59",
            "JYJG60_JYJL29",
            "DTBZ60",
            "DTSJ700",
            "JYJG61_JYJL29",
            "DTBZ61",
            "JYJG62_JYJL29",
            "DTBZ62",
            "JYJG63_JYJL29",
            "DTBZ63",
            "JYJG64_JYJL30",
            "DTBZ64",
            "JYJG65_JYJL30",
            "DTBZ65",
            "JYJG66_JYJL30",
            "DTBZ66",
            "DTSJ702",
            "JYJG67_JYJL31",
            "DTBZ67",
            "DTSJ74",
            "JYJG68_JYJL31",
            "DTBZ68",
            "JYJG69_JYJL32",
            "DTBZ69",
            "JYJG70_JYJL33",
            "DTBZ70",
            "JYJG71_JYJL33",
            "DTBZ71",
            "JYJG72_JYJL34",
            "DTBZ72",
            "JYJG73_JYJL34",
            "DTBZ73",
            "JYJG74_JYJL34",
            "DTBZ74",
            "JYJG75_JYJL34",
            "DTBZ75",
            "JYJG76_JYJL35",
            "DTBZ76",
            "JYJG77_JYJL36",
            "DTBZ77",
            "JYJG78_JYJL36",
            "DTBZ78",
            "JYJG79_JYJL38",
            "DTBZ79",
            "JYJG80_JYJL39",
            "DTBZ80",
            "JYJG81_JYJL39",
            "DTBZ81",
            "JYJG82_JYJL39",
            "DTBZ82",
            "JYJG83_JYJL39",
            "DTBZ83",
            "JYJG84_JYJL40",
            "DTBZ84",
            "JYJG85_JYJL40",
            "DTBZ85",
            "JYJG86_JYJL40",
            "DTBZ86",
            "JYJG87_JYJL40",
            "DTBZ87",
            "JYJG88_JYJL41",
            "DTBZ88",
            "JYJG89_JYJL41",
            "DTBZ89",
            "JYJG90_JYJL42",
            "DTBZ90",
            "JYJG91_JYJL43",
            "DTBZ91",
        ];
        qgsf = {
            北京市: "11",
            天津市: "12",
            河北省: "13",
            山西省: "14",
            内蒙古自治区: "15",
            辽宁省: "21",
            吉林省: "22",
            黑龙江省: "23",
            上海市: "31",
            江苏省: "32",
            浙江省: "33",
            安徽省: "34",
            福建省: "35",
            江西省: "36",
            山东省: "37",
            河南省: "41",
            湖北省: "42",
            湖南省: "43",
            广东省: "44",
            广西壮族自治区: "45",
            海南省: "46",
            重庆市: "50",
            四川省: "51",
            贵州省: "52",
            云南省: "53",
            西藏自治区: "54",
            陕西省: "61",
            甘肃省: "62",
            青海省: "63",
            宁夏回族自治区: "64",
            新疆维吾尔自治区: "65",
            台湾省: "71",
            香港特别行政区: "81",
            澳门特别行政区: "82",
        };
        regions = {
            银川市: {
                银川市市辖区: {
                    兴庆区: {},
                    西夏区: {},
                    金凤区: {},
                },
                兴庆区: {},
                西夏区: {},
                金凤区: {},
                永宁县: {},
                贺兰县: {},
                灵武市: {},
            },
            石嘴山市: {
                大武口区: {},
                惠农区: {},
                平罗县: {},
            },
            吴忠市: {
                利通区: {},
                红寺堡区: {},
                盐池县: {},
                同心县: {},
                青铜峡市: {},
            },
            固原市: {
                原州区: {},
                西吉县: {},
                隆德县: {},
                泾源县: {},
                彭阳县: {},
            },
            中卫市: {
                中卫市市辖区: {
                    沙坡头区: {},
                },
                沙坡头区: {},
                中宁县: {},
                海原县: {},
            },
        };
        nx = {
            宁夏回族自治区: "640000",
            银川市: "640100",
            银川市市辖区: "640101",
            兴庆区: "640104",
            西夏区: "640105",
            金凤区: "640106",
            永宁县: "640121",
            贺兰县: "640122",
            灵武市: "640181",
            石嘴山市: "640200",
            大武口区: "640202",
            惠农区: "640205",
            平罗县: "640221",
            吴忠市: "640300",
            利通区: "640302",
            红寺堡区: "640303",
            盐池县: "640323",
            同心县: "640324",
            青铜峡市: "640381",
            固原市: "640400",
            原州区: "640402",
            西吉县: "640422",
            隆德县: "640423",
            泾源县: "640424",
            彭阳县: "640425",
            中卫市: "640500",
            中卫市市辖区: "640501",
            沙坡头区: "640502",
            中宁县: "640521",
            海原县: "640522",
        };

        keyvalarr1 = {
            REPORTNO: "NTD11202405871",
            使用单位名称: "宁夏永建建筑工程有限公司",
            设备代码: "311010339201203353",
            SHEBEILEIBIE: "曳引与强制驱动电梯",
            "内部（全面）检验日期（电类定检）": "2024年04月17日",
        };

        keyvalarr2 = {
            使用单位名称: "宁夏永建建筑工程有限公司",
            使用单位组织机构代码: "916401212279302618",
            "设备使用(所在)地点": "永宁县团结社区日间照料中心",
            设备分类代码: "曳引驱动乘客电梯",
            设备型号: "DPN35",
            "产品编号(出厂编号)": "202209146",
            使用证编号: "56",
            安全管理人员: "张飞",
            安全管理人员联系电话: "09514100765",
            制造单位: "苏州德奥电梯有限公司",
            制造日期: "2006年09月26日",
            GZDWMC: "-",
            改造监督检验日期: "-",
            维保单位名称: "宁夏通宇电梯制造发展股份有限公司",
            ZDSYRQ: "2023年04月",
            安装监督检验日期: "2016年06月",
            是否加装电梯: "否",
            是否住宅电梯: "否",
            "内部（全面）下次检验日期（电类定检）": "2025年04月",
            电梯额定载荷: "800",
            电梯运行速度: "1.5",
            电梯层站: "6",
            电梯站数: "6",
            电梯门数: "6",
            控制方式: "单台集选控制",
            DTJYYJ: "《电梯监督检验和定期检验规则》（TSG T7001-2023）",
            JYYQSB: "详见（2）号工具箱",
            DTBZCS3: "-",
            DTBZCS4: "-",
            XCJYTJ: "符合",
            XCAQTJ: "符合",
            "内部（全面）检验结论（电类定检）": "合格",
            JYRY: "",
            "内部（全面）检验日期（电类定检）": "2024年04月17日",
            JHRY: "",
            JHRQ: "",
        };
        keyvalarr3 = {
            JYJG1_JYJL1: "",
            DTBZ1: "-",
            JYJG2_JYJL1: "×",
            DTBZ2: "-",
            JYJG3_JYJL1: "×",
            DTBZ3: "-",
            JYJG4_JYJL2: "×",
            DTBZ4: "-",
            JYJG5_JYJL2: "√",
            DTBZ5: "-",
            JYJG6_JYJL3: "√",
            DTBZ6: "-",
            JYJG7_JYJL4: "√",
            DTBZ7: "-",
            JYJG8_JYJL4: "-",
            DTBZ8: "-",
            JYJG9_JYJL4: "√",
            DTBZ9: "-",
            JYJG10_JYJL4: "√",
            DTBZ10: "-",
            JYJG11_JYJL5: "√",
            DTBZ11: "-",
            JYJG12_JYJL6: "-",
            DTBZ12: "-",
            JYJG13_JYJL6: "-",
            DTBZ13: "-",
            JYJG14_JYJL6: "-",
            DTBZ14: "-",
            JYJG15_JYJL6: "-",
            DTBZ15: "-",
            JYJG16_JYJL7: "√",
            DTBZ16: "-",
            JYJG17_JYJL8: "-",
            DTBZ17: "-",
            JYJG18_JYJL8: "-",
            DTBZ18: "-",
            JYJG19_JYJL9: "-",
            DTBZ19: "-",
            JYJG20_JYJL10: "√",
            DTBZ20: "-",
            JYJG21_JYJL11: "√",
            DTBZ21: "-",
            JYJG22_JYJL12: "√",
            DTBZ22: "-",
            JYJG23_JYJL12: "√",
            DTBZ23: "-",
            JYJG24_JYJL12: "-",
            DTBZ24: "-",
            JYJG25_JYJL13: "√",
            DTBZ25: "-",
            JYJG26_JYJL13: "√",
            DTBZ26: "-",
            JYJG27_JYJL13: "√",
            DTBZ27: "-",
            JYJG28_JYJL13: "-",
            DTBZ28: "-",
            JYJG29_JYJL13: "√",
            DTBZ29: "-",
            JYJG30_JYJL14: "-",
            DTBZ30: "-",
            JYJG31_JYJL14: "√",
            DTBZ31: "-",
            JYJG32_JYJL15: "√",
            DTBZ32: "-",
            JYJG33_JYJL15: "-",
            DTBZ33: "-",
            JYJG34_JYJL15: "-",
            DTBZ34: "-",
            JYJG35_JYJL16: "√",
            DTBZ35: "-",
            JYJG36_JYJL17: "-",
            DTBZ36: "-",
            JYJG37_JYJL18: "√",
            DTBZ37: "-",
            JYJG38_JYJL18: "√",
            DTBZ38: "-",
            JYJG39_JYJL18: "√",
            DTBZ39: "-",
            JYJG40_JYJL18: "√",
            DTBZ40: "-",
            JYJG41_JYJL19: "-",
            DTBZ41: "-",
            JYJG42_JYJL20: "-",
            DTBZ42: "-",
        };

        keyvalarr4 = {
            JYJG43_JYJL21: "√",
            DTBZ43: "-",
            JYJG44_JYJL21: "√",
            DTBZ44: "-",
            JYJG45_JYJL21: "-",
            DTBZ45: "-",
            JYJG46_JYJL21: "√",
            DTBZ46: "-",
            JYJG47_JYJL22: "√",
            DTBZ47: "-",
            JYJG48_JYJL22: "√",
            DTBZ48: "-",
            JYJG49_JYJL23: "×",
            DTBZ49: "-",
            DTSJ503: "≤6",
            JYJG50_JYJL24: "√",
            DTBZ50: "-",
            DTSJ504: "≤45",
            JYJG51_JYJL24: "√",
            DTBZ51: "-",
            JYJG52_JYJL25: "√",
            DTBZ52: "-",
            JYJG53_JYJL26: "√",
            DTBZ53: "-",
            JYJG54_JYJL26: "√",
            DTBZ54: "-",
            JYJG55_JYJL26: "√",
            DTBZ55: "-",
            JYJG56_JYJL27: "√",
            DTBZ56: "-",
            JYJG57_JYJL27: "√",
            DTBZ57: "-",
            JYJG58_JYJL28: "√",
            DTBZ58: "-",
            JYJG59_JYJL28: "√",
            DTBZ59: "-",
            JYJG60_JYJL29: "√",
            DTBZ60: "-",
            DTSJ700: "7",
            JYJG61_JYJL29: "√",
            DTBZ61: "-",
            JYJG62_JYJL29: "√",
            DTBZ62: "-",
            JYJG63_JYJL29: "√",
            DTBZ63: "-",
            JYJG64_JYJL30: "√",
            DTBZ64: "-",
            JYJG65_JYJL30: "√",
            DTBZ65: "-",
            JYJG66_JYJL30: "√",
            DTBZ66: "-",
            DTSJ702: "45",
            JYJG67_JYJL31: "√",
            DTBZ67: "-",
            DTSJ74: "23",
            JYJG68_JYJL31: "-",
            DTBZ68: "-",
            JYJG69_JYJL32: "√",
            DTBZ69: "-",
            JYJG70_JYJL33: "√",
            DTBZ70: "-",
            JYJG71_JYJL33: "√",
            DTBZ71: "-",
            JYJG72_JYJL34: "√",
            DTBZ72: "-",
            JYJG73_JYJL34: "√",
            DTBZ73: "-",
            JYJG74_JYJL34: "√",
            DTBZ74: "-",
            JYJG75_JYJL34: "√",
            DTBZ75: "-",
            JYJG76_JYJL35: "√",
            DTBZ76: "-",
            JYJG77_JYJL36: "-",
            DTBZ77: "-",
            JYJG78_JYJL36: "-",
            DTBZ78: "-",
            JYJG79_JYJL38: "√",
            DTBZ79: "-",
            JYJG80_JYJL39: "-",
            DTBZ80: "-",
            JYJG81_JYJL39: "√",
            DTBZ81: "-",
            JYJG82_JYJL39: "√",
            DTBZ82: "-",
            JYJG83_JYJL39: "√",
            DTBZ83: "-",
            JYJG84_JYJL40: "-",
            DTBZ84: "-",
            JYJG85_JYJL40: "-",
            DTBZ85: "-",
            JYJG86_JYJL40: "-",
            DTBZ86: "-",
            JYJG87_JYJL40: "√",
            DTBZ87: "-",
            JYJG88_JYJL41: "√",
            DTBZ88: "-",
            JYJG89_JYJL41: "√",
            DTBZ89: "-",
            JYJG90_JYJL42: "√",
            DTBZ90: "-",
            JYJG91_JYJL43: "√",
            DTBZ91: "-",
        };

        keyvalArr = {
            ...keyvalarr1,
            ...keyvalarr2,
            ...keyvalarr3,
            ...keyvalarr4,
        };
        dat = replaceValuesWithFun(keyvalArr, gett);

    }
    function displayResult() {
        if (strtip.trim() === "") {
            strtip = "未发现问题";
        }
        input.value = strtip + "\n\n" + strinput;
        strtip = "";
        strinput = "";
        tipnum = 0;
    }
    function InspectionRecordInfo() {

        if (1) {
            //判断关键、一般项目结论与报告结论的关系
            if (1) {
                // 指定的数集合
                const specificNumbers = new Set([
                    4, 7, 9, 10, 12, 13, 18, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35,
                    36, 37, 38, 39, 40, 41, 42,
                ]);
                const normalNumbers = new Set([
                    1, 2, 3, 5, 6, 8, 11, 14, 15, 16, 17, 19, 20, 21, 22, 23, 32, 43,
                ]);
                const symbolToCheckBHG = "×";
                const symbolToCheckWCX = "-";
                const symbolToCheckFJHG = "△";
                //关键项目
                const GJbuhegeJson = getXMKeyValues(
                    dat,
                    specificNumbers,
                    symbolToCheckBHG
                );
                //一般项目
                const YBbuhegeJson = getXMKeyValues(
                    dat,
                    normalNumbers,
                    symbolToCheckBHG
                );
                //关键项目复检合格
                const GJFJHGJson = getXMKeyValues(
                    dat,
                    specificNumbers,
                    symbolToCheckFJHG
                );
                //一般项目复检合格
                const YBFJHGJson = getXMKeyValues(
                    dat,
                    normalNumbers,
                    symbolToCheckFJHG
                );

                if (Object.keys(GJbuhegeJson).length === 0) {
                    if (Object.keys(YBbuhegeJson).length === 0) {
                        if (gett("内部（全面）检验结论（电类定检）") != "合格") {
                            addstrtip("检验项目全部符合，检验结论应该为“合格”!");
                        }
                    } else if (
                        Object.keys(YBbuhegeJson).length +
                        Object.keys(YBFJHGJson).length <=
                        3
                    ) {
                        // 初始化一个数组来存储提取的数字
                        const extractedNumbers = [];
                        // 遍历JSON对象的每个键
                        for (const key in YBbuhegeJson) {
                            // 使用正则表达式匹配"JYJL"后面的数字
                            const match = key.match(/JYJL(\d+)/);
                            if (match) {
                                // 如果找到了匹配项，则将数字添加到数组中
                                extractedNumbers.push(parseInt(match[1], 10)); // 使用parseInt将字符串转换为整数
                            }
                        }
                        // 如果你只想要唯一的数字，并且不关心它们在原始JSON中的顺序，可以使用Set来去除重复项
                        const uniqueNumbers = [...new Set(extractedNumbers)];
                        if (!validateString1(dat.DTBZCS3, uniqueNumbers)) {
                            addstrtip(
                                "关键项目全部符合,一般项目不符合监护使用项及整改后符合项共不超过3项,备注有误！备注模板“本记录第1、2、3项的检验结果为不符合，使用单位已经承诺采取安全措施，对电梯实行监护使用（见编号为TZS-DT-2401804的《电梯检验意见通知书》）”，考虑格式、不符合项序号、意见通知书年份等是否有误！"
                            );
                        }
                        if (gett("内部（全面）检验结论（电类定检）") != "整改后合格") {
                            addstrtip(
                                "关键项目全部符合,一般项目不符合监护使用及整改后符合项共不超过3项,检验结论应该为“整改后合格”!"
                            );
                        }
                    } else if (
                        Object.keys(YBbuhegeJson).length +
                        Object.keys(YBFJHGJson).length >
                        3
                    ) {
                        addstrtip(
                            "关键项目全部符合,一般项目不符合监护使用项及整改后符合项共超过3项,一般项目都应打“×””！"
                        );
                    } else if (Object.keys(YBbuhegeJson).length > 3) {
                        if (gett("内部（全面）检验结论（电类定检）") != "不合格") {
                            addstrtip(
                                "关键项目全部符合,一般项目不符合共超过3项,检验结论应该为“不合格”!"
                            );
                        }
                    }
                } else {
                    if (gett("内部（全面）检验结论（电类定检）") != "不合格") {
                        addstrtip("关键项目有不符合，检验结论应该为“不合格”!");
                    }
                }
                const xiangmuBeizuJson = checkDTBZValues(dat);
                if (dat.DTBZ44 != "") {
                    if (Object.keys(xiangmuBeizuJson).length > 1) {
                        //"JYJG44_JYJL21":"√","DTBZ44":"-"对重块
                        addstrtip("除对重块备注外仍有检验项目备注不是空！");
                    }
                } else if (Object.keys(xiangmuBeizuJson).length > 0) {
                    //"JYJG44_JYJL21":"√","DTBZ44":"-"对重块
                    addstrtip("除对重块备注外仍有检验项目备注不是空！");
                }
            }
            //1-9
            //"JYJG1_JYJL1":"√","DTBZ1":""
            if (1) {
                //1
                if (dat.JYJG1_JYJL1 === "×") {
                    addstrtip(
                        "备注应说明“未注册，请持不合格报告到市民大厅办理注册后重新报检！”"
                    );
                }
                //4
                if (dat.JYJG8_JYJL4 === "-") {
                    if (parseFloat(dat.电梯运行速度) > 1) {
                        addstrtip("电梯速度与缓冲器类型不匹配！");
                    }
                }
                //5
                if (supervisionDate != null) {
                    const curdate = new Date();
                    if (curdate.getFullYear() - supervisionDate.getFullYear() > 14) {
                        if (dat.JYJG11_JYJL5 === "-") {
                            addstrtip("超过15年的电梯应检验第5项接地故障保护！");
                        }
                    }
                    if (curdate.getFullYear() - supervisionDate.getFullYear() < 15) {
                        if (dat.JYJG11_JYJL5 != "-") {
                            addstrtip("不超过15年的第5项电梯接地故障保护不需要检验！");
                        }
                    }
                }
                //6
                //"JYJG12_JYJL6":"","DTBZ12":"","JYJG13_JYJL6":"","DTBZ13":""
                //,"JYJG14_JYJL6":"","DTBZ14":"","JYJG15_JYJL6":"","DTBZ15":""
                if (supervisionDate != null) {
                    if (supervisionDate < new Date("2017-10-01")) {
                        if (
                            dat.JYJG12_JYJL6 != "-" ||
                            dat.JYJG13_JYJL6 != "-" ||
                            dat.JYJG14_JYJL6 != "-" ||
                            dat.JYJG15_JYJL6 != "-"
                        ) {
                            addstrtip("注意2017.10.1以前的电梯没有第6项旁路装置！");
                        }
                    }
                    if (supervisionDate >= new Date("2017-10-01")) {
                        if (
                            dat.JYJG12_JYJL6 === "-" ||
                            dat.JYJG13_JYJL6 === "-" ||
                            dat.JYJG14_JYJL6 === "-" ||
                            dat.JYJG15_JYJL6 === "-"
                        ) {
                            addstrtip("注意2017.10.1以后的电梯有第6项旁路装置！");
                        }
                    }
                }
                //7
                if (supervisionDate != null) {
                    if (supervisionDate < new Date("2017-10-01")) {
                        if (dat.JYJG16_JYJL7 != "-") {
                            addstrtip(
                                "注意2017.10.1以前的电梯不检验第7项制动器状态监测功能！"
                            );
                        }
                    }
                    if (supervisionDate >= new Date("2017-10-01")) {
                        if (dat.JYJG16_JYJL7 === "-") {
                            addstrtip(
                                "注意2017.10.1以后的电梯应检验第7项制动器状态监测功能！"
                            );
                        }
                    }
                }
            }
            //10-19
            if (1) {
                //10
                //10."JYJG20_JYJL10":"","DTBZ20":""
                if (1) {
                    if (parseInt(dat.电梯层站) > 7) {
                        if (dat.JYJG20_JYJL10 === "-") {
                            addstrtip("注意提升高度大于30m需要设置第10项紧急报警装置!");
                        }
                    } else if (parseInt(dat.电梯层站) <= 7) {
                        if (dat.JYJG20_JYJL10 != "-") {
                            addstrtip(
                                "注意提升高度小于30m可能不需要设置第10项紧急报警装置!"
                            );
                        }
                    }
                }
                //12
                //"JYJG22_JYJL12":"","DTBZ22":"","JYJG23_JYJL12":"","DTBZ23":"","JYJG24_JYJL12":"","DTBZ24":""
                if (supervisionDate != null) {
                    if (supervisionDate < new Date('2024-04-02')) {
                        if (dat.JYJG22_JYJL12 != "-") {
                            addstrtip("未按照TSG T7001-2023监督检验的电梯，12-1不检验！");
                        }
                    }
                    if (supervisionDate >= new Date('2024-04-02')) {
                        if (dat.JYJG22_JYJL12 === "-") {
                            addstrtip("按照TSG T7001-2023监督检验的电梯，12-1需要检验！");
                        }
                    }
                }
                //13手动紧急操作装置
                //JYJG28_JYJL13
                if (manufactureDate != null) {
                    if (manufactureDate < new Date('2004-01-01')) {
                        if (dat.JYJG28_JYJL13 != "-") {
                            addstrtip(
                                "按照GB7588-1995及更早标准生产的电梯,如果未依据TSG T7001、2023检验,第13(4)是否不检验!"
                            );
                        }
                    }
                    if (manufactureDate >= new Date('2004-01-01')) {
                        if (dat.JYJG28_JYJL13 === "-") {
                            addstrtip(
                                "注意按照GB7588-2003及之后新标准生产的电梯，若带有盘车手轮,第13(4)是否应检验!"
                            );
                        }
                    }
                    if (dat.JYJG27_JYJL13 === '-') {
                        if (dat.JYJG28_JYJL13 != '-') {
                            addstrtip('若13(3)无此项，那么13(4)也应是无此项！');
                        }
                    }
                    if (dat.JYJG28_JYJL13 != '-') {
                        if (dat.JYJG27_JYJL13 === '-') {
                            addstrtip('若13(4)符合，那么13(3)也应是符合！');
                        }
                    }
                }
                //14、15
                //钢丝绳、包覆带
                if (1) {
                    if (dat.JYJG30_JYJL14 != "-" || dat.JYJG31_JYJL14 != "-") {
                        if (
                            dat.JYJG32_JYJL15 != "-" ||
                            dat.JYJG33_JYJL15 != "-" ||
                            dat.JYJG34_JYJL15 != "-"
                        ) {
                            addstrtip("14、15钢丝绳和包覆带有同时勾选!");
                        }
                    }
                    if (supervisionDate != null) {
                        const curdate = new Date();
                        if (curdate.getFullYear() - supervisionDate.getFullYear() < 15) {
                            if (dat.JYJG30_JYJL14 != "-" || dat.JYJG31_JYJL14 != "-") {
                                addstrtip("不超过15年的电梯14项钢丝绳不需要检验!");
                            }
                        }
                    }
                    if (supervisionDate != null) {
                        const curdate = new Date();
                        if (curdate.getFullYear() - supervisionDate.getFullYear() < 15) {
                            if (
                                dat.JYJG32_JYJL15 != "-" ||
                                dat.JYJG33_JYJL15 != "-" ||
                                dat.JYJG34_JYJL15 != "-"
                            ) {
                                addstrtip("不超过15年的电梯15项包覆带不需要检验!");
                            }
                        }
                    }
                    if (supervisionDate != null) {
                        const curdate = new Date();
                        if (curdate.getFullYear() - supervisionDate.getFullYear() > 14) {
                            if (dat.JYJG30_JYJL14 === "-" && dat.JYJG31_JYJL14 === "-") {
                                if (
                                    dat.JYJG32_JYJL15 === "-" ||
                                    dat.JYJG33_JYJL15 === "-" ||
                                    dat.JYJG34_JYJL15 === "-"
                                ) {
                                    addstrtip("14、15钢丝绳和包覆带至少选一类!");
                                }
                            }
                        }
                    }
                    if (supervisionDate != null) {
                        if (supervisionDate < new Date('2024-04-02')) {
                            if (dat.JYJG33_JYJL15 != "-" || dat.JYJG34_JYJL15 != "-") {
                                addstrtip(
                                    "未按照TSG T7001-2023监督检验的电梯,15-2、3不检验!"
                                );
                            }
                        }
                        if (supervisionDate >= new Date('2024-04-02')) {
                            if (dat.JYJG33_JYJL15 === "-" || dat.JYJG34_JYJL15 === "-") {
                                addstrtip(
                                    "按照TSG T7001-2023监督检验的电梯,15-2、3需要检验!"
                                );
                            }
                        }
                    }
                }
                //16悬挂装置端部固定
                if (supervisionDate != null) {
                    const curdate = new Date();
                    if (curdate.getFullYear() - supervisionDate.getFullYear() > 14) {
                        if (dat.JYJG35_JYJL16 === "-") {
                            addstrtip("超过15年的电梯应检验第16项悬挂装置端部固定！");
                        }
                    }
                    if (curdate.getFullYear() - supervisionDate.getFullYear() < 15) {
                        if (dat.JYJG35_JYJL16 != "-") {
                            addstrtip("不超过15年的第16项悬挂装置端部固定不需要检验！");
                        }
                    }
                }
                //18_JYJL18))
                //速度与反绳轮

                if (1) {
                    if (supervisionDate >= new Date("2024-04-02")) {
                        if (parseFloat(dat.电梯运行速度) <= 1.75) {
                            if (
                                !(
                                    (dat.JYJG37_JYJL18 === "-" &&
                                        dat.JYJG38_JYJL18 === "-" &&
                                        dat.JYJG39_JYJL18 === "-" &&
                                        dat.JYJG40_JYJL18 === "-") ||
                                    (dat.JYJG37_JYJL18 != "-" &&
                                        dat.JYJG38_JYJL18 != "-" &&
                                        dat.JYJG39_JYJL18 != "-" &&
                                        dat.JYJG40_JYJL18 != "-")
                                )
                            ) {
                                addstrtip("2024-04-02及之后监督,速度不大于1.75,第18项全部有(采用非金属)或者无此项(采用金属)!");
                            }
                            if (dat.JYJG37_JYJL18 != "-" &&
                                dat.JYJG38_JYJL18 != "-" &&
                                dat.JYJG39_JYJL18 != "-" &&
                                dat.JYJG40_JYJL18 != "-") {
                                if (!(dat.JYJG37_JYJL18 === "√" || dat.JYJG37_JYJL18 === "△")) {
                                    addstrtip('2024-04-02及之后监督,速度不大于1.75,第18项采用非金属反绳轮时,18(1)应为符合或整改后符合!');
                                }
                            }
                        } else {
                            if (!(dat.JYJG37_JYJL18 === "-" &&
                                dat.JYJG38_JYJL18 === "-" &&
                                dat.JYJG39_JYJL18 === "-" &&
                                dat.JYJG40_JYJL18 === "-")) {
                                addstrtip('2024-04-02及之后监督,速度大于1.75,第18项只能采用金属反绳轮!');
                            }
                        }
                    } else {
                        if (parseFloat(dat.电梯运行速度) <= 1.75) {
                            if (!(dat.JYJG37_JYJL18 === "-" &&
                                dat.JYJG38_JYJL18 === "-" &&
                                dat.JYJG39_JYJL18 === "-" &&
                                dat.JYJG40_JYJL18 === "-")) {
                                if (dat.JYJG39_JYJL18 != "-" &&
                                    dat.JYJG40_JYJL18 != "-") {
                                    if (!(dat.JYJG37_JYJL18 === "√" || dat.JYJG37_JYJL18 === "△" || dat.JYJG37_JYJL18 === "-")) {
                                        addstrtip('2024-04-02之前监督,速度不大于1.75,第18项采用非金属反绳轮时,18(1)应为符合、整改后符合或无此项!');
                                    }
                                    if (!(dat.JYJG38_JYJL18 === "√" || dat.JYJG38_JYJL18 === "△" || dat.JYJG38_JYJL18 === "-")) {
                                        addstrtip('2024-04-02之前监督,速度不大于1.75,第18项采用非金属反绳轮时,18(2)应为符合、整改后符合或无此项!');
                                    }
                                } else {
                                    addstrtip('2024-04-02之前监督,速度不大于1.75,第18项采用非金属反绳轮时,18(3)(4)都应不是无此项!');
                                }
                            }
                        } else {
                            if (!(dat.JYJG37_JYJL18 === "-" &&
                                dat.JYJG38_JYJL18 === "-" &&
                                dat.JYJG39_JYJL18 === "-" &&
                                dat.JYJG40_JYJL18 === "-")) {
                                if (dat.JYJG39_JYJL18 != "-" &&
                                    dat.JYJG40_JYJL18 != "-") {
                                    if (dat.JYJG37_JYJL18 != "-") {
                                        addstrtip('2024-04-02之前监督,速度大于1.75,第18项采用非金属反绳轮时,18(1)应为无此项!');
                                    }
                                    if (!(dat.JYJG38_JYJL18 === "√" || dat.JYJG38_JYJL18 === "△" || dat.JYJG38_JYJL18 === "-")) {
                                        addstrtip('2024-04-02之前监督,速度大于1.75,第18项采用非金属反绳轮时,18(2)应为符合、整改后符合或无此项!');
                                    }
                                } else {
                                    addstrtip('2024-04-02之前监督,速度大于1.75,第18项采用非金属反绳轮时,18(3)(4)都应不是无此项!');
                                }
                            }
                        }
                    }
                }
            }
            //20-29
            if (1) {
                //21对重块数量或高度
                //"JYJG44_JYJL21":"√","DTBZ44":"-"
                if (dat.JYJG44_JYJL21 === "√") {
                    if (
                        !/^\d+(\.\d+)?\s*(块|厘米|cm|毫米|mm|米|m)$/i.test(dat.DTBZ44)
                    ) {
                        addstrtip("第21(2)对重块备注信息填写错误！");
                    }
                }
                if (supervisionDate < new Date("2024-04-02")) {
                    if(dat.JYJG45_JYJL21!='-'){
                        addstrtip('注意2024.4.2之前监督检验的电梯，21(3)是否不检验！')
                    }
                }else{
                    if(dat.JYJG45_JYJL21==='-'){
                        addstrtip('注意2024.4.2及之后监督检验的电梯，21(3)是否需要检验！')
                    }
                }
                //23轿厢语音播报系统
                if (supervisionDate != null) {
                    if (supervisionDate < new Date('2024-04-02')) {
                        if (dat.JYJG49_JYJL23 != "-") {
                            addstrtip("未按照TSG T7001-2023监督检验的电梯，第23项不检验！");
                        }
                    }
                    if (supervisionDate >= new Date('2024-04-02')) {
                        if (dat.JYJG49_JYJL23 === "-") {
                            addstrtip("按照TSG T7001-2023监督检验的电梯，第23项需要检验！");
                        }
                    }
                }
                //24门扇间隙
                if (
                    (dat.JYJG50_JYJL24 === "-" && dat.DTSJ503 != "-") ||
                    (dat.JYJG50_JYJL24 != "-" && dat.DTSJ503 === "-")
                ) {
                    addstrtip("第24项门间隙(1)测量数据与结果矛盾！");
                }
                if (
                    (dat.JYJG51_JYJL24 === "-" && dat.DTSJ504 != "-") ||
                    (dat.JYJG51_JYJL24 != "-" && dat.DTSJ504 === "-")
                ) {
                    addstrtip("第24项门间隙(2)测量数据与结果矛盾！");
                }
                if (supervisionDate != null) {
                    const curdate = new Date();
                    if (curdate.getFullYear() - supervisionDate.getFullYear() > 14) {
                        if (
                            dat.JYJG50_JYJL24 === "-" ||
                            dat.JYJG51_JYJL24 === "-" ||
                            dat.DTSJ503 === "-" ||
                            dat.DTSJ504 === "-"
                        ) {
                            addstrtip("超过15年的电梯应检验第24项门间隙!");
                        } else {
                            if (dat.设备分类代码 === "曳引驱动乘客电梯") {
                                if (/^([1-9]\d*(\.\d+)?|0\.\d+)(mm|MM|毫米)?$/.test(dat.DTSJ503)) {
                                    if (
                                        parseFloat(dat.DTSJ503) <= 6 &&
                                        parseFloat(dat.DTSJ503) >= 0
                                    ) {
                                        if (dat.JYJG50_JYJL24 === "×") {
                                            addstrtip(
                                                "第24项门间隙(1)实测值:" + dat.DTSJ503 + "应为符合！"
                                            );
                                        }
                                    } else if (parseFloat(dat.DTSJ503) > 6) {
                                        if (dat.JYJG50_JYJL24 != "×") {
                                            addstrtip(
                                                "第24项门间隙(1)实测值:" +
                                                dat.DTSJ503 +
                                                "应为不符合！"
                                            );
                                        }
                                    }
                                } else if (/^≤6(mm|MM|毫米)?$/.test(dat.DTSJ503)) {
                                    if (dat.JYJG50_JYJL24 === "×") {
                                        addstrtip(
                                            "第24项门间隙(1)目测值:" + dat.DTSJ503 + "应为符合！"
                                        );
                                    }
                                } else {
                                    addstrtip("第24项门间隙(1)测量值格式错误！");
                                }
                            } else if (dat.设备分类代码 === "曳引驱动载货电梯") {
                                if (/^([1-9]\d*(\.\d+)?|0\.\d+)(mm|MM|毫米)?$/.test(dat.DTSJ503)) {
                                    if (
                                        parseFloat(dat.DTSJ503) <= 10 &&
                                        parseFloat(dat.DTSJ503) >= 0
                                    ) {
                                        if (dat.JYJG50_JYJL24 === "×") {
                                            addstrtip(
                                                "第24项门间隙(1)实测值:" + dat.DTSJ503 + "应为符合！"
                                            );
                                        }
                                    } else if (parseFloat(dat.DTSJ503) > 10) {
                                        if (dat.JYJG50_JYJL24 != "×") {
                                            addstrtip(
                                                "第24项门间隙(1)实测值:" +
                                                dat.DTSJ503 +
                                                "应为不符合！"
                                            );
                                        }
                                    }
                                } else if (/^≤10(mm|MM|毫米)?$/.test(dat.DTSJ503)) {
                                    if (dat.JYJG50_JYJL24 === "×") {
                                        addstrtip(
                                            "第24项门间隙(1)目测值:" + dat.DTSJ503 + "应为符合！"
                                        );
                                    } else {
                                        addstrtip("第24项门间隙(1)测量值格式错误！");
                                    }
                                }
                            }
                            if (/^([1-9]\d*(\.\d+)?|0\.\d+)(mm|MM|毫米)?$/.test(dat.DTSJ504)) {
                                if (parseFloat(dat.DTSJ504) <= 30) {
                                    if (dat.JYJG51_JYJL24 === "×") {
                                        addstrtip(
                                            "第24项门间隙(2)实测值:" + dat.DTSJ504 + "应为符合！"
                                        );
                                    }
                                } else if (
                                    parseFloat(dat.DTSJ504) > 30 &&
                                    parseFloat(dat.DTSJ504) <= 45
                                ) {
                                    if (dat.JYJG51_JYJL24 === "×") {
                                        addstrtip(
                                            "若为中分门,第24项门间隙(2)实测值:" +
                                            dat.DTSJ504 +
                                            "应为符合！"
                                        );
                                    } else if (dat.JYJG51_JYJL24 != "×") {
                                        addstrtip(
                                            "若为旁开门，第24项门间隙(2)实测值:" +
                                            dat.DTSJ504 +
                                            "应为不符合！"
                                        );
                                    }
                                } else {
                                    if (dat.JYJG51_JYJL24 != "×") {
                                        addstrtip(
                                            "第24项门间隙(2)实测值:" + dat.DTSJ504 + "应为不符合！"
                                        );
                                    }
                                }
                            } else if (dat.DTSJ504 === "≤45(mm|MM|毫米)?") {
                                if (dat.JYJG51_JYJL24 === "×") {
                                    addstrtip(
                                        "第24项门间隙(2)实测值:" + dat.DTSJ504 + "应为符合！"
                                    );
                                }
                            } else {
                                addstrtip("第24项门间隙(2)实测值格式错误！");
                            }
                        }
                    }
                    if (curdate.getFullYear() - supervisionDate.getFullYear() < 15) {
                        if (
                            dat.JYJG50_JYJL24 != "-" ||
                            dat.JYJG51_JYJL24 != "-" ||
                            dat.DTSJ503 != "-" ||
                            dat.DTSJ504 != "-"
                        ) {
                            addstrtip("不超过15年的第24项门间隙不需要检验!");
                        }
                    }
                }
                //26门的运行和导向装置
                if (supervisionDate != null) {
                    if (supervisionDate < new Date('2024-04-02')) {
                        if (dat.JYJG55_JYJL26 != "-") {
                            addstrtip(
                                "注意2024.04.02以前监督检验的电梯不检验第26项(3)层门啮合标记!"
                            );
                        }
                    }
                    if (supervisionDate >= new Date('2024-04-02')) {
                        if (dat.JYJG55_JYJL26 === "-") {
                            addstrtip(
                                "注意2024.04.02及以后监督检验的电梯应检验第26项(3)层门啮合标记！"
                            );
                        }
                    }
                }
                //28紧急开锁
                if (supervisionDate != null) {
                    if (supervisionDate < new Date('2024-04-02')) {
                        if (dat.JYJG59_JYJL28 != "-") {
                            addstrtip("注意2024.04.02以前监督检验的电梯不检验第28项(2)紧急开锁!");
                        }
                    }
                    if (supervisionDate >= new Date('2024-04-02')) {
                        if (dat.JYJG59_JYJL28 === "-") {
                            addstrtip("注意2024.04.02及以后监督检验的电梯应检验第28项(2)紧急开锁！");
                        }
                    }
                }
                //29门的锁紧
                //"JYJG60_JYJL29":"","DTBZ60":"","DTSJ700":"7mm","JYJG61_JYJL29":"","DTBZ61":"","JYJG62_JYJL29":"","DTBZ62":"","JYJG63_JYJL29":"","DTBZ63":""
                if (
                    (dat.JYJG61_JYJL29 === "-" && dat.DTSJ700 != "-") ||
                    (dat.JYJG61_JYJL29 != "-" && dat.DTSJ700 === "-")
                ) {
                    addstrtip("第29项门锁紧(2)测量数据与结果矛盾！");
                }
                if (/^(＞|≥|大于|大于等于)?([1-9]\d*(\.\d+)?|0\.\d+)?(mm|MM|毫米)?$/.test(dat.DTSJ700)) {
                    if (dat.JYJG61_JYJL29 === "√" || dat.JYJG61_JYJL29 === "△") {
                        if (parseFloat(dat.DTSJ700) < 7) {
                            addstrtip("第29项锁紧啮合深度测量数据显示结果应为不符合!");
                        }
                    }
                    if (dat.JYJG61_JYJL29 === "×") {
                        if (parseFloat(dat.DTSJ700) >= 7) {
                            addstrtip("第29项锁紧啮合深度测量数据显示结果应为符合!");
                        }
                    }
                } else {
                    addstrtip("第29项锁紧啮合深度测量数值格式错误!");
                }
            }
            //30-39
            if (1) {
                //31平衡系数
                //DTSJ702，"JYJG67_JYJL31":"","DTBZ67":"","DTSJ74":"","JYJG68_JYJL31":"","DTBZ68":""
                if (1) {
                    if (
                        (dat.JYJG67_JYJL31 === "-" && dat.DTSJ702 != "-") ||
                        (dat.JYJG67_JYJL31 != "-" && dat.DTSJ702 === "-")
                    ) {
                        addstrtip("第31项平衡系数(1)测量数据与结果矛盾！");
                    }
                    if (
                        (dat.JYJG68_JYJL31 === "-" && dat.DTSJ74 != "-") ||
                        (dat.JYJG68_JYJL31 != "-" && dat.DTSJ74 === "-")
                    ) {
                        addstrtip("第31项平衡系数(2)测量数据与结果矛盾！");
                    }
                    if (dat.JYJG90_JYJL42 != "-") {
                        if (/^([1-9]\d*(\.\d+)?|0\.\d+)$/.test(dat.DTSJ702)) {
                            if (dat.JYJG67_JYJL31 === "√" || dat.JYJG67_JYJL31 === "△") {
                                if (
                                    parseFloat(dat.DTSJ702) < 40 ||
                                    parseFloat(dat.DTSJ702) > 50
                                ) {
                                    addstrtip("第31项平衡系数(1)测量数据显示结果应为不符合!");
                                }
                            }
                            if (dat.JYJG67_JYJL31 === "×") {
                                if (
                                    parseFloat(dat.DTSJ702) >= 40 &&
                                    parseFloat(dat.DTSJ702) <= 50
                                ) {
                                    addstrtip("第31项平衡系数(1)测量数据显示结果应为符合!");
                                }
                            }
                            if (dat.JYJG67_JYJL31 === "-") {
                                addstrtip("第31项平衡系数(1)测量数据与结果矛盾!");
                            }
                            if (dat.JYJG67_JYJL31 === "×") {
                                const rs32_34 =
                                    dat.JYJG69_JYJL32 !== "-" ||
                                    dat.JYJG70_JYJL33 !== "-" ||
                                    dat.JYJG71_JYJL33 !== "-" ||
                                    dat.JYJG72_JYJL34 !== "-" ||
                                    dat.JYJG73_JYJL34 !== "-" ||
                                    dat.JYJG74_JYJL34 !== "-" ||
                                    dat.JYJG75_JYJL34 !== "-";
                                const rs35_39 =
                                    dat.JYJG76_JYJL35 !== "-" ||
                                    dat.JYJG77_JYJL36 !== "-" ||
                                    dat.JYJG78_JYJL36 !== "-" ||
                                    dat.JYJG79_JYJL38 !== "-" ||
                                    dat.JYJG80_JYJL39 !== "-" ||
                                    dat.JYJG81_JYJL39 !== "-" ||
                                    dat.JYJG82_JYJL39 !== "-" ||
                                    dat.JYJG83_JYJL39 !== "-";
                                const rs40_43 =
                                    dat.JYJG84_JYJL40 !== "-" ||
                                    dat.JYJG85_JYJL40 !== "-" ||
                                    dat.JYJG86_JYJL40 !== "-" ||
                                    dat.JYJG87_JYJL40 !== "-" ||
                                    dat.JYJG88_JYJL41 !== "-" ||
                                    dat.JYJG89_JYJL41 !== "-" ||
                                    dat.JYJG90_JYJL42 !== "-" ||
                                    dat.JYJG91_JYJL43 !== "-";
                                if (rs32_34 || rs35_39 || rs40_43) {
                                    addstrtip("平衡系数不合格,第32-43项应为“-”！");
                                }
                            }
                        } else {
                            addstrtip("第31项平衡系数(1)测量数值格式错误!");
                        }
                        const phxs2 = document
                            .getElementById("1701504018295d212")
                            .innerText.trim();
                        if (phxs2 != "-" || dat.JYJG68_JYJL31 != "-") {
                            addstrtip("制动试验时只进行第31项(1)的检验！");
                        }
                    } else {
                        if (dat.DTSJ702 != "-" || dat.JYJG67_JYJL31 != "-") {
                            addstrtip("没有制动试验时只进行第31项(2)的检验！");
                        }
                        const phxs22 = document
                            .getElementById("1701504018295d212")
                            .innerText.trim();
                        if (/^([1-9]\d*(\.\d+)?|0\.\d+)$/.test(phxs22)) {
                            if (dat.JYJG68_JYJL31 === "√" || dat.JYJG68_JYJL31 === "△") {
                                if (parseFloat(phxs22) < 40 || parseFloat(phxs22) > 50) {
                                    addstrtip("第31项平衡系数(2)测量数据显示结果应为不符合!");
                                }
                            }
                            if (dat.JYJG68_JYJL31 === "×") {
                                if (parseFloat(phxs22) >= 40 && parseFloat(phxs22) <= 50) {
                                    addstrtip("第31项平衡系数(2)测量数据显示结果应为符合!");
                                }
                            }
                            if (dat.JYJG68_JYJL31 === "-") {
                                addstrtip("第31项平衡系数(2)测量数据与结果矛盾!");
                            }
                            if (dat.JYJG68_JYJL31 === "×") {
                                const rs32_34 =
                                    dat.JYJG69_JYJL32 !== "-" ||
                                    dat.JYJG70_JYJL33 !== "-" ||
                                    dat.JYJG71_JYJL33 !== "-" ||
                                    dat.JYJG72_JYJL34 !== "-" ||
                                    dat.JYJG73_JYJL34 !== "-" ||
                                    dat.JYJG74_JYJL34 !== "-" ||
                                    dat.JYJG75_JYJL34 !== "-";
                                const rs35_39 =
                                    dat.JYJG76_JYJL35 !== "-" ||
                                    dat.JYJG77_JYJL36 !== "-" ||
                                    dat.JYJG78_JYJL36 !== "-" ||
                                    dat.JYJG79_JYJL38 !== "-" ||
                                    dat.JYJG80_JYJL39 !== "-" ||
                                    dat.JYJG81_JYJL39 !== "-" ||
                                    dat.JYJG82_JYJL39 !== "-" ||
                                    dat.JYJG83_JYJL39 !== "-";
                                const rs40_43 =
                                    dat.JYJG84_JYJL40 !== "-" ||
                                    dat.JYJG85_JYJL40 !== "-" ||
                                    dat.JYJG86_JYJL40 !== "-" ||
                                    dat.JYJG87_JYJL40 !== "-" ||
                                    dat.JYJG88_JYJL41 !== "-" ||
                                    dat.JYJG89_JYJL41 !== "-" ||
                                    dat.JYJG90_JYJL42 !== "-" ||
                                    dat.JYJG91_JYJL43 !== "-";
                                if (rs32_34 || rs35_39 || rs40_43) {
                                    addstrtip("平衡系数不合格,第32-43项应为“-”！");
                                }
                            }
                        } else {
                            if (/^40(%)?-50$/.test(phxs22)) {
                                if (dat.JYJG68_JYJL31 === "×") {
                                    addstrtip('第31项平衡系数(2)"40-50"表明结果应为符合!');
                                }
                            } else {
                                addstrtip("第31项平衡系数(2)测量数值格式错误!");
                            }
                        }
                    }
                }
            }
            //39 上行超速保护
            //"JYJG80_JYJL39":"","DTBZ80":"","JYJG81_JYJL39":"","DTBZ81":"","JYJG82_JYJL39":"","DTBZ82":"","JYJG83_JYJL39":"","DTBZ83":""
            if (manufactureDate != null) {
                if (manufactureDate < new Date('2004-01-01')) {
                    if (
                        dat.JYJG80_JYJL39 != "-" ||
                        dat.JYJG81_JYJL39 != "-" ||
                        dat.JYJG82_JYJL39 != "-" ||
                        dat.JYJG83_JYJL39 != "-"
                    ) {
                        addstrtip("注意2004.1.1之前生产的电梯，上行超速保护是否不检验!");
                    }
                }
                if (manufactureDate >= new Date('2004-01-01')) {
                    if (
                        dat.JYJG80_JYJL39 === "-" ||
                        dat.JYJG81_JYJL39 === "-" ||
                        dat.JYJG83_JYJL39 === "-"
                    ) {
                        addstrtip(
                            "注意2004.1.1之后生产的电梯，上行超速保护是否需要检验!"
                        );
                    }
                }
            }
            //40-43
            if (1) {
                //40 轿厢意外移动
                //40."JYJG84_JYJL40":"","DTBZ84":"","JYJG85_JYJL40":"","DTBZ85":"","JYJG86_JYJL40":"","DTBZ86":"","JYJG87_JYJL40":"","DTBZ87":""
                if (manufactureDate != null) {
                    if (manufactureDate < new Date('2016-07-01')) {
                        if (
                            dat.JYJG84_JYJL40 != "-" ||
                            dat.JYJG85_JYJL40 != "-" ||
                            dat.JYJG86_JYJL40 != "-" ||
                            dat.JYJG87_JYJL40 != "-"
                        ) {
                            addstrtip(
                                "注意2016.7.1之前生产的电梯，轿厢意外移动是否不检验!"
                            );
                        }
                    }
                    if (manufactureDate >= new Date('2016-07-01')) {
                        if (
                            dat.JYJG84_JYJL40 === "-" ||
                            dat.JYJG85_JYJL40 === "-" ||
                            dat.JYJG87_JYJL40 === "-"
                        ) {
                            addstrtip(
                                "注意2016.7.1之后生产的电梯，轿厢意外移动是否需要检验!"
                            );
                        }
                    }
                }
                if (manufactureDate != null) {
                    if (manufactureDate >= new Date('2004-01-01') && manufactureDate < new Date('2016-07-01')) {
                        if (dat.JYJG86_JYJL40 != "-") {
                            addstrtip('注意制造于2004.01.01至2016.07.01的电梯，UCMP40(3)是否应为无此项！')
                        }
                    }
                    if (manufactureDate >= new Date('2016-07-01')) {
                        if (dat.JYJG82_JYJL39 != dat.JYJG86_JYJL40) {
                            addstrtip('注意制造于2016.07.01以后的电梯，上行超速保护39(3)和UCMP40(3)是否应相同，若确实采用了不同的制动装置，可忽略！')
                        }
                    }
                }
                //42 125制动试验
                //"JYJG90_JYJL42":"","DTBZ90":""
                if (lastBrakingDate != null) {
                    if (lastBrakingDate.getFullYear() === new Date().getFullYear()) {
                        if (dat.JYJG90_JYJL42 === "-") {
                            addstrtip("最近制动试验是在今年,第42项应为符合!");
                        }
                    }
                    if (lastBrakingDate.getFullYear() != new Date().getFullYear()) {
                        if (dat.JYJG90_JYJL42 != "-") {
                            addstrtip("最近制动试验不在今年,第42项应为“-”!");
                        }
                    }
                }
            }
        }
    }
    function StringToDate(str) {
        var strDate = str.split(" ");

        var strDatepart = strDate[0].split("-");

        var dtDate = new Date(strDatepart[0], strDatepart[1] - 1, strDatepart[2]);

        return dtDate;
    }
    function YearMonthToYearMonthDay(str) {
        if (str.length === 7) {
            str = str.concat("-01");
        }
        return str.trim();
    }
    function ZifuchuanIsDate(strdate) {
        //isNaN(strdate)返回为false则是日期格式；排除data为纯数字的情况（此处不考虑只有年份的日期，如‘2020）
        if (isNaN(strdate) && !isNaN(Date.parse(strdate))) {
            return true;
        } else {
            return false;
        }
    }
    function addstrtip(str) {
        strtip = strtip.concat("\n");
        tipnum = tipnum + 1;
        strtip = strtip.concat(tipnum.toString());
        strtip = strtip.concat("、");
        strtip = strtip.concat(str);
    }
    function isNormalInteger(str) {
        var n = Math.floor(Number(str));

        return n !== Infinity && String(n) === str && n >= 0;
    }
    function isValidSBDMFormat(text) {
        // 完整的正则表达式，匹配格式：(3110|3120) + 数组中的值 + 2000到2100之间的年份 + 五位数字顺序号
        const regex = /^(3110|3120)\d{6}(\d{4})\d{6}$/;
        // 首先判断基本的格式匹配
        if (regex.test(text)) {
            const match = text.match(regex);
            if (match) {
                var year = parseInt(match[2], 10);
                if (year >= 2000 && year <= 2100) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }
    // 解析日期，如果没有具体的日，则默认为月的第一天
    function parseDate(dateStr) {
        const dateRegex = /^(\d{4})年(\d{1,2})月(\d{1,2})?日?$/;
        const match = dateStr.match(dateRegex);
        if (!match) {
            return null;
        }
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const day = match[3] ? parseInt(match[3], 10) : 1;
        return new Date(year, month, day);
    }
    //根据监督检验日期验证某一年是检验还是检测，并给出该年具体检验检测日期
    //接收一个监督检验日期字符串
    function elevatorInspectionStr(supervisionDateStr, queryYear) {
        const dateRegex = /^(\d{4})年(\d{1,2})月/; // 正则表达式用于解析年份和月份
        const match = supervisionDateStr.match(dateRegex);
        if (match) {
            const supervisionYear = parseInt(match[1], 10);
            const supervisionMonth = parseInt(match[2], 10);
            const inspectionYears = [1, 4, 7, 9, 11, 13, 15]; // 检验规则年份
            let inspectionDates = [];
            // 生成检验日期
            inspectionYears.forEach((year) => {
                if (supervisionYear + year <= queryYear) {
                    inspectionDates.push(supervisionYear + year);
                }
            });
            // 处理超过15年后每年都检验的情况
            if (queryYear - supervisionYear > 15) {
                for (let year = supervisionYear + 16; year <= queryYear; year++) {
                    inspectionDates.push(year);
                }
            }
            // 判断查询年份需要的操作
            if (inspectionDates.includes(queryYear)) {
                return { result: "检验", year: queryYear, month: supervisionMonth };
            } else {
                return { result: "检测", year: queryYear, month: supervisionMonth };
            }
        } else {
            return { result: "错误", year: 0, month: 0 };
        }
    }
    //根据监督检验日期验证某一年是检验还是检测，并给出该年份后下次检验日期
    //接收监督检验日期和验证日期date类对象
    function elevatorInspection(supervisionDate, queryDate) {
        if (supervisionDate >= queryDate) {
            return { result: "错误", date: null };
        }
        if (
            new Date(
                queryDate.getFullYear(),
                supervisionDate.getMonth(),
                supervisionDate.getDate()
            ) < new Date(2023, 3, 1)
        ) {
            // 输出结果
            return {
                result: "检验",
                date: new Date(
                    queryDate.getFullYear() + 1,
                    supervisionDate.getMonth(),
                    supervisionDate.getDate()
                ),
            };
        } else {
            const supervisionYear = supervisionDate.getFullYear();
            const supervisionMonth = supervisionDate.getMonth();
            const queryYear = queryDate.getFullYear();
            const inspectionIntervals = [1, 4, 7, 9, 11, 13, 15]; // 定期检验的间隔年份
            let inspectionYears = new Set();
            // 生成所有定期检验的年份
            for (let year = supervisionYear; year <= queryYear + 15; year++) {
                if (
                    year - supervisionYear > 15 ||
                    inspectionIntervals.includes(year - supervisionYear)
                ) {
                    inspectionYears.add(year);
                }
            }
            // 确定查询年份是否是检验年份
            let inspectionStatus = inspectionYears.has(queryYear) ? "检验" : "检测";
            // 计算下一次检验的年份
            let nextInspectionYear = [...inspectionYears].find(
                (year) => year > queryYear
            );

            // 创建下次检验日期的Date对象
            let nextInspectionDate = nextInspectionYear
                ? new Date(nextInspectionYear, supervisionMonth, 1)
                : null;

            // 输出结果
            return { result: inspectionStatus, date: nextInspectionDate };
        }
    }
    function isValidSYDJFormat(text) {
        // 完整的正则表达式，匹配格式：(3110|3120) + 数组中的值 + 2000到2100之间的年份 + 五位数字顺序号
        const regex = /^(3110|3120)\d{6}(\d{4})\d{6}$/;
        // 首先判断基本的格式匹配
        if (regex.test(text)) {
            const match = text.match(regex);
            if (match) {
                var year = parseInt(match[2], 10);
                if (year >= 2000 && year <= 2100) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }
    function calculateBrakeDate(initialDate, queryDate) {
        const brakeIntervalBefore2024 = 5; // 2024年4月1日之前的制动间隔
        const brakeIntervalAfter2024 = 6; // 2024年4月1日及以后的制动间隔
        let resultDate = new Date(initialDate.getTime());
        let resultDatetemp = null;
        let currentYear = 0;
        while (resultDate <= queryDate) {
            resultDatetemp = new Date(resultDate.getTime());
            currentYear = resultDate.getFullYear();
            // 如果检验日期在2013年1月1日之前，第一次制动日期是2018年
            if (resultDate < new Date(2013, 0, 1)) {
                resultDate.setFullYear(2018);
            }
            // 如果检验日期在2013年1月1日及之后，2019.4.1之前，第一次制动日期隔5年做
            else if (resultDate < new Date(2019, 3, 1)) {
                resultDate.setFullYear(currentYear + brakeIntervalBefore2024);
            }
            // 如果检验日期在2019年4月1日及之后，第一次制动日期隔6年做
            else {
                resultDate.setFullYear(currentYear + brakeIntervalAfter2024);
            }
        }
        return resultDatetemp;
    }
    // 检查项目的键值对
    function getXMKeyValues(jsonData, specificNumbers, symbolToCheck) {
        const regex = /^JYJG(\d+)_JYJL(\d+)$/;
        let validKeyValues = {};

        for (let key in jsonData) {
            const match = key.match(regex);
            if (match) {
                const value = jsonData[key];
                const number = parseInt(match[2], 10);
                if (value === symbolToCheck && specificNumbers.has(number)) {
                    validKeyValues[key] = value;
                }
            }
        }

        return validKeyValues;
    }
    // 检查键值对是否符合条件
    function checkDTBZValues(jsonData) {
        const regex = /^DTBZ(\d+)$/;
        let results = [];

        for (let key in jsonData) {
            const match = key.match(regex);
            if (match) {
                const number = parseInt(match[1], 10);
                if (number >= 1 && number <= 91) {
                    if (jsonData[key] !== "") {
                        results.push({ key, value: jsonData[key] });
                    }
                }
            }
        }
        return results;
    }
    // 封面前得到后
    function getdtt(label) {
        var labelEl = Array.from(document.getElementsByTagName("span")).find(
            (el) => el.textContent === label
        );
        var widgetFieldEl = labelEl.parentElement;
        while (!widgetFieldEl.classList.contains("widget-field")) {
            widgetFieldEl = widgetFieldEl.parentElement;
        }
        return widgetFieldEl.nextElementSibling.innerText.trim();
    }
    // 表格前得到后
    function gethtt(label) {
        var labelEl = Array.from(document.getElementsByTagName("td")).find(
            (el) => el.textContent.trim() === label
        );
        return labelEl.nextElementSibling.innerText.trim();
    }
    // 直接得到
    function getdt(label) {
        var labelEl = Array.from(document.getElementsByTagName("span")).find(
            (el) => el.textContent === label
        );
        var widgetFieldEl = labelEl.parentElement;
        while (!widgetFieldEl.classList.contains("widget-field")) {
            widgetFieldEl = widgetFieldEl.parentElement;
        }
        return widgetFieldEl.innerText.trim();
    }
    // 获取表格对应值
    function getht(label) {
        var labelEl = Array.from(document.getElementsByTagName("td")).find(
            (el) => el.textContent.trim() === label
        );
        return labelEl.innerText.trim();
    }
    // 假设这段HTML代码已经在页面上加载

    // 定义一个函数来根据label的文本内容找到对应的span元素并获取其文本
    function gett(labelText) {
        // 使用XPath选择器来找到包含特定文本的label元素
        var label = document.evaluate(
            "//label[contains(., '" + labelText + "')]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        // 如果找到了label元素，则寻找它后面的span元素
        if (label) {
            var span = label.nextElementSibling; // 获取label元素的下一个兄弟元素
            if (span && span.classList.contains("widget-content")) {
                // 确保找到的元素是我们要的span
                return span.textContent || span.innerText; // 获取span元素的文本内容
            }
        }
        return null; // 如果没有找到，返回null
    }
    function replaceValuesWithFun(jn, fun) {
        // 遍历JSON对象的所有键
        for (var key in jn) {
            if (jn.hasOwnProperty(key)) {
                // 获取当前键对应的值
                var value = jn[key];
                // 使用提供的函数fun处理键名，并获取返回值
                var funResult = fun(key);
                // 如果fun返回的不是null，则用fun的返回值替换原值
                if (funResult !== null) {
                    jn[key] = funResult;
                }
            }
        }
        // 返回修改后的JSON对象
        return jn;
    }
    function validateAndExplainCode(input) {
        // 正则表达式匹配形式“详见（JD101）号工具箱”，并仅提取最后两位数字
        const regex =
            /^详见（(JD\d{1}\d{2}|SZSJD\d{2}|WZJD\d{2}|ZWJD\d{2}|GYJD\d{2})）号工具箱$/;
        const match = input.match(regex);

        if (!match) {
            return { isValid: false, message: "输入格式不正确。" };
        }

        // 提取编码部分
        const code = match[1];
        let department = "";
        // 只提取最后两位数字
        let sequence = parseInt(code.slice(-2), 10); // 使用slice(-2)直接从字符串末尾取最后两个字符

        // 根据编码解释其含义
        if (/^JD1\d{2}$/.test(code)) {
            department = "机电一部";
            if (sequence > 10)
                return { isValid: false, message: "机电一部顺序号超出范围。" };
        } else if (/^JD2\d{2}$/.test(code)) {
            department = "机电二部";
            if (sequence < 1 || sequence > 4)
                return { isValid: false, message: "机电二部顺序号超出范围。" };
        } else if (/^JD3\d{2}$/.test(code)) {
            department = "机电三部";
            if (sequence > 8)
                return { isValid: false, message: "机电三部顺序号超出范围。" };
        } else if (/^SZSJD\d{2}$/.test(code)) {
            department = "石嘴山分院";
            if (sequence > 3)
                return { isValid: false, message: "石嘴山分院顺序号超出范围。" };
        } else if (/^WZJD\d{2}$/.test(code)) {
            department = "吴忠分院";
            if (sequence > 3)
                return { isValid: false, message: "吴忠分院顺序号超出范围。" };
        } else if (/^ZWJD\d{2}$/.test(code)) {
            department = "中卫分院";
            if (sequence > 3)
                return { isValid: false, message: "中卫分院顺序号超出范围。" };
        } else if (/^GYJD\d{2}$/.test(code)) {
            department = "固原分院";
            if (sequence > 3)
                return { isValid: false, message: "固原分院顺序号超出范围。" };
        } else {
            return { isValid: false, message: "未知的编码部分。" };
        }

        return {
            isValid: true,
            message: `本次检验使用了${department}:${code}，序号为${sequence}的工具箱。`,
        };
    }
    function validateString(str) {
        // 获取当前年份的后两位
        const currentYearSuffix = new Date().getFullYear().toString().slice(-2);

        // 正则表达式匹配中文全角或英文半角的小括号
        const regex =
            /^本记录第([\d＋、，]+)项的检验结果为不符合使用单位已经承诺采取安全措施，对电梯实行监护使用（见编号为TZS-DT-${currentYearSuffix}\d{5}的《电梯检验意见通知书》）$/;
        const match = str.match(regex);

        if (!match) {
            // 如果不匹配，直接返回false
            return false;
        }

        // 提取并分割数字字符串
        const numbersStr = match[1];
        const numbers = numbersStr
            .split(/[\d＋、，]+/)
            .filter((n) => n !== "")
            .map(Number);

        // 验证数字是否在1到43的范围内
        const isValidNumbers = numbers.every((num) => num >= 1 && num <= 43);

        // 验证XX4是否符合格式
        const xx4Match = str.match(/TZS-DT-${currentYearSuffix}(\d{5})/);
        const isValidXX4 = xx4Match && xx4Match[1].length === 5;

        // 返回最终验证结果
        return isValidNumbers && isValidXX4;
    }
    //不符合项序号也验证
    function validateString1(str, ssz) {
        // 将数组 ssz 转换成字符串并用顿号连接，同时支持中文和英文逗号
        const items = ssz.join("[、,]");
        // 构建正则表达式的动态部分，用于匹配 "第XX1、XX2、XX3项"
        const itemPattern = `第${items}项`;
        // 获取当前年份的最后两位
        const year = new Date().getFullYear().toString().slice(-2);
        // 定义正则表达式，匹配整个字符串
        // 注意：此处假设XX4的格式是 "TZS-DT-" 后跟 7 位数字，其中前两位是年份
        // 添加对中英文小括号的支持
        const regex = new RegExp(
            `^本记录${itemPattern}的检验结果为不符合[，,]使用单位已经承诺采取安全措施[，,]对电梯实行监护使用[（(]见编号为TZS-DT-${year}\\d{5}的《电梯检验意见通知书》[）)]$`
        );
        // 测试字符串是否符合正则表达式
        return regex.test(str);
    }
    //通过全国统一社会信用代码得到所在省份名称
    function getProvinceByKeyValue(code, jsonData) {
        // 确保字符串长度为18
        if (code.length !== 18) {
            return "";
        }

        // 获取第3到4位的子字符串
        const keyValue = code.substring(2, 4);

        // 查找qg对象中对应的键名
        for (const province in jsonData) {
            if (jsonData[province] === keyValue) {
                return province; // 返回找到的键名（省份名）
            }
        }

        // 如果没有找到对应的键，返回错误信息
        return "";
    }
    //对全国统一社会信用代码进行校验,有问题，和实际计算有差异
    function isValidUnifiedSocialCreditCode(code) {
        // 权重数组
        const weights = [
            1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28,
        ];
        // 校验码对应表
        const checkCodes = "0123456789ABCDEFGHJKLMNPQRTUWXY";
        // 字符到数字的映射，大写字母按照顺序映射，不包括I、O、S、V、Z
        const charToNumberMap = {
            A: 10,
            B: 11,
            C: 12,
            D: 13,
            E: 14,
            F: 15,
            G: 16,
            H: 17,
            J: 18,
            K: 19,
            L: 20,
            M: 21,
            N: 22,
            P: 23,
            Q: 24,
            R: 25,
            T: 26,
            U: 27,
            W: 28,
            X: 29,
            Y: 30,
        };

        // 确保统一社会信用代码长度为18位
        if (code.length !== 18) {
            return false;
        }

        // 计算加权和
        let sum = 0;
        for (let i = 0; i < 17; i++) {
            const char = code.charAt(i);
            let charCode;
            if (!isNaN(char)) {
                // 如果是数字，直接转换
                charCode = parseInt(char, 10);
            } else {
                // 如果是字母，通过映射转换
                charCode = charToNumberMap[char];
                if (charCode === undefined) {
                    // 如果字母不在映射中（如I、O、S、V、Z），则代码无效
                    return false;
                }
            }
            sum += charCode * weights[i];
        }

        // 计算校验码
        const remainder = sum % 31;
        const expectedCheckCode = checkCodes.charAt(remainder);

        // 校验最后一位是否匹配
        const actualCheckCode = code.charAt(17).toUpperCase();
        return expectedCheckCode === actualCheckCode;
    }
    // 函数用于判断18位字符串中第3到8位是否是nx对象中某个键的值，并返回对应的键名
    function findKeyFromCode(str, jsonData) {
        // 将给定字符串中的第3到8位提取出来
        var code = str.substr(2, 6);
        // 循环遍历 JSON 数据，查找匹配的键名
        for (var key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                if (jsonData[key] === code) {
                    return key;
                }
            }
        }

        // 如果没有找到匹配的键名，返回空字符串
        return "";
    }
    function checkRegionContainment(a, b) {
        // 检查b是否直接是a
        if (a === b) {
            return true;
        }

        // 寻找a和b所在的最高级区域
        const aRegion = findRegion(a, regions);
        const bRegion = findRegion(b, regions);

        if (!aRegion || !bRegion) {
            return false; // 如果a或b没有找到对应的区域，返回false
        }

        // 判断b所在的区域是否包含a所在的区域
        return isInRegion(a, b, regions);
    }
    // 递归地在regions中查找key所在的区域
    function findRegion(key, region) {
        if (region.hasOwnProperty(key)) {
            return region; // 如果找到了key，返回包含它的区域对象
        }

        // 遍历当前区域的所有子区域
        for (const subKey in region) {
            if (region[subKey] instanceof Object) {
                const result = findRegion(key, region[subKey]);
                if (result) return result;
            }
        }
        return null; // 如果没有找到，返回null
    }
    //验证为空
    //验证为空
    function isItemsEmpty() {
        //封面
        if (1) {
            if (getdtt("使用单位:") === "") {
                addstrtip("使用单位名称为空！");
                //highlightedFields.push(ddh('使用单位:'))
            }
            if (getdtt("设备代码:") === "") {
                addstrtip("设备代码为空！");
            }
            if (getdtt("设备类别:") === "") {
                addstrtip("设备类别为空！");
            }
            if (getdtt("检验日期:") === "") {
                addstrtip("封面检验日期为空！");
            }
        }
        //概况
        if (1) {
            if (gethtt("使用单位名称") === "") {
                addstrtip("概况使用单位名称为空！");
            }
            if (gethtt("统一社会信用代码") === "") {
                addstrtip("统一社会信用代码为空！");
            }
            if (gethtt("安装地点") === "") {
                addstrtip("安装地点为空！");
            }
            if (gethtt("设备品种") === "") {
                addstrtip("设备品种为空！");
            }
            if (gethtt("产品型号") === "") {
                addstrtip("产品型号为空！");
            }
            if (gethtt("产品编号") === "") {
                addstrtip("产品编号为空！");
            }
            if (gethtt("单位内编号") === "") {
                addstrtip("单位内编号为空！");
            }
            if (gethtt("使用登记证编号") === "") {
                addstrtip("使用登记证编号为空！");
            }
            if (gethtt("安全管理人员") === "") {
                addstrtip("安全管理人员为空！");
            }
            if (gethtt("电话") === "") {
                addstrtip("安全管理人员联系电话为空！");
            }
            if (gethtt("制造单位名称") === "") {
                addstrtip("制造单位名称为空！");
            }
            if (gethtt("制造日期") === "") {
                addstrtip("制造日期为空！");
            }
            if (gethtt("改造单位名称") === "") {
                addstrtip("改造单位名称为空！");
            }
            if (gethtt("改造日期") === "") {
                addstrtip("改造日期为空！");
            }
            if (gethtt("维护保养单位名称") === "") {
                addstrtip("维保单位名称为空！");
            }
            if (gethtt("最近一次制动试验确认日期") === "") {
                addstrtip("最近一次制动试验确认日期为空！");
            }
            if (gethtt("监督检验日期") === "") {
                addstrtip("监督检验日期为空！");
            }
            if (gethtt("是否加装电梯") === "") {
                addstrtip("是否加装电梯信息为空！");
            }
            if (gethtt("是否住宅电梯") === "") {
                addstrtip("是否住宅电梯信息为空！");
            }
            if (gethtt("下次检验日期") === "") {
                addstrtip("下次检验日期为空！");
            }
            if (gethtt("额定载重量") === "") {
                addstrtip("电梯额定载荷为空！");
            }
            if (gethtt("额定速度") === "") {
                addstrtip("电梯运行速度为空！");
            }
            if (dat.电梯层站 === "") {
                addstrtip("电梯层站为空！");
            }
            if (dat.电梯站数 === "") {
                addstrtip("电梯站数为空！");
            }
            if (dat.电梯门数 === "") {
                addstrtip("电梯门数为空！");
            }
            if (gethtt("控制方式") === "") {
                addstrtip("控制方式为空！");
            }
            if (gethtt("检验依据") === "") {
                addstrtip("检验依据为空！");
            }
            if (gethtt("主要检验仪器设备") === "") {
                addstrtip("主要检验仪器设备为空！");
            }
            if (getdt("XCJYTJ") === "") {
                addstrtip("现场检验条件为空！");
            }
            if (getdt("XCAQTJ") === "") {
                addstrtip("现场安全条件为空！");
            }
            if (getdt("内部（全面）检验结论（电类定检）") === "") {
                addstrtip("检验结论为空！");
            }
            if (getdt("内部（全面）检验日期（电类定检）") === "") {
                addstrtip("概况检验日期为空！");
            }
        }
        //1-5
        if (1) {
            if (gett("JYJG1_JYJL1") === "") {
                addstrtip("第1项第1个检验结果为空!");
            }
            if (gett("JYJG2_JYJL1") === "") {
                addstrtip("第1项第2个检验结果为空!");
            }
            if (gett("JYJG3_JYJL1") === "") {
                addstrtip("第1项第3个检验结果空!");
            }

            if (gett("JYJG4_JYJL2") === "") {
                addstrtip("第2项第1个检验结果空!");
            }

            if (gett("JYJG5_JYJL2") === "") {
                addstrtip("第2项第2个检验结果空!");
            }

            if (gett("JYJG6_JYJL3") === "") {
                addstrtip("第3项第1个检验结果空!");
            }

            if (gett("JYJG7_JYJL4") === "") {
                addstrtip("第4项第1个检验结果空!");
            }

            if (gett("JYJG8_JYJL4") === "") {
                addstrtip("第4项第2个检验结果空!");
            }

            if (gett("JYJG9_JYJL4") === "") {
                addstrtip("第4项第3个检验结果空!");
            }

            if (gett("JYJG10_JYJL4") === "") {
                addstrtip("第4项第4个检验结果空!");
            }

            if (gett("JYJG11_JYJL5") === "") {
                addstrtip("第5项第1个检验结果空!");
            }
        }
        //6-10
        if (1) {
            if (gett("JYJG12_JYJL6") === "") {
                addstrtip("第6项第1个检验结果为空!");
            }
            if (gett("JYJG13_JYJL6") === "") {
                addstrtip("第6项第2个检验结果为空!");
            }
            if (gett("JYJG14_JYJL6") === "") {
                addstrtip("第6项第3个检验结果为空!");
            }
            if (gett("JYJG15_JYJL6") === "") {
                addstrtip("第6项第4个检验结果为空!");
            }
            if (gett("JYJG16_JYJL7") === "") {
                addstrtip("第7项第1个检验结果为空!");
            }
            if (gett("JYJG17_JYJL8") === "") {
                addstrtip("第8项第1个检验结果为空!");
            }
            if (gett("JYJG18_JYJL8") === "") {
                addstrtip("第8项第2个检验结果为空!");
            }
            if (gett("JYJG19_JYJL9") === "") {
                addstrtip("第9项第1个检验结果为空!");
            }
            if (gett("JYJG20_JYJL10") === "") {
                addstrtip("第10项第1个检验结果为空!");
            }
        }
        //11-15
        if (1) {
            if (gett("JYJG21_JYJL11") === "") {
                addstrtip("第11项第1个检验结果为空!");
            }
            if (gett("JYJG22_JYJL12") === "") {
                addstrtip("第12项第1个检验结果为空!");
            }
            if (gett("JYJG23_JYJL12") === "") {
                addstrtip("第12项第2个检验结果为空!");
            }
            if (gett("JYJG24_JYJL12") === "") {
                addstrtip("第12项第3个检验结果为空!");
            }
            if (gett("JYJG25_JYJL13") === "") {
                addstrtip("第13项第1个检验结果为空!");
            }
            if (gett("JYJG26_JYJL13") === "") {
                addstrtip("第13项第2个检验结果为空!");
            }
            if (gett("JYJG27_JYJL13") === "") {
                addstrtip("第13项第3个检验结果为空!");
            }
            if (gett("JYJG28_JYJL13") === "") {
                addstrtip("第13项第4个检验结果为空!");
            }
            if (gett("JYJG29_JYJL13") === "") {
                addstrtip("第13项第5个检验结果为空!");
            }
            if (gett("JYJG30_JYJL14") === "") {
                addstrtip("第14项第1个检验结果为空!");
            }
            if (gett("JYJG31_JYJL14") === "") {
                addstrtip("第14项第2个检验结果为空!");
            }
            if (gett("JYJG32_JYJL15") === "") {
                addstrtip("第15项第1个检验结果为空!");
            }
            if (gett("JYJG33_JYJL15") === "") {
                addstrtip("第15项第2个检验结果为空!");
            }
            if (gett("JYJG34_JYJL15") === "") {
                addstrtip("第15项第3个检验结果为空!");
            }
        }
        //16-20
        if (1) {
            if (gett("JYJG35_JYJL16") === "") {
                addstrtip("第16项第1个检验结果为空!");
            }
            if (gett("JYJG36_JYJL17") === "") {
                addstrtip("第17项第1个检验结果为空!");
            }
            if (gett("JYJG37_JYJL18") === "") {
                addstrtip("第18项第1个检验结果为空!");
            }
            if (gett("JYJG38_JYJL18") === "") {
                addstrtip("第18项第2个检验结果为空!");
            }
            if (gett("JYJG39_JYJL18") === "") {
                addstrtip("第18项第3个检验结果为空!");
            }
            if (gett("JYJG40_JYJL18") === "") {
                addstrtip("第18项第4个检验结果为空!");
            }
            if (gett("JYJG41_JYJL19") === "") {
                addstrtip("第19项第1个检验结果为空!");
            }
            if (gett("JYJG42_JYJL20") === "") {
                addstrtip("第20项第1个检验结果为空!");
            }
        }
        //21-25
        if (1) {
            if (gett("JYJG43_JYJL21") === "") {
                addstrtip("第21项第1个检验结果为空!");
            }
            if (gett("JYJG44_JYJL21") === "") {
                addstrtip("第21项第2个检验结果为空!");
            }
            if (gett("JYJG45_JYJL21") === "") {
                addstrtip("第21项第3个检验结果为空!");
            }
            if (gett("JYJG46_JYJL21") === "") {
                addstrtip("第21项第4个检验结果为空!");
            }
            if (gett("JYJG47_JYJL22") === "") {
                addstrtip("第22项第1个检验结果为空!");
            }
            if (gett("JYJG48_JYJL22") === "") {
                addstrtip("第22项第2个检验结果为空!");
            }
            if (gett("JYJG49_JYJL23") === "") {
                addstrtip("第23项第1个检验结果为空!");
            }
            if (gett("JYJG50_JYJL24") === "") {
                addstrtip("第24项第1个检验结果为空!");
            }
            if (gett("JYJG51_JYJL24") === "") {
                addstrtip("第24项第2个检验结果为空!");
            }
            if (gett("JYJG52_JYJL25") === "") {
                addstrtip("第25项第1个检验结果为空!");
            }
        }
        //26-30
        if (1) {
            if (gett("JYJG53_JYJL26") === "") {
                addstrtip("第26项第1个检验结果为空!");
            }
            if (gett("JYJG54_JYJL26") === "") {
                addstrtip("第26项第2个检验结果为空!");
            }
            if (gett("JYJG55_JYJL26") === "") {
                addstrtip("第26项第3个检验结果为空!");
            }
            if (gett("JYJG56_JYJL27") === "") {
                addstrtip("第27项第1个检验结果为空!");
            }
            if (gett("JYJG57_JYJL27") === "") {
                addstrtip("第27项第2个检验结果为空!");
            }
            if (gett("JYJG58_JYJL28") === "") {
                addstrtip("第28项第1个检验结果为空!");
            }
            if (gett("JYJG59_JYJL28") === "") {
                addstrtip("第28项第2个检验结果为空!");
            }
            if (gett("JYJG60_JYJL29") === "") {
                addstrtip("第29项第1个检验结果为空!");
            }
            if (gett("JYJG61_JYJL29") === "") {
                addstrtip("第29项第2个检验结果为空!");
            }
            if (gett("JYJG62_JYJL29") === "") {
                addstrtip("第29项第3个检验结果为空!");
            }
            if (gett("JYJG63_JYJL29") === "") {
                addstrtip("第29项第4个检验结果为空!");
            }
            if (gett("JYJG64_JYJL30") === "") {
                addstrtip("第30项第1个检验结果为空!");
            }
            if (gett("JYJG65_JYJL30") === "") {
                addstrtip("第30项第2个检验结果为空!");
            }
            if (gett("JYJG66_JYJL30") === "") {
                addstrtip("第30项第3个检验结果为空!");
            }
        }
        //31-35
        if (1) {
            if (gett("JYJG67_JYJL31") === "") {
                addstrtip("第31项第1个检验结果为空!");
            }
            if (gett("JYJG68_JYJL31") === "") {
                addstrtip("第31项第2个检验结果为空!");
            }
            if (gett("JYJG69_JYJL32") === "") {
                addstrtip("第32项第1个检验结果为空!");
            }
            if (gett("JYJG70_JYJL33") === "") {
                addstrtip("第33项第1个检验结果为空!");
            }
            if (gett("JYJG71_JYJL33") === "") {
                addstrtip("第33项第2个检验结果为空!");
            }
            if (gett("JYJG72_JYJL34") === "") {
                addstrtip("第34项第1个检验结果为空!");
            }
            if (gett("JYJG73_JYJL34") === "") {
                addstrtip("第34项第2个检验结果为空!");
            }
            if (gett("JYJG74_JYJL34") === "") {
                addstrtip("第34项第3个检验结果为空!");
            }
            if (gett("JYJG75_JYJL34") === "") {
                addstrtip("第34项第4个检验结果为空!");
            }
            if (gett("JYJG76_JYJL35") === "") {
                addstrtip("第35项第1个检验结果为空!");
            }
        }
        //36-40
        if (1) {
            if (gett("JYJG77_JYJL36") === "") {
                addstrtip("第36项第1个检验结果为空!");
            }
            if (gett("JYJG78_JYJL36") === "") {
                addstrtip("第37项第1个检验结果为空!");
            }
            if (gett("JYJG79_JYJL38") === "") {
                addstrtip("第38项第1个检验结果为空!");
            }
            if (gett("JYJG80_JYJL39") === "") {
                addstrtip("第39项第1个检验结果为空!");
            }
            if (gett("JYJG81_JYJL39") === "") {
                addstrtip("第39项第2个检验结果为空!");
            }
            if (gett("JYJG82_JYJL39") === "") {
                addstrtip("第39项第3个检验结果为空!");
            }
            if (gett("JYJG83_JYJL39") === "") {
                addstrtip("第39项第4个检验结果为空!");
            }
            if (gett("JYJG84_JYJL40") === "") {
                addstrtip("第40项第1个检验结果为空!");
            }
            if (gett("JYJG85_JYJL40") === "") {
                addstrtip("第40项第2个检验结果为空!");
            }
            if (gett("JYJG86_JYJL40") === "") {
                addstrtip("第40项第3个检验结果为空!");
            }
            if (gett("JYJG87_JYJL40") === "") {
                addstrtip("第40项第4个检验结果为空!");
            }
        }
        //41-43
        if (1) {
            if (gett("JYJG88_JYJL41") === "") {
                addstrtip("第41项第1个检验结果为空!");
            }
            if (gett("JYJG89_JYJL41") === "") {
                addstrtip("第41项第2个检验结果为空!");
            }
            if (gett("JYJG90_JYJL42") === "") {
                addstrtip("第42项第1个检验结果为空!");
            }
            if (gett("JYJG91_JYJL43") === "") {
                addstrtip("第43项第1个检验结果为空!");
            }
        }
        //检验项目中的数值
        if (1) {
            /* if (gett(DTSJ503) === "") {
              addstrtip("第24项(1)测量值为空！");
            } */
            if (dat.DTSJ503 === "") {
                addstrtip("第24项(1)测量值为空！");
            }
            /* if (gett(DTSJ504) === "") {
              addstrtip("第24项(2)测量值为空！");
            } */
            if (dat.DTSJ504 === "") {
                addstrtip("第24项(2)测量值为空！");
            }
            /* if (gett(DTSJ700) === "") {
              addstrtip("第29项(2)测量值为空！");
            } */
            if (dat.DTSJ700 === "") {
                addstrtip("第29项(2)测量值为空！");
            }
            /* if (gett(DTSJ702) === "") {
              addstrtip("第31项(1)测量值为空！");
            } */
            if (dat.DTSJ702 === "") {
                addstrtip("第31项(1)测量值为空！");
            }
            /* if (gett(DTSJ74) === "") {
              addstrtip("第31项(2)测量值为空！");
            } */
            if (dat.DTSJ74 === "") {
                addstrtip("第31项(2)测量值为空！");
            }
        }

    }
    function CoverInfo() {
        username = document
            .getElementById("1581261202417784a")
            .innerText.trim();
        if (!/^[\u4e00-\u9fa5\(\)\（\）]{1,39}$/g.test(username)) {
            addstrtip("注意封面使用单位名称！");
        }
        usernameGK = document
            .getElementById("1555396405619039a")
            .innerText.trim();
        if (username != usernameGK) {
            addstrtip("封面与概况使用单位名称不一致！");
        }
        //设备代码
        if (1) {
            if (gett("设备代码") != "-") {
                const regex = /^(3110|3120)\d{5,6}(\d{4})\d{5,6}$/;
                if (regex.test(gett("设备代码"))) {
                    const sbdmfm = gett("设备代码").match(/^(\d{4})(\d{14}|\d{16})$/);
                    if (
                        /^3110$/.test(sbdmfm[1]) &&
                        !/^曳引驱动乘客电梯$/.test(gett("设备分类代码"))
                    ) {
                        addstrtip('封面设备代码3110表示"曳引驱动乘客电梯"!');
                    }
                    if (
                        /^3120$/.test(sbdmfm[1]) &&
                        !/^曳引驱动载货电梯$/.test(gett("设备分类代码"))
                    ) {
                        addstrtip('封面设备代码3120表示"曳引驱动载货电梯"!');
                    }
                } else {
                    addstrtip("封面设备代码格式错误！");
                }
            }
        }
        if (!/^曳引与强制驱动电梯$/.test(gett("SHEBEILEIBIE"))) {
            addstrtip("封面设备类别错误！");
        }
        jyrq = document
            .getElementById("1710387041337455d")
            .innerText.trim()
            .replace(/年|月|日/g, "-")
            .slice(0, -1); //封面检验日期
        jyrq = YearMonthToYearMonthDay(jyrq);
        if (
            /^\d{4}年\d{1,2}月\d{1,2}日$/.test(
                document.getElementById("1710387041337455d").innerText.trim()
            )
        ) {
        } else {
            addstrtip("封面检验日期格式为xxxx年xx月xx日");
        }
        if (!ZifuchuanIsDate(jyrq)) {
            addstrtip("封面检验日期格式错误！");
        }

    }
    function ProfileInfo() {
        if (!/^-$/.test(gett("使用单位组织机构代码"))) {
            if (!/^[^IOZSV]{18}$/.test(gett("使用单位组织机构代码"))) {
                addstrtip("统一社会信用代码错误！");
            } else {
                let sf = getProvinceByKeyValue(gett("使用单位组织机构代码"), qgsf);
                let nxdm = findKeyFromCode(gett("使用单位组织机构代码"), nx);
                let sfs = gett("使用单位组织机构代码").substring(2, 4);
                let nxdms = gett("使用单位组织机构代码").substring(2, 8);
                if (sf === "") {
                    addstrtip("统一社会信用代码3、4位省份信息错误!");
                } else if (sf != "宁夏回族自治区") {
                    addstrtip('统一社会信用代码3、4位:"' + sfs + '"显示省份为:' + sf);
                } else {
                    if (nxdm === "") {
                        addstrtip("统一社会信用代码第3到8位行政区划代码错误!");
                    } else {
                        if (nxdm != "宁夏回族自治区") {
                            if (!dat["设备使用(所在)地点"].includes(nxdm)) {
                                if (!checkRegionContainment(nxdm, dat["设备使用(所在)地点"])) {
                                    addstrtip(
                                        '注意使用单位统一社会信用代码注册地："' +
                                        nxdm +
                                        '"是否不在设备所在地！'
                                    );
                                } else {
                                    addstrtip(
                                        '统一社会信用代码第3到8位:"' +
                                        nxdms +
                                        '"显示使用单位在' +
                                        nxdm
                                    );
                                }
                            }
                        }

                    }
                }
            }
        }

        if (!/^(曳引驱动乘客电梯|曳引驱动载货电梯)$/.test(gett("设备分类代码"))) {
            addstrtip("设备品种错误！");
        }
        if (gett("设备型号") != "不明") {
            if (!/^[a-zA-Z0-9./\\_\-()（）\s]+$/gi.test(gett("设备型号"))) {
                addstrtip("注意型号！");
            }
        }
        if (gett("设备型号") === "-") {
            addstrtip("产品型号找不到的填“不明”");
        }
        if (gett("产品编号(出厂编号)") != "不明") {
            if (!/^[a-zA-Z0-9./\\_\-()（）]+$/gi.test(gett("产品编号(出厂编号)"))) {
                addstrtip("注意产品编号！");
            }
        }
        if (gett("产品编号(出厂编号)") === "-") {
            addstrtip("产品编号找不到的填“不明”");
        }
        //使用登记证编号
        if (1) {
            if (gett("使用证编号") != "-") {
                if (isValidSYDJFormat(gett("使用证编号"))) {
                    const sbdmfm = gett("使用证编号").match(/^(\d{4})*$/);
                    if (
                        /^3110$/.test(sbdmfm[1]) &&
                        !/^曳引驱动乘客电梯$/.test(gett("设备分类代码"))
                    ) {
                        addstrtip('使用登记证编号3110表示"曳引驱动乘客电梯"!');
                    }
                    if (
                        /^3120$/.test(sbdmfm[1]) &&
                        !/^曳引驱动载货电梯$/.test(gett("设备分类代码"))
                    ) {
                        addstrtip('使用登记证编号3120表示"曳引驱动载货电梯"!');
                    }
                } else {
                    const regex = /^梯(11|12)[宁](A|B|C|D|E)\d{5}[\(\（]\d{2}[\)\）]$/;
                    // 首先判断基本的格式匹配
                    if (regex.test(gett("使用证编号"))) {
                        const match = gett("使用证编号").match(regex);
                        if (match) {
                            if (
                                /^11$/.test(match[1]) &&
                                !/^曳引驱动乘客电梯$/.test(gett("设备分类代码"))
                            ) {
                                addstrtip('使用登记证编号11表示"曳引驱动乘客电梯"!');
                            }
                            if (
                                /^12$/.test(match[1]) &&
                                !/^曳引驱动载货电梯$/.test(gett("设备分类代码"))
                            ) {
                                addstrtip('使用登记证编号12表示"曳引驱动载货电梯"!');
                            }
                            
                            let checkA_E=checkStringContainsLocation(match[2],dat["设备使用(所在)地点"],regions);
                            if(checkA_E.contains){ 
                            }else{
                                if(checkA_E.azdstrContains===null&&checkA_E.zcdstrRepresents!=null){
                                    addstrtip('注意设备所在地:'+dat["设备使用(所在)地点"]+'可能不在使用登记证注册地:'+checkA_E.zcdstrRepresents+'!');
                                } 
                            }
                            // if (/^A$/.test(match[2])) {
                            //     addstrtip('使用登记证注册地在银川!');
                            // }
                            // if (/^B$/.test(match[2])) {
                            //     addstrtip('使用登记证注册地在石嘴山!');
                            // }
                            // if (/^C$/.test(match[2])) {
                            //     addstrtip('使用登记证注册地在吴忠!');
                            // }
                            // if (/^D$/.test(match[2])) {
                            //     addstrtip('使用登记证注册地在固原!');
                            // }
                            // if (/^E$/.test(match[2])) {
                            //     addstrtip('使用登记证注册地在中卫!');
                            // }
                        }
                    } else {
                        addstrtip('注意是否使用登记证编号错误!');
                    }
                }
            }
        }
        if (!/^[\u4e00-\u9fa5]{2,4}$/g.test(gett("安全管理人员"))) {
            addstrtip("注意安全管理人员！");
        }
        if (!/^(1[3-9]\d{9}|\d{4}-?\d{7})$/g.test(gett("安全管理人员联系电话"))) {
            addstrtip("安全管理人员电话不正确！");
        }
        //制造、改造单位及日期
        if (1) {
            if (!/^[\u4e00-\u9fa5\(\)\（\）]{1,39}$/g.test(gett("制造单位"))) {
                addstrtip("注意制造单位名称！");
            }
            if (gett("制造日期") === "-") {
                addstrtip("制造日期查不到填“不明”！");
            } else {
                if (gett("制造日期") != "不明") {
                    zhizaorq = document
                        .getElementById("1555396405618f688")
                        .innerText.trim()
                        .replace(/年|月|日/g, "-")
                        .slice(0, -1); // 封面检验日期
                    jyrq = YearMonthToYearMonthDay(jyrq);
                    if (!ZifuchuanIsDate(jyrq)) {
                        addstrtip("制造日期格式错误！");
                    }
                }
            }
            if (gett("GZDWMC") != '-') {
                if (!/^[\u4e00-\u9fa5\(\)\（\）]{1,39}$/g.test(gett("GZDWMC"))) {
                    addstrtip("注意改造单位名称！");
                }
            }

            if (gett("改造监督检验日期") === "不明") {
                addstrtip("未进行改造或查不出改造日期填“-”！");
            }
            if (
                /^-$/g.test(gett("GZDWMC")) &&
                !/^-$/g.test(gett("改造监督检验日期"))
            ) {
                addstrtip("注意改造单位名称与改造日期的关系！");
            }
            if (
                !/^-$/g.test(gett("GZDWMC")) &&
                /^-$/g.test(gett("改造监督检验日期"))
            ) {
                addstrtip("注意改造单位名称与改造日期的关系！");
            }
            if (!/^-$/g.test(gett("改造监督检验日期"))) {
                gaizaorq = document
                    .getElementById("1710388733083adc5")
                    .innerText.trim()
                    .replace(/年|月|日/g, "-")
                    .slice(0, -1); //封面检验日期
                gaizaorq = YearMonthToYearMonthDay(gaizaorq);
                if (!ZifuchuanIsDate(gaizaorq)) {
                    addstrtip("改造日期格式错误！");
                }
            }
        }

        if (!/^[\u4e00-\u9fa5\(\)\（\）]{1,39}$/g.test(gett("维保单位名称"))) {
            addstrtip("注意维保单位名称！");
        }
        zhidongrq = document
            .getElementById("1710148356446ba4c")
            .innerText.trim()
            .replace(/年|月|日/g, "-")
            .slice(0, -1); //封面检验日期
        zhidongrq = YearMonthToYearMonthDay(zhidongrq);
        if (!ZifuchuanIsDate(zhidongrq)) {
            addstrtip("最近一次制动试验确认日期格式错误！");
        }
        jiandurq = document
            .getElementById("17101483999266548")
            .innerText.trim()
            .replace(/年|月|日/g, "-")
            .slice(0, -1); //封面检验日期
        jiandurq = YearMonthToYearMonthDay(jiandurq);
        if (!ZifuchuanIsDate(jiandurq)) {
            addstrtip("监督日期格式错误！");
        }
        if (!/^(是|否)$/.test(gett("是否加装电梯"))) {
            addstrtip("是否加装错误！");
        }
        if (!/^(是|否)$/.test(gett("是否住宅电梯"))) {
            addstrtip("是否住宅错误！");
        }
        gkxiacijianyanriqi = document
            .getElementById("171038882039234f4")
            .innerText.trim()
            .replace(/年|月|日/g, "-")
            .slice(0, -1); //下次检验日期
        if (
            !/^\d{4}年\d{2}月$/.test(gett("内部（全面）下次检验日期（电类定检）"))
        ) {
            addstrtip("下次检验日期精确到月！");
        }
        gkxiacijianyanriqi = YearMonthToYearMonthDay(gkxiacijianyanriqi);
        if (!ZifuchuanIsDate(gkxiacijianyanriqi)) {
            addstrtip("下次检验日期格式错误！");
        }
        //额定载荷与速度
        if (1) {
            if (!/^([1-9]\d*(\.\d+)?|0\.\d+)$/.test(gett("电梯额定载荷"))) {
                addstrtip("额定载荷错误！");
            }
            if (!/^([1-9]\d*(\.\d+)?|0\.\d+)$/.test(gett("电梯运行速度"))) {
                addstrtip("额定速度错误！");
            }
            if (/^曳引驱动乘客电梯$/.test(gett("设备分类代码"))) {
                const standardLoads = [450, 630, 800, 825,1000, 1050, 1250, 1350, 1600];
                if (!standardLoads.includes(parseFloat(gett("电梯额定载荷")))) {
                    addstrtip(
                        "额定载荷不是常见量450, 630, 800, 825,1000, 1250,1350, 1600！"
                    );
                }
                const standardSpeeds = [1, 1.5, 1.6, 1.75, 2, 2.5];
                if (!standardSpeeds.includes(parseFloat(gett("电梯运行速度")))) {
                    addstrtip("额定速度不是常见量1, 1.5, 1.6,1.75, 2, 2.5！");
                }
            }
            if (/^曳引驱动载货电梯$/.test(gett("设备分类代码"))) {
                const standardLoads = [1000, 1250, 1600, 2000, 3000];
                if (!standardLoads.includes(parseFloat(gett("电梯额定载荷")))) {
                    addstrtip("额定载荷不是常见量1000, 1250, 1600, 2000, 3000！");
                }
                const standardSpeeds = [0.5];
                if (!standardSpeeds.includes(parseFloat(gett("电梯运行速度")))) {
                    addstrtip("额定速度不是常见量0.5！");
                }
            }
        }

        //层站门数
        if (1) {
            const dtcz = document
                .getElementById("1591338788552be31")
                .innerText.trim(); //dt.电梯层站
            const dtzs = document
                .getElementById("15554041568959913")
                .innerText.trim(); //dt.电梯站数
            const dtms = document
                .getElementById("1555404248649fa78")
                .innerText.trim(); //dt.电梯门数
            if (
                !(
                    isNormalInteger(dtcz) &&
                    isNormalInteger(dtzs) &&
                    isNormalInteger(dtms)
                )
            ) {
                addstrtip("层站门数不是正整数！");
            }
            if (
                parseInt(dtcz) < parseInt(dtzs) ||
                parseInt(dtzs) * 2 < parseInt(dtms)
            ) {
                addstrtip("注意层站门数是否合理！");
            }
        }
        //控制方式
        if (1) {
            const validControlTypes = [
                "集选控制",
                "信号控制",
                "单台集选控制",
                "两台并联控制",
                "多台群组控制",
            ];
            if (!validControlTypes.includes(gett("控制方式"))) {
                addstrtip(
                    "控制方式不是常见控制：集选控制,信号控制，单台集选控制，两台并联控制，多台群组控制！"
                );
            }
        }
        //工具箱
        if (1) {
            const gjxjh = validateAndExplainCode(gett("JYYQSB"));
            let tip = gjxjh.message;
            let fixtip = "";
            if (gjxjh.isValid) {
                const regex =
                    /^详见（(JD\d{1}\d{2}|SZSJD\d{2}|WZJD\d{2}|ZWJD\d{2}|GYJD\d{2})）号工具箱$/;
                const match = gett("JYYQSB").match(regex);
                const code = match[1];
                if (!checkAreaForDepartmentPrefix(code, dat["设备使用(所在)地点"])) {
                    fixtip="注意" + code + "的仪器是否在其检验区域范围内使用！";
                }
                let tipp=tip+fixtip
                addstrtip(tip+fixtip)
            }else{
                addstrtip("工具箱填写错误！参考模板：“详见（）号工具箱”")
            }
        }
        //检验现场条件及安全确认
        if (1) {
            if (!/^符合$/.test(gett("XCJYTJ"))) {
                addstrtip("检验现场条件确认不是“符合”!");
            }
            if (!/^符合$/.test(gett("XCAQTJ"))) {
                addstrtip("检验现场安全确认不是“符合”!");
            }
            if (!/^合格$/.test(gett("内部（全面）检验结论（电类定检）"))) {
                addstrtip("检验结论不是“合格”!");
            }
            if (
                /^不符合$/.test(gett("XCJYTJ")) &&
                /^合格$/.test(gett("内部（全面）检验结论（电类定检）"))
            ) {
                addstrtip("检验结论与检验现场条件确认矛盾!");
            }
            if (
                /^不符合$/.test(gett("XCAQTJ")) &&
                /^合格$/.test(gett("内部（全面）检验结论（电类定检）"))
            ) {
                addstrtip("检验结论与检验现场安全确认矛盾!");
            }
        }
        //报告结论与下次检验日期的关系
        if (1) {
            if (
                /^[合格,整改后合格]$/.test(gett("内部（全面）检验结论（电类定检）"))
            ) {
                if (
                    document.getElementById("1710387041337455d").innerText.trim() ===
                    "-"
                ) {
                    addstrtip("报告结论合格应该有下次检验日期！");
                }
            }
            if (/^不合格$/.test(gett("内部（全面）检验结论（电类定检）"))) {
                if (
                    document.getElementById("1710387041337455d").innerText.trim() !==
                    "-"
                ) {
                    addstrtip("报告结论不合格下次检验日期为“-”！");
                }
            }
        }
        jyrqgk = document
            .getElementById("1710387111107bbd2")
            .innerText.trim()
            .replace(/年|月|日/g, "-")
            .slice(0, -1);
        jyrqgk = YearMonthToYearMonthDay(jyrqgk);
        if (!ZifuchuanIsDate(jyrqgk)) {
            addstrtip("概况检验日期格式错误！");
        }
    }
    function DateInfo() {
        //封面检验日期 概况检验日期 改造日期
        //制造日期
        //最近一次制动日期 监督日期
        //下次检验日期
        //制造日期 <= 监督日期 < 改造日期 <= 封面检验日期 < 下次检验日期
        //监督日期 < 最近一次制动日期 <= 封面检验日期
        manufactureStr = gett("制造日期");
        supervisionStr = gett("安装监督检验日期");
        renovationStr = gett("改造监督检验日期");
        // 封面检验日期
        coverInspectionStr = document
            .getElementById("1710387041337455d")
            .innerText.trim();
        // 下次检验日期
        nextInspectionStr = gett("内部（全面）下次检验日期（电类定检）");
        // 最近制动日期
        lastBrakingStr = gett("ZDSYRQ");
        //概况检验日期
        generalInspectionStr = document
            .getElementById("1710387111107bbd2")
            .innerText.trim();
        // 验证封面检验日期和概况检验日期相同
        if (coverInspectionStr !== generalInspectionStr) {
            addstrtip("封面检验日期和概况检验日期不一致！");
        }
        // 解析所有日期
        manufactureDate = parseDate(manufactureStr);
        supervisionDate = parseDate(supervisionStr);
        renovationDate = parseDate(renovationStr);
        coverInspectionDate = parseDate(coverInspectionStr);
        nextInspectionDate = parseDate(nextInspectionStr);
        lastBrakingDate = parseDate(lastBrakingStr);
        if (1) {
            //与当前日期进行比较
            if (1) {
                const now = new Date();
                const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000; // 30天转换为毫秒
                const diff = now - coverInspectionDate;
                if (!(diff >= 0 && diff < oneMonthInMillis)) {
                    addstrtip("注意是否封面检验日期超出当前日期前一个月范围！");
                }
                if (manufactureDate != null && manufactureDate >= now) {
                    addstrtip("注意是否制造日期大于当前日期！");
                }
                if (supervisionDate != null && supervisionDate >= now) {
                    addstrtip("注意是否监督日期大于当前日期！");
                }
                if (renovationDate != null && renovationDate >= now) {
                    addstrtip("注意是否改造日期大于当前日期！");
                }
                if (coverInspectionDate != null && coverInspectionDate > now) {
                    addstrtip("注意是否检验日期大于当前日期！");
                }
                if (lastBrakingDate != null && lastBrakingDate > now) {
                    addstrtip("注意是否制动日期大于当前日期！");
                }
            }
            // 验证日期逻辑顺序
            if (1) {
                if (manufactureDate != null && supervisionDate != null) {
                    if (!(manufactureDate <= supervisionDate)) {
                        addstrtip("注意是否制造日期在监督日期之后！");
                    }
                }
                if (supervisionDate != null && renovationDate != null) {
                    if (!(supervisionDate <= renovationDate)) {
                        addstrtip("注意是否监督日期在改造日期之后！");
                    }
                }
                if (renovationDate != null && coverInspectionDate != null) {
                    if (!(renovationDate <= coverInspectionDate)) {
                        addstrtip("注意是否改造日期在检验日期之后！");
                    }
                }
                if (coverInspectionDate != null && nextInspectionDate != null) {
                    if (!(coverInspectionDate <= nextInspectionDate)) {
                        addstrtip("注意是否检验日期在下次检验日期之后！");
                    }
                }
                if (supervisionDate != null && lastBrakingDate != null) {
                    let supervisionDatetemp = new Date(supervisionDate.getFullYear(), supervisionDate.getMonth(), 1);
                    if (!(supervisionDatetemp <= lastBrakingDate)) {
                        addstrtip("注意是否监督检验日期在最近制动日期之后！");
                    }
                }
                if (lastBrakingDate != null && coverInspectionDate != null) {
                    if (!(lastBrakingDate <= coverInspectionDate)) {
                        addstrtip("注意是否最近制动日期在检验日期之后！");
                    }
                }
            }
            // 如果封面设备代码有填写，验证和解析设备代码中的年份，与制造日期和监督日期比较
            if (1) {
                const serialRegex = /^(3110|3120)\d{5}(\d{4})\d{5}$/;
                const matchSerial = gett("设备代码").match(serialRegex);
                if (matchSerial) {
                    // 提取年份
                    const yearFromSerial = parseInt(matchSerial[2], 10);
                    if (manufactureDate != null) {
                        // 判断序列号中的年份是否在制造日期之前
                        if (yearFromSerial > manufactureDate.getFullYear()) {
                            addstrtip(
                                "封面设备代码中的年份" + matchSerial[2] + "不应在制造日期之后"
                            );
                        }
                    }
                    if (supervisionDate != null && manufactureDate === null) {
                        // 判断序列号中的年份是否在监督日期之前
                        if (yearFromSerial > supervisionDate.getFullYear()) {
                            addstrtip(
                                "封面设备代码中的年份" + matchSerial[2] + "不应在监督日期之后"
                            );
                        }
                    }
                }
            }
            //如果使用登记证编号形如梯11宁A12345（19），则验证其年份与制造监督日期的关系
            if (1) {
                const regexsy =
                    /^梯(11|12)[宁](A|B|C|D|E)\d{5}[\(\（](\d{2})[\)\）]$/;
                const matchsy = gett("使用证编号").match(regexsy);
                if (matchsy) {
                    // 提取两位数年份并转换为四位数
                    const yearShort = parseInt(matchsy[3], 10);
                    const yearFull =
                        yearShort >= 0 && yearShort <= 99 ? 2000 + yearShort : yearShort;
                    // 创建年份的Date对象，并与传入的日期对象比较
                    //const yearDate = new Date(yearFull, 0); // 0 是一月份
                    if (supervisionDate != null) {
                        // 判断序列号中的年份是否在制造日期之前
                        if (yearFull < supervisionDate.getFullYear()) {
                            addstrtip(
                                "使用登记证编号中的年份" + matchsy[3] + "在监督检验日期之前"
                            );
                        }
                    }
                    if (manufactureDate != null && supervisionDate === null) {
                        // 判断序列号中的年份是否在监督日期之前
                        if (yearFull < manufactureDate.getFullYear()) {
                            addstrtip(
                                "使用登记证编号中的年份" + matchsy[3] + "在制造检验日期之前"
                            );
                        }
                    }
                }
            }
            //如果使用登记证编号形如31106523252023562563，则验证其年份与制造监督日期的关系
            if (1) {
                const regexsyy = /^(3110|3120)\d{6}(\d{4})\d{6}$/;
                const matchsyy = gett("使用证编号").match(regexsyy);
                if (matchsyy) {
                    // 提取两位数年份并转换为四位数
                    const year = parseInt(matchsyy[2], 10);
                    //const yearDate = new Date(year, 0); // 0 是一月份
                    if (supervisionDate != null) {
                        // 判断序列号中的年份是否在制造日期之前
                        if (year < supervisionDate.getFullYear()) {
                            addstrtip(
                                "使用登记证编号中的年份" + matchsyy[2] + "在监督检验日期之前"
                            );
                        }
                    }
                    if (manufactureDate != null && supervisionDate === null) {
                        // 判断序列号中的年份是否在监督日期之前
                        if (year < manufactureDate.getFullYear()) {
                            addstrtip(
                                "使用登记证编号中的年份" + matchsyy[2] + "在制造检验日期之前"
                            );
                        }
                    }
                }
            }
            //验证最近一次制动日期是否合理
            if (1) {
                if (supervisionDate != null && coverInspectionDate != null) {
                    let lastBrakingDateCal = calculateBrakeDate(
                        supervisionDate,
                        new Date(
                            coverInspectionDate.getFullYear(),
                            supervisionDate.getMonth(),
                            supervisionDate.getDate()
                        )
                    );
                    if (lastBrakingDate != null && lastBrakingDateCal != null) {
                        if (
                            lastBrakingDateCal.getFullYear() !=
                            lastBrakingDate.getFullYear() ||
                            lastBrakingDateCal.getMonth() != lastBrakingDate.getMonth()
                        ) {
                            const zjzdjc = elevatorInspection(
                                supervisionDate,
                                lastBrakingDateCal
                            );
                            let jyztstr = "";
                            if (lastBrakingDateCal < new Date(2024, 3, 1)) {
                                jyztstr = "检验";
                            } else {
                                jyztstr = zjzdjc.result;
                            }
                            addstrtip(
                                "注意最近一次制动日期是否应为：" +
                                lastBrakingDateCal.getFullYear() +
                                "年" +
                                (lastBrakingDateCal.getMonth() + 1).toString() +
                                "月,该日期属于" +
                                jyztstr +
                                "年份。"
                            );
                        }
                    }
                }
            }
            //验证本次下次检验日期是否合理
            if (supervisionDate != null && coverInspectionDate != null) {
                const yanzhengre = elevatorInspection(
                    supervisionDate,
                    coverInspectionDate
                );
                if (yanzhengre.result != "错误") {
                    if (
                        !(
                            yanzhengre.date.getFullYear() ===
                            nextInspectionDate.getFullYear() &&
                            yanzhengre.date.getMonth() === nextInspectionDate.getMonth()
                        )
                    ) {
                        addstrtip(
                            "注意下次检验日期是否应该是" +
                            yanzhengre.date.getFullYear() +
                            "年" +
                            (yanzhengre.date.getMonth() + 1).toString() +
                            "月。"
                        );
                    }
                    if (yanzhengre.result === "检测") {
                        addstrtip(
                            coverInspectionDate.getFullYear() +
                            "年" +
                            (supervisionDate.getMonth() + 1).toString() +
                            "月应该进行检测,下次检验日期是:" +
                            yanzhengre.date.getFullYear() +
                            "年" +
                            (yanzhengre.date.getMonth() + 1).toString() +
                            "月"
                        );
                    }
                    if (yanzhengre.result === "检验") {
                        // addstrtip(
                        //     "下次检验日期是:" +
                        //     yanzhengre.date.getFullYear() +
                        //     "年" +
                        //     (yanzhengre.date.getMonth() + 1).toString() +
                        //     "月"
                        // );
                    }
                }
            }
        }

    }
    function preprocessData() {
        // 保存原始的XMLHttpRequest.send方法
        origSend = XMLHttpRequest.prototype.send;

        // 覆盖原始的send方法
        XMLHttpRequest.prototype.send = function (body) {
            if (
                this._url.includes(
                    "http://111.51.123.233:8088/intf/report/itemJson/save"
                )
            ) {
                // 检查URL，确保它是你想要拦截的
                //console.log('Sent data:', body);
                //start
                // 解析数据
                try {
                    const parsedData = parseCustomUrlEncodedData(body);
                    //console.log('结构化：',parsedData);
                    //XiaoHe(parsedData);
                } catch (error) {
                    console.error("解析数据时发生错误:", error);
                }

                //end
                // var data = JSON.parse(body);

                // 你可以在这里添加更多的逻辑来处理捕获的数据
            }
            // 调用原始的send方法
            origSend.call(this, body);
        };

        // 覆盖原始的XMLHttpRequest.open方法来捕获请求的URL
        origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            this._url = url; // 将URL附加到XHR对象上，以便后续使用
            origOpen.apply(this, arguments);
        };

        button = document.createElement("button");
        button.innerText = "审核系统";
        button.title = "点击进行审核"; // 添加一个提示，当鼠标悬停在按钮上时显示
        button.style.position = "fixed"; // 使用 fixed 定位以便按钮始终停留在视口内
        button.style.right = window.innerWidth / 15 + "px"; // 距离视口右边四分之一窗口宽度
        button.style.bottom = window.innerHeight / 15 + "px"; // 距离视口底部四分之一窗口高度
        button.style.cursor = "grab"; // 更改鼠标样式，表示可以拖动
        // 添加样式
        button.style.fontSize = "16px"; // 字体大小
        button.style.color = "#ffffff"; // 字体颜色
        button.style.backgroundColor = "#add8e6"; // 背景颜色
        button.style.border = "none"; // 无边框
        button.style.borderRadius = "5px"; // 边框圆角
        button.style.padding = "10px 20px"; // 内边距
        button.style.transition = "background-color 0.3s ease"; // 背景色过渡效果
        // 可选：添加鼠标悬停效果
        button.onmouseover = function () {
            this.style.backgroundColor = "#87CEEB"; // 鼠标悬停时背景色稍深一些
        };
        button.onmouseout = function () {
            this.style.backgroundColor = "#add8e6"; // 鼠标离开时恢复为原来的浅蓝色
        };

        // 初始化拖动逻辑
        isDragging = false;

        button.onmousedown = function (e) {
            initialX = e.clientX - button.getBoundingClientRect().right;
            initialY = e.clientY - button.getBoundingClientRect().bottom;
            isDragging = true;

            document.onmousemove = function (e) {
                if (!isDragging) return;
                var newX = e.clientX - initialX;
                var newY = e.clientY - initialY;
                button.style.right = window.innerWidth - newX + "px";
                button.style.bottom = window.innerHeight - newY + "px";
            };

            document.onmouseup = function () {
                isDragging = false;
                document.onmousemove = null;
                document.onmouseup = null;
            };

            e.preventDefault();
            return false;
        };

        // 拖动函数
        function drag(e) {
            if (!isDragging) return;
            // 计算按钮的新位置
            var newX = e.clientX - initialX;
            var newY = e.clientY - initialY;

            // 应用新的位置
            button.style.left = newX + "px";
            button.style.top = newY + "px";

            // 阻止默认事件和冒泡
            e.preventDefault();
            return false;
        }

        // 停止拖动函数
        function stopDragging() {
            // 取消全局的mousemove和mouseup事件绑定
            document.onmousemove = null;
            document.onmouseup = null;
            // 标记为不再拖动
            isDragging = false;
        }

        // 初始化按钮样式
        Object.assign(button.style, {
            fontSize: "16px",
            zIndex: 1000,
            borderRadius: "50%",
            backgroundColor: "#FF8C00",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            padding: "15px 32px",
            cursor: "grab",
            transition: "all 0.3s ease",
            outline: "none",
            border: "none",
            color: "white",
            textTransform: "uppercase",
            fontWeight: "bold",
        });

        // 将按钮添加到文档中
        document.body.appendChild(button);
        button.onclick = function (e) {
            main();
        };
        //拖动
        if (1) {
            //随意拖动，可编辑,不可以动态调整大小
            if (1) {
                input = document.createElement("TEXTAREA");

                input.id = "information";
                input.name = "information";

                // 设置基本样式
                input.style.width = "320px";
                input.style.height = "400px";
                input.style.resize = "none"; // 禁止用户调整大小
                input.style.position = "absolute"; // 初始时使用绝对定位
                input.style.left = window.innerWidth / 15 + "px"; // 初始时靠左
                input.style.top = window.innerWidth / 4 + "px"; // 初始时靠上
                input.style.zIndex = 100; // 确保它显示在其它元素之上
                input.style.backgroundColor = "#add8e6"; // 浅蓝色背景
                // 可选：添加鼠标悬停效果
                input.onmouseover = function () {
                    this.style.backgroundColor = "#87CEEB"; // 鼠标悬停时背景色稍深一些
                };
                input.onmouseout = function () {
                    this.style.backgroundColor = "#add8e6"; // 鼠标离开时恢复为原来的浅蓝色
                };

                // 标记拖动状态
                isDragging1 = false;// 用于记录鼠标相对于textarea的偏移量

                // 右键按下时开始拖动
                input.onmousedown = function (e) {
                    if (e.button === 2) {
                        // 右键
                        e.preventDefault(); // 阻止默认行为

                        // 记录鼠标按下时的位置
                        initialX1 = e.clientX - parseInt(input.style.left, 10);
                        initialY1 = e.clientY - parseInt(input.style.top, 10);

                        // 记录鼠标相对于textarea的偏移量
                        offsetX1 = e.clientX - input.offsetLeft;
                        offsetY1 = e.clientY - input.offsetTop;

                        // 标记为正在拖动
                        isDragging1 = true;

                        // 绑定鼠标移动和释放事件
                        document.onmousemove = drag1;
                        document.onmouseup = stopDrag1;
                    }
                };

                // 鼠标移动时拖动textarea
                function drag1(e) {
                    if (!isDragging1) return;

                    // 计算新的位置
                    var newX = e.clientX - offsetX1;
                    var newY = e.clientY - offsetY1;

                    // 限制textarea不超出视口
                    newX = Math.max(
                        0,
                        Math.min(newX, window.innerWidth - input.offsetWidth)
                    );
                    newY = Math.max(
                        0,
                        Math.min(newY, window.innerHeight - input.offsetHeight)
                    );

                    // 更新textarea的位置
                    input.style.left = newX + "px";
                    input.style.top = newY + "px";
                }

                // 停止拖动
                function stopDrag1() {
                    // 标记为不再拖动
                    isDragging1 = false;

                    // 移除鼠标移动和释放事件的绑定
                    document.onmousemove = null;
                    document.onmouseup = null;
                }

                // 将textarea添加到文档中
                document.body.appendChild(input);

                // 设置textarea的美观样式
                Object.assign(input.style, {
                    border: "2px solid #ccc", // 添加边框
                    borderRadius: "10px", // 使用更平滑的圆角
                    backgroundColor: "white",
                    padding: "10px", // 增加内边距
                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", // 添加阴影
                    fontSize: "16px",
                    overflow: "auto", // 当内容超出时显示滚动条
                });
            }
        }

        function parseCustomUrlEncodedData(dataString) {
            const parts = dataString.split("&");
            const objects = [];

            parts.forEach((part) => {
                const [key, encodedValue] = part.split("=");
                const decodedValue = decodeURIComponent(encodedValue);
                const parsedValue = JSON.parse(decodedValue);
                objects.push(parsedValue);
            });
            let mergedObject = {};

            objects.forEach((obj) => {
                Object.assign(mergedObject, obj);
            });
            return mergedObject;
        }
    }
    function checkAreaForDepartmentPrefix(bumenstr, areastr) {
        const departmentPrefixes = [
            'JD1', 'JD2', 'JD3',
            'SZSJD', 'WZJD', 'ZWJD', 'GYJD'
        ];
        const departmentMappings = {
            'JD1': ['金凤区', '宁东'],
            'JD2': ['西夏区', '永宁县'],
            'JD3': ['兴庆区', '贺兰县'],
            'SZSJD': ['大武口区', '惠农区', '平罗县'],
            'WZJD': ['利通区', '红寺堡区', '盐池县', '同心县', '铜峡市'],
            'ZWJD': ['沙坡头区', '中宁县', '海原县'],
            'GYJD': ['原州区', '西吉县', '隆德县', '泾源县', '彭阳县']
        };

        // 检查bumenstr是否包含任意部门前缀  
        for (let prefix of departmentPrefixes) {
            if (bumenstr.includes(prefix)) {
                // 获取对应的区域数组  
                const areas = departmentMappings[prefix];
                // 遍历对应区域，检查areastr是否包含任意一个  
                for (let area of areas) {
                    if (areastr.includes(area)) {
                        return true; // 如果包含，返回true  
                    }
                }
            }
        }
        return false; // 如果不包含，返回false  
    }
    function checkStringContainsLocation(zcdstr, azdstr, regions) {  
        // 创建一个映射表，将字母映射到对应的地级市  
        const cityMapping = {  
            'A': '银川市',  
            'B': '石嘴山市',  
            'C': '吴忠市',  
            'D': '固原市',  
            'E': '中卫市'  
        };  
      
        // 检查`azdstr`中是否包含`zcdstr`对应的地名或其子地名  
        function checkLocation(city, str) {  
            // 检查是否直接包含城市名  
            if (str.includes(city)) {  
                return city;  
            }  
            // 遍历城市的子地名  
            for (let district in regions[city]) {  
                if (str.includes(district)) {  
                    return district;  
                }  
                // 如果有更深层级的地名，也进行检查  
                if (regions[city][district] && typeof regions[city][district] === 'object') {  
                    for (let subDistrict in regions[city][district]) {  
                        if (str.includes(subDistrict)) {  
                            return subDistrict;  
                        }  
                    }  
                }  
            }  
            return null;  
        }  
      
        // 转换zcdstr为对应的地名  
        let targetCity = cityMapping[zcdstr];  
        if (!targetCity) {  
            return {  
                contains: false,  
                zcdstrRepresents: null,  
                azdstrContains: null  
            };  
        }  
        // 检查azdstr是否包含目标地名或其子地名  
        let containedLocation = checkLocation(targetCity, azdstr);  
        let result = {  
            contains: containedLocation !== null,  
            zcdstrRepresents: targetCity,  
            azdstrContains: containedLocation  
        };  
      
        return result;  
    }  
})();



