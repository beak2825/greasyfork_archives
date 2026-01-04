// ==UserScript==
// @name         虎扑id回帖屏蔽
// @namespace    http://tampermonkey.net/
// @version      v0.2
// @description  根据id名屏蔽虎扑帖子
//在"blockedList"里编辑需要屏蔽的id,此id的单条回复会被屏蔽,被引用的回复会被修改为"就地正法"
// @author       zhvxiao
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
//设置里的用户排除,可以将你的专区排除.也就是不屏蔽id.
// @include        https://bbs.hupu.com/*.html
// @downloadURL https://update.greasyfork.org/scripts/32172/%E8%99%8E%E6%89%91id%E5%9B%9E%E5%B8%96%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/32172/%E8%99%8E%E6%89%91id%E5%9B%9E%E5%B8%96%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
var blockedList = [

	"id1","id2"
];
var id_answer="此人已被就地正法";

var MyMap = function () {
	this.mapArr = {};
	this.arrlength = 0;

	//假如有重复key，则不存入
	this.put = function (key, value) {
		if (!this.containsKey(key)) {
			this.mapArr[key] = value;
			this.arrlength = this.arrlength + 1;
		}
	};
	this.get = function (key) {
		return this.mapArr[key];
	};

	//传入的参数必须为Map结构
	this.putAll = function (map) {
		if (Map.isMap(map)) {
			var innermap = this;
			map.each(function (key, value) {
				innermap.put(key, value);
			});
		} else {
			alert("传入的非Map结构");
		}
	};
	this.remove = function (key) {
		delete this.mapArr[key];
		this.arrlength = this.arrlength - 1;
	};
	this.size = function () {
		return this.arrlength;
	};

	//判断是否包含key
	this.containsKey = function (key) {
		return (key in this.mapArr);
	};
	//判断是否包含value
	this.containsValue = function (value) {
		for (var p in this.mapArr) {
			if (this.mapArr[p] == value) {
				return true;
			}
		}
		return false;
	};
	//得到所有key 返回数组
	this.keys = function () {
		var keysArr = [];
		for (var p in this.mapArr) {
			keysArr[keysArr.length] = p;
		}
		return keysArr;
	};
	//得到所有value 返回数组
	this.values = function () {
		var valuesArr = [];
		for (var p in this.mapArr) {
			valuesArr[valuesArr.length] = this.mapArr[p];
		}
		return valuesArr;
	};

	this.isEmpty = function () {
		if (this.size() === 0) {
			return false;
		}
		return true;
	};
	this.clear = function () {
		this.mapArr = {};
		this.arrlength = 0;
	};
	//循环
	this.each = function (callback) {
		var index = 0;
		for (var p in this.mapArr) {
			callback(p, index++, this.mapArr[p]);
		}

	};
	this.isMap = function (map) {
		return (map instanceof Map);
	};

};

var blockedStyle = new MyMap();
blockedStyle.put("div.floor>div.floor-show div.left>a", 5);//普通跟帖
blockedStyle.put("div.floor>div.floor_box div.left>a", 4);//点亮跟帖
blockedStyle.put("blockquote b>a.u", 3);

$(document).ready(
	function () {
	init();
});

function init() {
    var my_parent;
	blockedList.forEach(function (item, index, array) {
		blockedStyle.each(function (key1, index, value1) {
          
			if (index < blockedStyle.size()-1  ) {
				$(key1 + ":contains(" + item + ")").each(function () {
					if ($(this).html()== item) {
						my_parent = $(this);
						for (var i = 0; i < value1; i++) {
							my_parent = my_parent.parent();

						}
                  
						my_parent.remove();
						console.log("屏蔽掉关于" + item + "的一条帖子");
					}

				});
			} else  {
             
				$(key1 + ":contains(" + item + ")").each(function () {
                       
					if ($(this).html() == item) {
                        console.log(key1+item);
						my_parent = $(this);
						for (var i = 0; i < value1; i++) {
							my_parent = my_parent.parent();

						}
               
						my_parent.html(id_answer);

					}

				});
			}
		});
	});
}
