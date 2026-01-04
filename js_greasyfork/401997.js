function http(){
	var pointer = 0,
		method, url, formed, dofun, dofail, onprogress;
	arr(arguments).forEach(function(e){
		switch(pointer){
			case 0:
				e = e.split(' ', 2); // 允许在第一个参数中用空格将 http-method 与 url 隔开，而省去 引号+逗号+引号 的麻烦
				method = e[0].toUpperCase();
				if(e.length > 1){
					pointer++; // 偏移到下一个
					e = e[1];
				}else break;
			case 1: url = e; break;
			case 2:
				if(e instanceof Function){ // 允许不添加 http-body 而直接撰写行为。
					pointer++; // 偏移到下一个
				}else{
					formed = e;
					break;
				}
			case 3: dofun = e; break;
			case 4: dofail = e; break;
			case 5: onprogress = e;
		}
		pointer++;
	});
	var x = 'ActiveXObject' in window?
		new ActiveXObject("Microsoft.XMLHTTP"):
		new XMLHttpRequest();
	if(location.protocol.includes('https'))
		url=url.replace('^http:', 'https:');
	x.open(method, url, true);
	x.timeout=60000;
	x.responseType="text"; // IE要求先open才能设置timeout和responseType
	x.onload=dofun;
	x.ontimeout=x.onerror= dofail? dofail: null;
	x.onprogress=onprogress;
	if(formed)
		x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8'); // TODO: 暂不明确IE是否适用
	x.send(formed?formed:'');
}
function httpj(){
	var a = arr(arguments);
	if(!a[0].includes(' ')){
		a[0] += ' ' + a[1];
		a.splice(1, 1);
	}
	if(a[1] instanceof Function) a.splice(1, 0, null); // 如果 method+url 之后不是 String 而是 Function，判断为 onSuccess，将一个 null 插入到 formed
	while(a.length < 5) a[a.length] = null; // 在剩下的空位填满null
	// 始终转换为如此格式：0=method+url, 1=formed, 2=onSuccess, 3=onFail, 4=onProgress
	http(a[0], a[1], // method+url, formed
		function(){
			var j,
				stat = this.status,
				resp = this.responseText;
			try{
				j = eval('('+ (resp || '{}') +')');
			}catch(e){}
			if(Array.isArray(j)) // JSON Array
				j = { stat:stat, data:j }
			else if(j instanceof Object) // JSON Object
				j.stat = stat;
			else // Nothing, text/plain
				j = { stat:stat, data:resp }
			a[2](j);
		},
		a[3], a[4]); // fail, progress
}

// edit: 2020-3-20 2:21
// edit: 2020-4-26 3:50
