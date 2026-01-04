// ==UserScript==
// @name         import_file
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  账号导入
// @author       hzane
// @grant        none
// ==/UserScript==


        var tmpDown; //导出的二进制对象
        function downloadExl(type) {
			var json = [{"姓名": " ","账号": " ","密码": " ","成绩": ""}];
            var tmpdata = json[0];
			console.log(tmpdata);
            json.unshift({});
            var keyMap = []; //获取keys
            //keyMap =Object.keys(json[0]);
            for (var k in tmpdata) {
                keyMap.push(k);
                json[0][k] = k;
            }
			
          var tmpdata = [];//用来保存转换好的json 
                json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
                    v: v[k],
                    position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
                }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
                    v: v.v
                });
                var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
                var tmpWB = {
                    SheetNames: ['mySheet'], //保存的表标题
                    Sheets: {
                        'mySheet': Object.assign({},
                            tmpdata, //内容
                            {
                                '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                            })
                    }
                };
                tmpDown = new Blob([s2ab(XLSX.write(tmpWB, 
                    {bookType: (type == undefined ? 'xlsx':type),bookSST: false, type: 'binary'}//这里的数据是用来定义导出的格式类型
                    ))], {
                    type: ""
                }); //创建二进制对象写入转换好的字节流
            var href = URL.createObjectURL(tmpDown); //创建对象超链接
            document.getElementById("hf").href = href; //绑定a标签
            document.getElementById("hf").click(); //模拟点击实现下载
            setTimeout(function() { //延时释放
                URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
            }, 100);
        }

        function s2ab(s) { //字符串转字符流
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
         // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
        function getCharCol(n) {
            let temCol = '',
            s = '',
            m = 0
            while (n > 0) {
                m = n % 26 + 1
                s = String.fromCharCode(m + 64) + s
                n = (n - m) / 26
            }
            return s
        }
		
		
function importFile(obj) {//导入
	//console.log("AAAAAAA");

	if(!obj.files) {
			return;
		}
		 //alert(obj.files[0].name);
	var f = obj.files[0];
	var reader = new FileReader();
		
	reader.onload = function(e) {
		var data = e.target.result;
		var wb = XLSX.read(data, {
			type: 'binary' //以二进制的方式读取
		});
		//console.log("qqqqq"+wb.SheetNames[0]);
		var sheet0=wb.Sheets[wb.SheetNames[0]];//sheet0代表excel表格中的第一页
		var str=XLSX.utils.sheet_to_json(sheet0);//利用接口实现转换。
		//var templates=new Array();
		var str1=obj.files[0].name;
		//alert("导入成功!");
		//templates=str1.split(".");//将导入文件名去掉后缀
		//document.getElementById("demo").innerHTML=JSON.stringify(str);
						//alert(JSON.stringify(str));
		//window.localStorage.setItem('zhPass',JSON.stringify(str))//存入localStorage 中
		//console.log(JSON.stringify(str));
		
		// 往存储中写入数据
		//chrome.storage.sync.set({'zhPass': JSON.stringify(str)}, function() {
		//    console.log('data保存成功');
		//});
		GM_setValue('zhPass', JSON.stringify(str));
		
		alert("账号导入成功!");
	}
	reader.readAsBinaryString(f);
		
}

