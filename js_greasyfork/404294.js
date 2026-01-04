// ==UserScript==
// @name Kerwin612
// @version 0.1
// @author kerwin612
// @license MIT
// @include *
// @run-at document-start
// @grant GM.getValue
// @noframes
// ==/UserScript==

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Kerwin612's UserScript CORE<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

//默认配置信息
var config = {
	run: (() => {
		//在此配置主方法，读完配置后会执行此方法
		var key = 'default';
		var url = window.location.href;

		for (let [k, v] of Object.entries(fs)) {
			if ((url === k || url.startsWith(k) || new RegExp(k).test(url))) {
				key = k;
				break;
			}
		}
		
		var obj = fs[key];
		if (!obj) return;
		obj.startup(obj.ctx);
		obj.readyInterval = setInterval((function(){
			if (this.ready(this.ctx)) {
				clearInterval(this.readyInterval);
				this.run(this.ctx);
			}
		}).bind(obj), 30);
	}).bind(this)
};

function getConfig(config, keys, index) {
	index = index || 0;
	var key = keys[index++];
	var value = config[key];
	return new Promise((resolve) => {
		GM.getValue(key, value)
			.then((cv) => { 
				if (key === 'config') {
					config = Object.assign(config, cv);
				} else {
					config[key] = (typeof config[key]) === 'object' ? Object.assign(config[key], cv) : cv;
				}
			})
			.finally(() => {
				if (index > keys.length - 1) {
					resolve(config);
				} else {
					getConfig(config, keys, index).then((c) => {resolve(c)});
				}
			});
	});
}
setTimeout(() => {
	if (GM && GM.getValue) {
		getConfig(config, ['config'].concat(Object.keys(config))).then((c) => {
			Object.assign(config, c).run();
		});
	} else {
		//如果不支持用户配置，就直接用默认配置
		config.run();
	}
}, 500);

var fs = {};

/*
func(
	() => {},	//启动方法
	() => {},	//判断页面是否准备好
	() => {},	//主方法
	string..,	//URL匹配项
);
*/
function func() {
	//arguments is an array-like object, but not an array
	var as = arguments;
	if (as.length < 3)	return;
	var obj = {};
	obj.startup = as[0].bind(obj);
	obj.ready = as[1].bind(obj);
	obj.run = as[2].bind(obj);
	obj.ctx = {};
	if (as.length === 3) {
		fs['default'] = obj;
		return;
	}
	[].forEach.call(as, function(value, index) {
		if (index < 3) return;
		fs[value||'default'] = obj;
	});
}

////默认配置，如有配置项，将按照以下模板将配置写在>>>>>Kerwin612's UserScript CORE>>>>>以下
//config.configKey = configVal

////方法模板，将此模板copy到>>>>>Kerwin612's UserScript CORE>>>>>以下，可多次
//func(
//	//startup: url匹配上时就会执行的方法，无须返回值，仅执行一次
//	(ctx) => {
//	}, 
//	//ready: url匹配上时就会执行的方法，返回bool类型的值，每30ms执行一次，直至此方法返回true后就不再执行
//	(ctx) => {
//		return true;
//	}, 
//	//run: url匹配上且以上的ready方法返回true后执行的方法，无须返回值，仅执行一次
//	(ctx) => {
//	},
//	//URL匹配项，可定义多个；当URL匹配时才执行上面的方法；当URL为空或未定义时，上述方法为默认执行的方法
//	'url1','url2','url3'
//);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Kerwin612's UserScript CORE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>