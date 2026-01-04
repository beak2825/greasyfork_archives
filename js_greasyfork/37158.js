// ==UserScript==
// @name         Shirayuki
// @namespace
// @version      1.13
// @description  Shirayuki language implement
// @author       Rika
// @match        *://*.zhihu.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/165948
// @downloadURL https://update.greasyfork.org/scripts/37158/Shirayuki.user.js
// @updateURL https://update.greasyfork.org/scripts/37158/Shirayuki.meta.js
// ==/UserScript==

(function() {
	function interpreter(code_console){

	this.code_console = code_console;
	this.halt = false;
	var self = this;

	function trampoline(f){
		var func = f;
		while (typeof func === 'function') {
			func = func();
		}
		return func;
	}
	function trampoline_exec(f){
		var count = 0;
		while(count < (1 << 13) && typeof f === 'function') {
			count++;
			f = f();
		}
		if (typeof f === 'function' && !self.halt) {
			setTimeout(trampoline_exec.bind(null, f), 0);
		}
	}
	function console_read(x){
		self.code_console.input(x);
	}
	function console_write(x){
		self.code_console.output(x);
	}
	function console_suspend(x){
		self.code_console.suspend(x);
	}
	function console_clear(){
		self.code_console.clear();
	}
	function console_sleep(x,time){
		self.code_console.sleep(x,time);
	}
	function toBoolean(x){
		return Boolean(x)&&x!=false;
	}
	function isBoolean(x){
		return typeof x === 'boolean';
	}
	function isArray(x){
		return Object.prototype.toString.call(x) === '[object Array]';
	}
	function isNumber(x){
	  return !isNaN(x) && !isArray(x) &&x!=null;
	}
	function isString(x){
		return typeof x === 'string' || x instanceof String;
	}
	function isFunction(x){
		return typeof x === "function";
	}
	function isEmpty(obj){
	    return jQuery.isEmptyObject(obj);
	}
	function nonEmpty(obj){
	    return !isEmpty(obj);
	}
	function set(x){
		var ret={};
		x.forEach(function(item,index){ret[item]=index;});
		return ret;
	}
	function extend(obj, src){
	    for (var key in src) {
	        if (src.hasOwnProperty(key) && !obj.hasOwnProperty(key)) obj[key] = src[key];
	    }
	    return obj;
	}
	function map_cps(f,x,cont){
		if(isEmpty(x)){
			return cont.bind(null,[]);
		}
		else if(x.length==1){
			return f.bind(null,x[0], function(y){
				return cont.bind(null,[y]);
			});
		}
		else{
			return map_cps.bind(null,f,x.slice(0, x.length-1),function(y){
				return f.bind(null, x[x.length-1], function(z){
					y.push(z);
					return cont.bind(null,y);
				});
			});
		}
	}
	function filter_cps(f,x,cont){
		if(isEmpty(x)){
			return cont.bind(null,[]);
		}
		else if(x.length==1){
			return f.bind(null, x[0], function(y){
				if(y){
					return cont.bind(null,[x[0]]);
				}
				else{
					return cont.bind(null,[]);
				}
			});
		}
		else{
			return filter_cps.bind(null,f,x.slice(1),function(y){
				return f.bind(null, x[0], function(z){
					if(z){
						y.unshift(x[0]);
					}
					return cont.bind(null,y);
				});
			});
		}
	}
	function reduce_cps(f,x,cont){
		if(isEmpty(x)){
			return cont.bind(null,[]);
		}
		else if(x.length==1){
			return cont.bind(null,x[0]);
		}
		else if(x.length==2){
			return f.bind(null,x[0],x[1],cont);
		}
		else{
			return reduce_cps.bind(null,f,x.slice(1),function(y){
				return f.bind(null,x[0], y, function(z){
					return cont.bind(null,z);
				});
			});
		}
	}
	function argument_number(n) {return n>1 ? n + " arguments" : n + " argument";}
	function do_raise_syntax(msg){throw {name:'Error',message:'Syntax Error: '+msg+'.'}}
	function do_raise(msg){throw {name:'Error',message:'Running Error: '+msg+'.'}}
	var wapper=function(_f){
		return function(){
			return _f.apply(null, [wapper(_f)].concat(Array.prototype.slice.call(arguments)));
		}
	}
	var preprocessor_x=wapper(
		function(self,__Str,_n,_m,_k){
			if(_n === undefined) {
				_n = 0;
			}
			if(_m === undefined) {
				_m = 0;
			}
			if(_k === undefined) {
				_k = 0;
			}
			return (!__Str && (_n==0 && _m==0 && _k==0)) ? '' :
				(!__Str) ? 
					(
						(_n!=0) ? do_raise_syntax("unmatched parentheses '"+(_n>0?'(':')')+"'") :
						(_m!=0) ? do_raise_syntax("unmatched parentheses '"+(_m>0?'{':'}')+"'") :
						do_raise_syntax("unmatched parentheses '"+(_k>0?'[':']')+"'")
					) :
				(__Str[0]=='\n' && _n==0) ? '\n'+self(__Str.slice(1), _n) :
				(__Str[0]=='\n' && _n!=0) ? self(__Str.slice(1), _n) :
				(__Str[0].match(/[\w\d\+\-\*\/\%\.\(\)\^\!\<\>\=\:\,\t\|\{\}\[\]\\\~\ ]/)) ? __Str[0]+self(__Str.slice(1), _n+(__Str[0]=='(')-(__Str[0]==')'), _m+(__Str[0]=='{')-(__Str[0]=='}'), _k+(__Str[0]=='[')-(__Str[0]==']')) : 
				do_raise_syntax("unexpect symbol '"+__Str[0]+"'");
		});
	var preprocessor=function(__Str){
		return preprocessor_x(__Str.replace(/\/\/.*/g,'').replace(/[ \f\r\t\v]+/g,' ').split('\n').filter(function(x){return Boolean(x)}).join('\n'));
	}
	var lexer=function(__Str){
		return (preprocessor(__Str).split(/(def!|\-\>|[<>=]{2}|\!\=|_(?=\s|\{|\()|\\(?:\(|\{)|(?:\)|\})\\|[\>\<\=\+\-\*\/\%\(\)\^\!\:\,\n\|\t\{\}\[\]\~\ ])/g).filter(function(c){return Boolean(c) && !(c in set([' ','\t']))}).map(
			function(s){
				return (!isNaN(s) && s!='\n') ? Number(s) : 
					(s=='<>') ? '!=' :
					(s.indexOf('.')==-1 || s=='=<' || s=='=>' || s=='><') ? s : 
					do_raise_syntax("unexpect symbol '"+s+"'");
			}));
	}
	var parser_unit=wapper(
		function(self,__List,__Level,__Escape){
			var topLevel = 11;
			if(__Level === undefined) {
				__Level = topLevel;
			}
			if(__Escape === undefined) {
				__Escape = false;
			}
			return (__Level==0) ? (
					(nonEmpty(__List) && (__List[0]=='(' || __List[0]=='{')) ? (
							(function(_t){
								return (_t.length>2 || _t[1][0]=='}') ? [['()', (_t.length>2 || _t[0]!=null) ? _t.slice(0,-1) : []], _t[_t.length-1].slice(1)] : [_t[0],_t[1].slice(1)];
							})(
								wapper(
									function(self, rf, _t0){
										return (nonEmpty(_t0[1]) && _t0[1][0]==',') ? (function(_tx){return  [_t0[0]].concat(self(rf, _tx));})(rf(_t0[1].slice(1),topLevel,__Escape)): _t0;
									}
								)(self, self(__List.slice(1),topLevel,__Escape))
							)
						) :
					(nonEmpty(__List) && (__List[0]=='\\(' || __List[0]=='\\{')) ? (
							__Escape? (
								(function(_t0){
									return (isEmpty(_t0[1]) || (__List[0]=='\\(' && _t0[1][0]!=')\\') || (__List[0]=='\\{' && _t0[1][0]!='}\\')) ? 
										do_raise_syntax("expect symbol '"+(__List[0]=='\\('?')\\':'}\\')+"', given: '"+_t0[1][0]+"'") : [[__List[0]+_t0[1][0],_t0[0]],_t0[1].slice(1)];
								}
								)(self(__List.slice(1),topLevel,false))) :
								do_raise_syntax("unexpect symbol '"+__List[0]+"'")
						):
					(nonEmpty(__List) && (__List[0]=='[')) ? (
							(function(_t0){
								return (isEmpty(_t0[1]) || _t0[1][0]!=']') ? do_raise_syntax("expect symbol ']', given: '"+_t0[1][0]+"'") : [['[]',_t0[0]],_t0[1].slice(1)];
							}
							)(self(__List.slice(1),topLevel,true))
						) :
					(nonEmpty(__List) && (__List[0]=='~')) ? (
							(function(_t){
								return nonEmpty(_t) ? (
										(function(_r){ return [[__List[0],_r[0]], _r[1]]; })(self(__List.slice(1),3,__Escape))
									) : do_raise_syntax("expect identifier, given: End of line")
							})(__List.slice(1))
						) :
					(nonEmpty(__List) && (isString(__List[0]) && __List[0]=='None')) ? (
						[[__List[0]], __List.slice(1)] 
						) :
					(nonEmpty(__List) && (!isString(__List[0]) || !__List[0].match(/^(\-\>|\\(?:\(|\{)|(?:\)|\})\\|[<>=]{2}|[\>\<\=\,\+\-\*\/\%\(\)\^\!\|\{\}\[\]\_\:\~])$/))) ? (
						[__List[0], __List.slice(1)] 
						) :
					[null, __List]
					) :
				(__Level==1) ? (
					(nonEmpty(__List) && __List[0] in set(['lambda','def','def!'])) ? (
						(__List[0] in set(['def','def!']) && __Escape) ? do_raise_syntax("macro definitions are not allowed") :
						(function(_t){
							return (nonEmpty(_t) && _t[0]==':') ? (
								(function(sf,s0,s1,s2,t){
									return sf(s2(s1(s0(t))));
								})
								((function(_tf){
									return [[((__List[0] in set(['def','def!']))&&_tf[0])?__List[0]+'_const':__List[0]].concat(_tf.slice(1,-1)),_tf[_tf.length-1]];
								}),
								(function(_t0){
									return (_t0.length>1 && _t0[0]!='\\(' && _t0[0]!='\\{' && _t0[1] in set(['=','('])) ? (
											(!(_t0[0] in set(['None','lambda','def','def!','delay','callcc','eval','curry']))&&isString(_t0[0])&&_t0[0].match(/^[A-Za-z_][A-Za-z0-9_]*$/)) ? 
											([_t0[0],_t0.slice(1),_t0[1]=='=']) :
											do_raise_syntax("invaild "+((__List[0]=='lambda')?"function":"macro")+" name '"+_t0[0]+"'")
										) :
										((nonEmpty(_t0) && (_t0[0]=='\\(' || _t0[0]=='\\{')) ? (
											(function(_tx){
												return (nonEmpty(_tx[1]) && _tx[1][0] in set(['=','('])) ?
													[_tx[0],_tx[1],_t0[1][0]=='='] :
													['',_t0,false];
											})(self(_t0,0,__Escape))
										):
										['',_t0,false]);
								}),
								(function(_t1){
									return (!(__List[0]=='def' && isEmpty(_t1[0]))) ?
										_t1 :
										do_raise_syntax("anonymous macro");
								}),
								(function(_t2){
									return (function(_tc){
										return [_t2[2],_t2[0],_tc[0]].concat(
												(_t2[1][0]=='(' && nonEmpty(_tc) && _tc[1][0]==')' && (_tc[1].length>1 && _tc[1][1] in set(['=','->']))) ? (self(_tc[1].slice(2),topLevel,__Escape)) :
												(_t2[1][0]=='(' && (isEmpty(_tc[1]) || _tc[1][0]!=')')) ? do_raise_syntax("expect symbol ')'") :
												(_t2[1][0]!='(' && nonEmpty(_tc[1]) && (_tc[1][0] in set(['=','->']))) ? self(_tc[1].slice(1),topLevel,__Escape) :
												do_raise_syntax("expect symbol '=' or '->', given: '"+(nonEmpty(_tc[1])&&_tc[1][0]?_tc[1][0]:'')+"'")
											);
									})((!(nonEmpty(_t2[1]) && _t2[1][0]=='=')) ? (
										(function(_ta){
											return [_ta[0].length==1 && _ta[0][0]==null? []: _ta[0],_ta[1]];
										})(wapper(
											function(self, rf, _ta){
												return nonEmpty(_ta) ? (
													(function(_tx){
														return (nonEmpty(_tx[1]) && _tx[1][0]==',') ? (function(ty){return [[_tx[0]].concat(ty[0]),ty[1]]; })(self(rf,_tx[1].slice(1))):[[_tx[0]],_tx[1]];
													})(rf(_ta,3,__Escape))
													) :
													(isEmpty(_ta) || _ta[0] in set(['->','=',')'])) ? [[],_ta] :
													do_raise_syntax("unexpect symbol '"+_ta[0]+"'");
											})(self, _t2[1].slice(nonEmpty(_t2[1]) && _t2[1][0]=='('))
										)) : 
										[[], _t2[1]]
									);
								}),_t.slice(1))
								) :
							do_raise_syntax("expect symbol ':', given: '"+_t[0]+"'");
						})(__List.slice(1))
						) :
					self(__List, __Level-1, __Escape)
					) :
				(__Level==2) ? (
					(nonEmpty(__List) && (__List[0] in set(['delay','callcc','eval','curry']))) ? (
						(function(_t,_f){
							return (nonEmpty(_t) && _t[0] =='(') ? 
								(function(_t0){
									return (isEmpty(_t0[1]) || _t0[1][0]!=')') ? 
										do_raise_syntax("expect symbol ')', given: '"+_t0[1][0]+"'") : 
										[_t0[0],_t0[1].slice(1)];
								}
								)(_f(_t.slice(1),true)) :
								_f(_t,false);
						})(__List.slice(1),function(_t,_mk){
							return (function(_t0){
								return [[__List[0],_t0[0]],_t0[1]];
							})(self(_t, _mk?topLevel:3, __Escape))
						})) : 
					self(__List, __Level-1,__Escape)
					) :
				(__Level==3) ? (
					wapper(
						function(self, rf, _t){
							return (nonEmpty(_t[1]) && _t[1][0]=='(') ? (
									(function(_t0){
										return self(rf, [['<-',_t[0],_t0[0]],_t0[1]]);
									})((function(_t){return [['()',(_t.length>2 || _t[0]!=null) ? _t.slice(0,-1) : []],_t[_t.length-1].slice(1)];})(
										wapper(
											function(self, rf, _t0){
												return (_t0[1] && _t0[1][0]==',') ? (function(_tx){return [_t0[0]].concat(self(rf, _tx));})(rf(_t0[1].slice(1),topLevel,__Escape)) : _t0;
											})(rf, rf(_t[1].slice(1),topLevel,__Escape))
										))
									) :
								(nonEmpty(_t[1]) && _t[1][0]=='{') ? do_raise_syntax("unexpect symbol '{'") : 
								(nonEmpty(_t[1]) && !_t[1][0].toString().match(/(\-\>|\\(?:\(|\{)|(?:\)|\})\\|[<>=]{2}|[\>\<\=\,\+\-\*\/\%\(\)\^\!\|\:\{\}\[\]\_\n\~])/)) ? (
									(function(_t0){
										//return self(rf, [['*',_t[0],_t0[0]],_t0[1]]);
										do_raise_syntax("unexpect symbol '"+_t[1][0]+"'");
									})(rf(_t[1], 4, __Escape))
									) :
								_t;
						})(self, self(__List, __Level-1, __Escape))
					) :
				(__Level==4) ? (
					(nonEmpty(__List) && __List[0]=='|') ? (
						(function(_t0){
							return [['|',_t0.slice(0,-2)],_t0[_t0.length-1]];
						})(wapper(
							function(self, rf, _t){
								return (nonEmpty(_t) && _t[0]=='|') ? (
									(function(_tx){
										return (nonEmpty(_tx[1]) && _tx[1][0]==':') ? (
												(function(_ty){
													return [[_tx[0], _ty[0]]].concat(self(rf, _ty[1]));
												})(rf(_tx[1].slice(1),topLevel,__Escape))
											) :
											do_raise_syntax("expect symbol ':'");
									})(rf(_t.slice(1),topLevel,__Escape))
									) :
									[[], _t];
							})(self, __List))
						) :
					self(__List, __Level-1, __Escape)
					) :
				(__Level>4 && __Level<12) ? (
					wapper(
						function(self, rf, _t){
							return (_t[1] && _t[1][0] in [set(['->']),set(['_']),set(['!']),set(['^']),set(['*','/','%']),set(['+','-']),set(['=','!=','<','>','<=','>='])][__Level-5]) ? (
									(function(x){
										return (function(_t0){
											return x ? ((nonEmpty(_t0[1]) && _t0[1][0]=='}') ? 
													self(rf, [[_t[1][0],_t[0],_t0[0]],_t0[1].slice(1)]) : 
													do_raise_syntax("expect symbol '}'")) :
												self(rf, [[_t[1][0],_t[0],_t0[0]],_t0[1]]);
										})(rf(_t[1].slice(1+x), x?11:__Level-1, __Escape));
									})(((__Level==6 || __Level==8) && _t[1].length>1 && _t[1][1]=='{'))
								) :
								_t;
						})(self, self(__List, __Level-1, __Escape))
					) :
				(self(__List, __Level-1, __Escape)
				);
		});
	var parser=wapper(
		function(self, __List){
			return ((function(rf, _t){
					return (isEmpty(_t[1])||_t[1][0]=='\n') ? 
						[_t[0]].concat((nonEmpty(_t[1])) ? rf(_t[1].slice(1)) : []) :
						do_raise_syntax("Unexpected end of line");
				}
			)(self, parser_unit(__List)));
		});
	var merge_dict=function(x,y){
		return extend(x,y);
	}
	var builtin_func_signature=function(f){
		var signature={
			'apply': 		['lambda','apply',['f','x']],
			'isFunction': 	['lambda','isFunction',['x']],
			'isList': 		['lambda','isList',['x']],
			'isNumber': 	['lambda','isNumber',['x']],
			'isNone': 		['lambda','isNone',['x']],
			'isAst': 		['lambda','isAst',['x']],
			'int': 			['lambda','int',['x']],
			'float': 		['lambda','float',['x']],
			'len': 			['lambda','len',['x']],
			'map': 			['lambda','map',['f','x']],
			'filter': 		['lambda','filter',['f','x']],
			'reduce': 		['lambda','reduce',['f','x']],
			'ceil': 		['lambda','ceil',['x']],
			'floor': 		['lambda','floor',['x']],
			'boolean': 		['lambda','boolean',['x']],
			'abs': 			['lambda','abs',['x']],
			'sin': 			['lambda','sin',['x']],
			'cos': 			['lambda','cos',['x']],
			'tan': 			['lambda','tan',['x']],
			'ln': 			['lambda','ln',['x']],
			'exp': 			['lambda','exp',['x']],
			'pi': 			['lambda','pi',[]],
			'e': 			['lambda','e',[]],
			'random': 		['lambda','random',[]],
			'and': 			['lambda','and',['x','y']],
			'or': 			['lambda','or',['x','y']],
			'not': 			['lambda','or',['x']],
			'input': 		['lambda','input',[]],
			'output': 		['lambda','output',['x']],
			'suspend': 		['lambda','suspend',['f']],
			'clear': 		['lambda','suspend',[]],
			'halt': 		['lambda','halt',[]],
		};
		return signature[f];
	};
	var global_symtable=function(_t){
		var numeric_func=function(f,name){
			return function(x,cont){
				if(!isNaN(x)){
					return cont.bind(null,f(x));
				}
				else{
					do_raise("call lambda <"+name+"> with not isnumeric argument");
				}
			}
		}
		var builtin=function(f,name,args,decay){
			if(decay === undefined) {
				decay = true;
			}
			return val_func(builtin_func(f,name,args,decay));
		}
		var builtin_func_list={
			'apply': builtin(function(f,x,cont){
					if(isFunction(f)&&f(2)!='Ast'&&f(2)!='free_identifier'){
						if(isArray(x)){
							return f().bind(null,x,cont);
						}
						else{
							return f().bind(null,[val_func(x)],cont);
						}
					}
					else{
						return result_of.bind(null, val_func(f), function(v){
							do_raise("calling a not callable object "+v);
						});
					}
				},'apply',['f','x']),
			'isFunction': builtin(function(x,cont){
					if(isFunction(x)&&x(2)!='Ast'&&x(2)!='free_identifier'){
						return cont.bind(null,true);
					} 
					else{
						return cont.bind(null,false);
					}
				},'isFunction',['x']),
			'isList': builtin(function(x,cont){
					if(isArray(x)){
						return cont.bind(null,true);
					} 
					else{
						return cont.bind(null,false);
					}
				},'isList',['x']),
			'isNumber': builtin(function(x,cont){
					if(isNumber(x)){
						return cont.bind(null,true);
					} 
					else{
						return cont.bind(null,false);
					}
				},'isNumber',['x']),
			'isNone': builtin(function(x,cont){
					if(x==null){
						return cont.bind(null,true);
					} 
					else{
						return cont.bind(null,false);
					}
				},'isNone',['x']),
			'isAst': builtin(function(x,cont){
					if(isFunction(x)&&x(2)=='Ast'){
						return cont.bind(null,true);
					} 
					else{
						return cont.bind(null,false);
					}
				},'isAst',['x']),
			'int': builtin(numeric_func(function(x){return Math.floor(x);},'int'),'int',['x']),
			'float': builtin(numeric_func(function(x){return x;},'float'),'float',['x']),
			'boolean': builtin(function(x,cont){return cont.bind(null,toBoolean(x));},'boolean',['x']),
			'len': builtin(function(x,cont){
					if(isArray(x)){
						return cont.bind(null,x.length);
					} 
					else{
						do_raise("call lambda <len> with not vector argument");
					}
				},'len',['x']),
			'map': builtin(function(f,x,cont){
					if(isArray(x)){
						return map_cps.bind(null,function(y,cont){
							return f().bind(null,[y],cont);
						},
						x,cont);
					}
					else{
						do_raise("call lambda <map> with not vector argument");
					}
				},'map',['f','x']),
			'filter': builtin(function(f,x,cont){
					if(isArray(x)){
						return filter_cps.bind(null,function(y,cont){
							return f().bind(null,[y],function(v){
								return v().bind(null,null,function(cond){
									return cont.bind(null,Boolean(cond) && !(isArray(cond) && isEmpty(cond)));
								});
							});
						},
						x,cont);
					}
					else{
						do_raise("call lambda <filter> with not vector argument");
					}
				},'filter',['f','x']),
			'reduce': builtin(function(f,x,cont){
					if(isArray(x)){
						if(nonEmpty(x)){
							return reduce_cps.bind(null,function(a,b,cont){
								return f().bind(null,[a,b],cont);
							},
							x,cont);
						}
						else{
							return cont.bind(null,[]);
						}
					}
					else{
						do_raise("call lambda <reduce> with not vector argument");
					}
				},'reduce',['f','x']),
			'ceil': builtin(numeric_func(function(x){return Math.ceil(x);},'ceil'),['x']),
			'floor': builtin(numeric_func(function(x){return Math.floor(x);},'floor'),'floor',['x']),
			'abs': builtin(numeric_func(function(x){return Math.abs(x);},'abs'),'abs',['x']),
			'sin': builtin(numeric_func(function(x){return Math.sin(x);},'sin'),'sin',['x']),
			'cos': builtin(numeric_func(function(x){return Math.cos(x);},'cos'),'cos',['x']),
			'tan': builtin(numeric_func(function(x){return Math.tan(x);},'tan'),'tan',['x']),
			'ln': builtin(numeric_func(function(x){return Math.log(x);},'ln'),'ln',['x']),
			'exp': builtin(numeric_func(function(x){return Math.exp(x);},'exp'),'exp',['x']),
			'pi': builtin(function(cont){return cont.bind(null,Math.PI);},'pi',[]),
			'e': builtin(function(cont){return cont.bind(null,Math.E);},'e',[]),
			'random': builtin(function(cont){return cont.bind(null,Math.random());},'random',[]),
			'and': builtin(function(x,y,cont){
					return x().bind(null,null,function(a){
						return !toBoolean(a)?
							cont.bind(null,val_func(false)) :
							y().bind(null,null,function(b){
								return !toBoolean(b)?
									cont.bind(null,val_func(false)) :
									cont.bind(null,val_func(true));
							});
					});
				},'and',['x','y'],false),
			'or': builtin(function(x,y,cont){
					return x().bind(null,null,function(a){
						return toBoolean(a)?
							cont.bind(null,val_func(true)) :
							y().bind(null,null,function(b){
								return toBoolean(b)?
									cont.bind(null,val_func(true)) :
									cont.bind(null,val_func(false));
							});
					});
				},'or',['x','y'],false),
			'not': builtin(function(x,cont){return cont(!toBoolean(x));},'or',['x']),
			'input': builtin(function(cont){
					console_read(function(code){
						trampoline_exec(evaluate(parser(lexer(code))[0],{},{},function(x){
							trampoline_exec(x().bind(null,null,cont));
						}));
					});
				},'input',[]),
			'output': builtin(function(x,cont){
					return result_of.bind(null, x, function(v){
						console_write(v);
						console_sleep(function(){ 
							trampoline_exec(cont.bind(null,x));
						}, 10);
					});
				},'output',['x'], false),
			'suspend': builtin(function(x,cont){
					console_suspend(function(){
						trampoline_exec(cont.bind(null,x));
					});
				},'suspend',['f'], false),
			'clear': builtin(function(cont){
					console_clear();
					return cont(null);
				},'clear',[]),
			'halt': builtin(function(cont){
					return null;
				},'halt',[], false),
		};
		var ret={};
		_t.forEach(function(item,index){
			if(isArray(item) && nonEmpty(item) && item[0]=='lambda'){
				if(!(item[1] in ret)){
					ret[item[1]]=[item[0],item[1],[],[]];
				}
				ret[item[1]][2].push(item[2]);
				ret[item[1]][3].push(item[3]);
				if(ret[item[1]][2][0].length!=item[2].length){
					do_raise_syntax("define lambda<"+(item[1] ? item[1] : 'unnamed')+"> with unmatched arguments,\n    given:"+
						'('+ret[item[1]][2][0].map(function(x){ return AstToString(x).replace(/\n$/,''); }).join(',')+') and '+
						'('+item[2].map(function(x){ return AstToString(x).replace(/\n$/,''); }).join(',')+')');
				}
			}
		});
		for (var key in ret) {
			ret[key]=val_func(func(ret[key][0],ret[key][1],ret[key][2],ret[key][3], {}, ret, evaluate));
		}
		merge_dict(ret, builtin_func_list);
		merge_dict(ret, {'true':val_func(true),'false':val_func(false)});
		return ret;
	}
	var macro_symtable=function(_t,_gsym){
		if(_gsym === undefined) {
			_gsym = {};
		}
		var ret={}, temp={};
		_t.forEach(function(item,index){
			if(isArray(item) && nonEmpty(item) && item[0] in set(['def','def_const','def!','def!_const'])){
				if(!(item[1] in temp)){
					temp[item[1]]=[item[0],item[1],[],[]];
				}
				temp[item[1]][2].push(item[2]);
				temp[item[1]][3].push(item[3]);
				if(temp[item[1]][2][0].length!=item[2].length){
					do_raise_syntax("define macro<"+(item[1] ? item[1] : 'unnamed')+"> with unmatched arguments,\n    given:"+
						'('+temp[item[1]][2][0].map(function(x){ return AstToString(x).replace(/\n$/,''); }).join(',')+') and '+
						'('+item[2].map(function(x){ return AstToString(x).replace(/\n$/,''); }).join(',')+')');
				}
			}
		});
		for (var key in temp) {
			temp[key]=val_func(func(temp[key][0],temp[key][1],temp[key][2],temp[key][3], {}, temp, evaluate, true));
			ret[key]=temp[key];
		}
		merge_dict(temp, _gsym);
		return ret;
	}
	var macro_expansion=function(Ast, cont){
		var gsym=global_symtable(Ast);
		var msym=macro_symtable(Ast,gsym);

		var KFFD=(function(_t, _msym, cont){
			var id_set={};
			var rename_set={};
			var S=function(index, _e){
				return (function(_t){
					if(nonEmpty(_t)){
						if(!(_t in id_set)){
							id_set[_t]={};
						}
						id_set[_t][index]=true;
						if(_e){
							return ['#', _t, index].concat(_e);
						}
						else{
							return ['#', _t, index];
						}
					}
					else{
						return _t;
					}
				});
			}
			var T=function(_t, s){
				if(isArray(_t)){
					if(nonEmpty(_t)){
						if(_t[0] in set(['->','<-','!=','<=','>=','<','>','=','+','-','*','/','%','^','!','_'])){
							return [_t[0], T(_t[1],s), T(_t[2],s)];
						}
						else if(_t[0]=='()'){
							return [_t[0],_t[1].map(function(x){ return T(x,s); })];
						}
						else if(_t[0] in set(['[]','\\()\\','\\{}\\','~','delay','callcc','eval','curry'])){
							return [_t[0], T(_t[1],s)];
						}
						else if(_t[0]=='|'){
							return [_t[0],_t[1].map(function(x){ return [T(x[0],s),T(x[1],s)]; })];
						}
						else if(_t[0]=='None'){
							return _t;
						}
						else if(_t[0]=='lambda'){
							return [_t[0], T(_t[1],s), _t[2].map(function(x){ return T(x,s); }), T(_t[3],s)];
						}
						else if(_t[0] in set(['def','def_const','def!','def!_const'])){
							return null;
						}
						else if(_t[0]=='#'){
							return _t;
						}
					}
					else{
						return null;
					}
				}
				else{
					if(isString(_t) && !(_t in _msym)){
						return s(_t);
					}
					else{
						return _t;
					}
				}
			}
			var E=function(_t, index, cont){
				var E_impl=function(_t, index, env, bound, match, cont){
					if(isArray(_t)){
						if(nonEmpty(_t)){
							if(_t[0] in set(['->','!=','<=','>=','<','>','=','+','-','*','/','%','^','!','_'])){
								return E_impl.bind(null,_t[1], index, env, bound, 0, function(x){
									return E_impl.bind(null,_t[2], index, env, bound, 0, function(y){
										return cont.bind(null,[_t[0],x,y]);
									});
								});
							}
							else if(_t[0]=='<-'){
								return E_impl.bind(null,_t[1], index, env, bound, match, function(x){
									return E_impl.bind(null,_t[2], index, env, bound, match, function(y){
										if(isString(x) && x in _msym){
											var dirty=(_msym[x](-1)[0].indexOf('!')!=-1);
											return _msym[x]().bind(null,null,function(f){
												return f().bind(null,y[1].map(function(k){ return val_func(ast_func(k)); }),function(v0){
													return v0().bind(null,null,	function(v){
														if(!isFunction(v)) v=val_func(v);
														if(dirty){
															return E_impl.bind(null, T(v(-1), function(_t){ return _t in bound? S(index-1)(_t):S(index-1,env)(_t); }), index, env, bound, match, function(n){
																return cont.bind(null,n);
															});
														}
														else{
															return E_impl.bind(null, T(v(-1), S(index,v(-3))), index+1, v(-3), {}, match, function(n){
																return cont.bind(null,n);
															});
														}
													});
												});
											});
										}
										return cont.bind(null,[_t[0],x,y]);
									});
								});
							}
							else if(_t[0]=='()'){
								return map_cps.bind(null,function(x,cont){
										return E_impl.bind(null,x, index, env, bound, match, cont);
									},
									_t[1], 
									function(x){
										return cont.bind(null,['()',x]);
									});
							}
							else if(_t[0] in set(['[]','\\()\\','\\{}\\','delay','callcc','eval','curry'])){
								return E_impl.bind(null,_t[1], index, env, bound, match+(match&&(_t[0]=='[]'||(-(_t[0] in set(['\\()\\','\\{}\\']))))), function(x){
									return cont.bind(null,[_t[0],x]);
								});
							}
							else if(_t[0]=='~'){
								return E_impl.bind(null,_t[1], index, env, bound, match, function(x){
									if(isString(x) || x==null ||
										(isArray(x)&&nonEmpty(x)&&x[0] in set(['#','\\()\\','\\{}\\']))){
										if (isString(x) && nonEmpty(x)){
											bound[x]=true;
										}
										else if(isArray(x) && x[0]=='#' && isString(x[1]) && nonEmpty(x[1])){
											bound[x[1]]=true;
										}
										return cont.bind(null,[_t[0],x]);
									}
									else{
										do_raise_syntax("expect identifier, given: "+AstToString(x).replace(/\n$/,''));
									}
								});
							}
							if(_t[0]=='->'){
								return E_impl.bind(null,_t[1], index, env, bound, match, function(x){
									if(nonEmpty(_t[2]) && _t[2][0]=='|'){
										return E_impl.bind(null,_t[2], index, env, bound, 1, function(y){
											return cont.bind(null,[_t[0],x,y]);
										});
									}
									else{
										return E_impl.bind(null,_t[2], index, env, bound, match, function(y){
											return cont.bind(null,[_t[0],x,y]);
										});
									}
								});
							}
							else if(_t[0]=='|'){
								return map_cps.bind(null,function(x,cont){
										var sub=bound;
										if(match==1){
											sub={};
											for (var key in bound) {
												sub[key]=bound[key];
											}
										}
										return E_impl.bind(null, x[0], index, env, sub, match, function(y){
											return E_impl.bind(null, x[1], index, env, sub, 0, function(z){
												return cont.bind(null,[y,z]);
											});
										});
									},
									_t[1], 
									function(x){
										return cont.bind(null,['|',x]);
									});
							}
							else if(_t[0]=='None'){
								return cont.bind(null,_t);
							}
							else if(_t[0]=='lambda'){
								var b={};
								return E_impl.bind(null,_t[1], index, env, bound, match, function(x){
									if(!(x==null || isString(x) || (isArray(x)&&nonEmpty(x)&&x[0] in set(['#','~','\\{}\\','\\()\\'])))){
										do_raise_syntax("invaild function name: "+AstToString(x).replace(/\n$/,''));
									}
									return E_impl.bind(null,['()',_t[2]], index, env, b, 1, function(y){
										y[1].forEach(function(item,index){
											if(isString(item) && nonEmpty(item)){
												b[item]=true;
											}
											else if(isArray(item)&&nonEmpty(item)&&item[0]=='#'){
												b[item[1]]=true;
											}
											else if(!(isArray(item)&&nonEmpty(item)&&item[0] in set (['#','~','lambda','[]','()','\\{}\\','\\()\\']) ||
												isNumber(item) || item==null)){
												do_raise_syntax("invaild function argument: "+AstToString(item).replace(/\n$/,''));
											}
										});
										return E_impl.bind(null,_t[3], index, env, b, match, function(z){
											return cont.bind(null,[_t[0],x==null?'':x,y[1],z]);
										});
									});
								});
							}
							else if(_t[0] in set(['def','def_const','def!','def!_const'])){
								return cont.bind(null,null);
							}
							else if(_t[0]=='#'){
								return cont.bind(null,_t);
							}
						}
						else{
							return cont.bind(null,null);
						}
					}
					else{
						if(isString(_t) && _t in _msym && _msym[_t](-1)[0] in set(['def_const','def!_const'])){
							var dirty=(_msym[_t](-1)[0].indexOf('!')!=-1);
							return _msym[_t]().bind(null,null,function(f){
								return f().bind(null,[],function(v0){
									return v0().bind(null,null,	function(v){
										if(!isFunction(v)) v=val_func(v);
										if(dirty){
											return E_impl.bind(null, T(v(-1), function(_t){ return _t in bound? S(index-1)(_t) : S(index-1,env)(_t); }), index, env, bound, match, function(n){
												return cont.bind(null,n);
											});
										}
										else{
											return E_impl.bind(null, T(v(-1), S(index,v(-3))), index+1, v(-3), {}, match, function(n){
												return cont.bind(null,n);
											});
										}
									});
								});
							});
						}
						else{
							return cont.bind(null,_t);
						}
					}
				}
				return E_impl.bind(null,_t,index,undefined,{},0,cont);
			}
			var A=function(_t){
				if(isArray(_t)){
					if(nonEmpty(_t)){
						if(_t[0] in set(['->','<-','!=','<=','>=','<','>','=','+','-','*','/','%','^','!','_'])){
							return [_t[0], A(_t[1]), A(_t[2])];
						}
						else if(_t[0]=='()'){
							return [_t[0],_t[1].map(function(x){ return A(x); })];
						}
						else if(_t[0] in set(['[]','\\()\\','\\{}\\','delay','callcc','eval','curry'])){
							return [_t[0], A(_t[1])];
						}
						else if(_t[0]=='~'){
							if(isArray(_t[1]) && nonEmpty(_t[1]) && _t[1][0]=='#'){
								if(Object.keys(id_set[_t[1][1]]).length>1){
									var name=_t[1][1];
									var i=0;
									while(name+'_'+i in id_set) ++i;
									name=name+'_'+i;
									id_set[name]={};
									id_set[name][_t[1][2]]=true;
									rename_set[_t[1][1]+'#'+_t[1][2]]=name;
								}
								else{
									rename_set[_t[1][1]+'#'+_t[1][2]]=_t[1][1];
								}
							}
							return [_t[0], A(_t[1])];
						}
						else if(_t[0]=='|'){
							return [_t[0],_t[1].map(function(x){ return [A(x[0]),A(x[1])]; })];
						}
						else if(_t[0]=='None'){
							return ['None'];
						}
						else if(_t[0]=='lambda'){
							var args=_t[2]
								.map(function(x){ return A(x); })
								.map(function(x){
									if(isArray(x) && x[0]=='#'){
										if(Object.keys(id_set[x[1]]).length>1){
											var name=x[1];
											var i=0;
											while(name+'_'+i in id_set) ++i;
											name=name+'_'+i;
											id_set[name]={};
											id_set[name][x[2]]=true;
											rename_set[x[1]+'#'+x[2]]=name;
											return name;
										}
										else{
											rename_set[x[1]+'#'+x[2]]=x[1];
											return x[1];
										}
									}
									else{
										return x;
									}
								});
							return [_t[0], A(_t[1]), args, A(_t[3])];
						}
						else if(_t[0] in set(['def','def_const','def!','def!_const'])){
							return null;
						}
						else if(_t[0]=='#'){
							if(_t[2]==0){
								return _t[1];
							}
							else{
								return ((_t[1]+'#'+_t[2]) in rename_set ? rename_set[(_t[1]+'#'+_t[2])] : _t);
							}
						}
					}
					else{
						return null;
					}
				}
				else{
					return _t;
				}
			}
			var U=function(_t){
				if(isArray(_t)){
					if(nonEmpty(_t)){
						if(_t[0] in set(['->','<-','!=','<=','>=','<','>','=','+','-','*','/','%','^','!','_'])){
							return [_t[0], U(_t[1]), U(_t[2])];
						}
						else if(_t[0]=='()'){
							return [_t[0],_t[1].map(function(x){ return U(x); })];
						}
						else if(_t[0] in set(['[]','\\()\\','\\{}\\','~','delay','callcc','eval','curry'])){
							return [_t[0], U(_t[1])];
						}
						else if(_t[0]=='|'){
							return [_t[0],_t[1].map(function(x){ return [U(x[0]),U(x[1])]; })];
						}
						else if(_t[0]=='None'){
							return ['None'];
						}
						else if(_t[0]=='lambda'){
							var f=_t[1]==null ? '' :
								isArray(_t[1]) && nonEmpty(_t[1]) && _t[1][0]=='#' ? _t[1][1] : 
								_t[1];
							return [_t[0], f, _t[2].map(function(x){ return U(x); }), U(_t[3])];
						}
						else if(_t[0] in set(['def','def_const','def!','def!_const'])){
							return null;
						}
						else if(_t[0]=='#'){
							if(_t.length==3){
								return _t[1];
							}
							else{
								return _t;
							}
						}
					}
					else{
						return null;
					}
				}
				else{
					return _t;
				}
			}

			return E.bind(null,T(_t,S(0)),1,function(x){
				return cont.bind(null, U(A(x)));
			});
		});

		var expansion=(function(_t, _msym, cont){
			return map_cps.bind(null,function(x,cont){
				return KFFD.bind(null, x, _msym, cont);
			},
			_t, 
			function(x){
				return cont.bind(null,x.filter(function(v){
					return (isArray(v) && nonEmpty(v)) || v!=null;
				}));
			});
		});

		return (expansion.bind(null, Ast, msym, function(x){
			return cont.bind(null,x);
		}));
	}
	var environment=function(_env, _symtable){
		return function(_syb){
			return (_syb in _env) ? _env[_syb] :
				(_syb in _symtable) ? _symtable[_syb] :
				do_raise("undefine symbol: "+_syb);
		};
	}
	var ast_func=function(_ast, _env, _gsym){
		var code=AstToString(_ast).replace(/\n$/,'');
		if(code.indexOf('\n')==-1){
			code='['+code+']';
		}
		else{
			code='[\n'+indent(code)+'\n]';
		}
		return function(i){
			if(i === undefined) {
				i = 0;
			}
			switch(i){
				case -3:
					return [_env, _gsym];
				case -1:
					return _ast;
				case 0:
					do_raise("invaild evaluate on Ast: "+code);
				case 1:
					return function(){
						return code;
					}
				case 2:
					return 'Ast';
			}
		}
	}
	var builtin_func=function(f, name, args, decay){
		if(decay === undefined) {
			decay = true;
		}
		return function(i){
			if(i === undefined) {
				i = 0;
			}
			switch(i){
				case -2:
					return args.length;
				case -1:
					return name;
				case 0:
					return function(_args, cont){
						if(_args.length==args.length){
							if(!decay){
								return f.bind.apply(f, [null].concat(_args).concat([function(x){
									return cont.bind(null,x);
								}]));
							}
							else{
								return map_cps.bind(null, function(x,cont){
									return x().bind(null,null,cont);
								},
								_args, 
								function(x){
									return f.bind.apply(f, [null].concat(x).concat([function(y){
										return cont.bind(null,val_func(y));
									}]));
								});
							}
						}
						else{
							do_raise("call lambda<"+name+"> with unmatched arguments,\nexpect: "+argument_number(args.length)+" ("+
								args.join(',')+'),\ngiven: '+
								argument_number(_args.length)
							);
						}
					};
				case 1:
					return function(cont){
						return cont.bind(null, ('lambda<'+name+'('+args.join(', ')+')>'));
					}
				case 2:
					return 'lambda_builtin';
			}
		}
	}
	var continuation_func=function(cont){
		return function(i){
			if(i === undefined) {
				i = 0;
			}
			switch(i){
				case -2:
					return 1;
				case -1:
					do_raise("No explicit Ast of continuation function");
				case 0:
					return function(_args, _cont){
						if(_args.length==1){
							return cont.bind(null, _args[0]);
						}
						else{
							do_raise('call lambda<<continuation>> with unmatched arguments,\nexpect: 1 argument (return_value),\ngiven: '+
								argument_number(_args.length)
							);
						}
					};
				case 1:
					return function(cont){
						return cont.bind('lambda<<continuation>>');
					}
				case 2:
					return 'lambda_continuation';
			}
		}
	}
	var func=function(_type, _name, _args, _body, _env, _gsym, _eval, _macro){
		var decay=_args.length==1 &&
			Object.keys(set(_args[0].filter(isString))).length==_args[0].length;
		if(_macro === undefined) {
			_macro = false;
		}
		return function(i){
			if(i === undefined) {
				i = 0;
			}
			switch(i){
				case -2:
					return _args[0].length;
				case -1:
					return (function(){
						if(_args.length==1){
							return [_type,_name,_args[0],_body[0]];
						}
						else{
							var atom=_args[0].length==1;
							var args=[], body=[];
							for(var i in _args[0])
								args.push('arg_'+i);
							for(var i in _args)
								body.push([atom?(function(x){ return isString(x)? ['~',x]:x; })(_args[i][0]):['()',_args[i].map(function(x){ return isString(x)? ['~',x]:x; })],_body[i]]);
							body=['->',atom?args[0]:['()',args],['|',body]];
							return [_type,_name,args,body];
						}
					})();
				case 0:
					return function(_args0, cont){
						var atom=_args[0].length==1;
						var err = function(){
							if(_args.length==1){
								do_raise("call "+(_macro?"macro":"lambda")+"<"+((_name) ? _name : 'unnamed')+"> with unmatched arguments,\nexpect: "+ argument_number(_args.length) +"("+
									_args[0].map(function(x){ return AstToString(x).replace(/\n$/,''); }).join(',')+'),\ngiven: '+
									argument_number(_args0.length)
								);
							}
							else{
								do_raise("call "+(_macro?"macro":"lambda")+"<"+((_name) ? _name : 'unnamed')+"> with unmatched arguments,\nexpect one of: "+
									_args.map(function(x){return '('+x.map(function(y){ return AstToString(y).replace(/\n$/,''); }).join(',')+')'; }).join(', ')
								);
							}
						}
						var L = function(i,cont){
							return _eval.bind(null, 
								atom?(function(x){ return isString(x)? ['~',x,-1]:x; })(_args[i][0]):['()',_args[i].map(function(x){ return isString(x)? ['~',x,-1]:x; })], 
								_env, _gsym, 
								function(args){
								return unify.bind(null,atom?_args0[0]:val_func(_args0),args,function(u){
									if(u[0]){
										return _eval.bind(null, _body[i], merge_dict(u[1], _env), _gsym, cont);
									}
									else if(i+1<_args.length){
										return L.bind(null,i+1,cont);
									}
									else{
										err();
									}
								});
							});
						}
						if(_args0.length==_args[0].length){
							if(decay){
								var _new_env={};
								_args[0].forEach(function(item,index){
									_new_env[item]=_args0[index];
								});
								var ret;
								return _eval.bind(null, _body[0], merge_dict(_new_env, _env), _gsym, cont);
							}
							else{
								return L.bind(null,0,cont);
							}
						}
						else{
							err();
						}
					};
				case 1:
					return function(cont){
						if(_args.length==1){
							return cont.bind(null, ((_macro?"macro":"lambda")+'<'+
								(nonEmpty(_name) ? _name : 'unnamed')+
								'('+_args[0].map(function(x){ 
									return AstToString(x).replace(/\n$/,'');
								}).join(', ')+')>'));
						}
						else{
							var args=[];
							for(var i in _args[0])
								args.push('arg_'+i);
							return cont.bind(null, ((_macro?"macro":"lambda")+'<'+(nonEmpty(_name) ? _name : 'unnamed')+'('+args.join(', ')+')>'));
						}
					}
				case 2:
					return (_macro?"macro":"lambda");
			}
		}
	}
	var delay_func=function(_body, _env, _gsym, _eval, value){
		return function(i){
			if(i === undefined) {
				i = 0;
			}
			if(i==-1){
				return _body;
			}
			else if(i==-2){
				return (isArray(_body) && nonEmpty(_body) && _body[0]=='lambda') ? _body[2].length : undefined;
			}
			else if(i==3){
				return 'delay_expr';
			}
			else{
				if(typeof(value) == 'undefined'){
					return function(){
						var args=Array.prototype.slice.call(arguments);
						return _eval.bind(null, _body, _env, _gsym, function(x){
							value=x;
							var r=x(i);
							return r.bind.apply(r,[null].concat(Array.prototype.slice.call(args)));
						});
					}
				}
				else{
					return value(i);			
				}
			}
		}
	}
	var val_func=function(_val){
		return function(i){
			if(i === undefined) {
				i = 0;
			}
			switch(i){
				case -1:
					return (wapper(function(self,_v){
						if(isFunction(_v)){
							return _v(-1);
						}
						else if(isArray(_v)){
							return ['()',_v.map(function(x){
								return self(x);
							})];
						}
						else if(_v==null){
							return 'None';
						}
						return _v;
					})(_val));
				case 0:
					return function(_args, cont){
						return cont.bind(null,_val);
					};
				case 1:
					return function(cont){
						if(isFunction(_val)){
							return _val(1).bind(null, cont);
						}
						else if(isArray(_val)){
							return map_cps.bind(null, result_of, _val, function(v){
								return cont.bind(null, '('+v.toString()+')');
							});
						}
						else if(_val==null){
							return cont.bind(null, 'None');
						}
						return cont.bind(null, _val.toString());
					}
				case 2:
					return 'value';
			}
		}
	}
	var free_identifier_func=function(id){
		return function(i){
			if(i === undefined) {
				i = 0;
			}
			switch(i){
				case -1:
					return ['~',id,1];
				case 0:
					return function(_args, cont){
						return cont.bind(null,null);
					};
				case 1:
					return (function(cont){ return cont.bind(null, 'None'); });
				case 2:
					return 'free_identifier';
				case 3:
					return id;
			}
		}
	}
	var func_combinator=function(x, y, op, op_ch){
		var getFunc=function(v){
			if(v(2)=='lambda_continuation'){
				return ['lambda','continuation',['retValue']];
			}
			if(v(2)=='lambda_builtin'){
				return builtin_func_signature(v(-1));
			}
			else{
				return v(-1);
			}
		};
		var fx=getFunc(x);
		var fy=getFunc(y);
		var args_length=0;
		if(x(2)!='value'&&y(2)!='value'){
			if(fx[2].length!=fy[2].length){
				do_raise("combine lambda<"+((fx[1]) ? fx[1] : 'unnamed')+"> with lambda<"+((fy[1]) ? fy[1] : 'unnamed')+"> unmatched arguments,\n    arguments of "+
					"lambda<"+((fx[1]) ? fx[1] : 'unnamed')+">: ("+fx[2].join(',')+"),\n    arguments of "+
					"lambda<"+((fy[1]) ? fy[1] : 'unnamed')+">: ("+fy[2].join(',')+")"
				);
			}
			args_length=fx[2].length;
		}
		return function(i){
			if(i === undefined) {
				i = 0;
			}
			switch(i){
				case -2:
					return args_length;
				case -1:
					return (function(){
						var n,m=0;
						var args=[];
						var fx_name='',fy_name='';
						var call_x,call_y;
						if(x(2)!='value'){
							n=fx[2].length;
							fx_name=fx[1];
						}
						if(y(2)!='value'){
							n=fy[2].length;
							fy_name=fy[1];
						}
						for (var i = 0; i<n; i++) {
							while(('arg_'+m)==fx_name||('arg_'+m)==fy_name){
								m++;
							}
							args.push('arg_'+m);
							m++;
						}
						if(x(2)!='value') call_x=['<-',x(-1),['()',args]];
						else call_x=x(-1);
						if(y(2)!='value') call_y=['<-',y(-1),['()',args]];
						else call_y=y(-1);
						return ['lambda','',args,[op_ch,call_x,call_y]];
					})();
				case 0:
					return function(_args, cont){
						return x().bind(null,_args, function(x){
							return y().bind(null,_args, function(y){
								return op.bind(null,x,y,cont);
							});
						});
					};
				case 1:
					return function(cont){
						return result_of.bind(null, x, function(v1){
							result_of.bind(null, y, function(v2){
								return cont.bind(null, 'lambda<'+v1+op_ch+v2+'>');
							});
						});
					}
				case 2:
					return 'lambda_combinator';
			}
		}
	}
	var curry_func=function(f){
		if(!isFunction(f) || f(2)=='Ast' || f(2)=='free_identifier'){
			do_raise("currying a not callable object ");
		}
		else if(f(2)=='lambda_continuation'){
			return f;
		}
		else if(f(-2)==1){
			return f;
		}
		var args_length=f(-2);
		return wapper(function(self,i,args,index){
			if(args === undefined) {
				args = [];
			}
			if(index === undefined) {
				index = 0;
			}
			if(i === undefined) {
				i = 0;
			}
			switch(i){
				case -2:
					return 1;
				case -1:
					return ((function(){
						var L=function(i){
							if(i+1<args_length){
								return ['lambda','',['arg_'+i],L(i+1)];
							}
							else{
								var _args=[];
								for (var _i = index; _i < args_length; ++_i) {
									_args.push('arg_'+i);
								}
								return ['lambda','',['arg_'+i],['<-',f(-1),['()',args.map(function(x){ return x(-1); }).concat(_args)]]];
							}
						}
						return L(index);
					})());
				case 0:
					return function(_args, cont){
						if(_args.length==1 && index+1<args_length){
							return cont.bind(null, val_func(function(i){
								return self(i,args.concat([_args[0]]),index+1);
							}));
						}
						else if(_args.length==1 && index+1==args_length){
							return f().bind(null,args.concat([_args[0]]),cont);
						}
						else{
							do_raise('call currying '+f(1)()+' with unmatched arguments,\n    expect: 1 argument (arg_'+index+'), given: '+
								argument_number(_args.length)
							);
						}
					};
				case 1:
					return (function(cont){ return f(1).bind(null, function(v){return cont.bind(null, 'currying '+v);}); });
				case 2:
					return 'lambda_curry';
			}
		});
	}
	var op_args=function(f){
		return function(x){
			if(isFunction(x)&&x(2)=='free_identifier')
				return f.bind(null,null);
			else if(isFunction(x)&&x(2)=='Ast')
				do_raise("invaild evaluate on Ast: "+x(1)());
			else
				return f.bind(null,x);
		}
	}
	var op_gen=function(op, op_ch){
		return wapper(function(self,x,y,cont){
			return x().bind(null,null,op_args(function(a){
				return y().bind(null,null,op_args(function(b){
					if(!isFunction(a)&&!isFunction(b)){
						return op.bind(null,a,b,function(x){
							return cont.bind(null,val_func(x));
						});
					}
					else{
						return cont.bind(null,val_func(func_combinator((isFunction(a)?a:val_func(x)),(isFunction(b)?b:val_func(y)),self,op_ch)));
					}
				}));
			}));
		});
	}
	var op_check=function(f){
		return function(x,y,cont){
			if(!isArray(x)&&!isArray(y)){
				return f.bind(null,x,y,cont);
			}
			else{
				do_raise("invaild operatation on vector");
			}
		};
	}
	var combinator=function(_sym){
		return {
			'<-':function(x,y,cont){
				return x().bind(null,null,function(f){
					if(isFunction(f) && f(2)!='value'){
						return y().bind(null,null,function(_args){
							return f().bind(null,_args,cont);
						});
					}
					else{
						return result_of.bind(null, x, function(v){
							do_raise("calling a not callable object "+v);
						});
					}
				});
			},
			'<=':op_gen(op_check(function(a,b,cont){return cont.bind(null,a<=b);}),'<='),
			'>=':op_gen(op_check(function(a,b,cont){return cont.bind(null,a>=b);}),'>='),
			'<':op_gen(op_check(function(a,b,cont){return cont.bind(null,a<b);}),'<'),
			'>':op_gen(op_check(function(a,b,cont){return cont.bind(null,a>b);}),'>'),
			'!=':op_gen(op_check(function(a,b,cont){return cont.bind(null,a!=b);}),'!='),
			'=':op_gen(op_check(function(a,b,cont){return cont.bind(null,a==b);}),'='),
			'+':op_gen(function(a,b,cont){
					if(!isArray(a)&&!isArray(b)){
						return cont.bind(null,a+b);
					}
					else{
						var x=isArray(a) ? a : [val_func(a)];
						var y=isArray(b) ? b : [val_func(b)];
						return cont.bind(null,x.concat(y));
					}
				},'+'),
			'-':op_gen(function(a,b,cont){
					if(!isArray(a)&&!isArray(b)){
						return cont.bind(null,a-b);
					}
					else if(isArray(a)&&!isArray(b)){
						return cont.bind(null,a.slice(0,-1));
					}
					else if(!isArray(a)&&isArray(b)){
						return cont.bind(null,b.slice(1));
					}
					else if(isArray(a)&&isArray(b)){
						if(a.length<=b.length){
							return cont.bind(null,[]);
						}
						else{
							return cont.bind(null,a.slice(0,-b.length));
						}
					}
				},'-'),
			'*':op_gen(op_check(function(a,b,cont){return cont.bind(null,a*b);}),'*'),
			'/':op_gen(op_check(function(a,b,cont){return cont.bind(null,a/b);}),'/'),
			'%':op_gen(op_check(function(a,b,cont){return cont.bind(null,a%b);}),'%'),
			'^':op_gen(op_check(function(a,b,cont){return cont.bind(null,Math.pow(a,b));}),'^'),
			'_':op_gen(function(a,b,cont){
					if(isArray(a)&&!isArray(b)){
						if(Number.isInteger(b)){
							if(b<=a.length&&b>0){
								return a[b-1]().bind(null,null,function(r){
									return cont.bind(null,r);
								});
							}
							else{
								do_raise("index of vector out of range");
							}
						}
						else{
							do_raise("invaild index of vector");
						}
					}
					else{
						do_raise("invaild operatation on vector");
					}
				},'_'),
			'!':op_gen(op_check(function(a,b,cont){
					var i=(b==null)?0:b;
					if(b<0){
						return cont.bind(null,0);
					}
					else{
						var ret=1;
						var x=a;
						while(x>b){
							ret*=x--;
						}
						return cont.bind(null,ret);
					}
				}),'!'),
		}[_sym];
	}
	var unify=function(n,m,cont){
		var valE={};
		var equivalent_value=function(val,cont,fail){
			var visited_flag={};
			var ev_impl=function(v,cont){
				if(isFunction(v) && v(2)=='free_identifier'){
					v=v(3);
				}
				if(v in visited_flag){
					return fail;
				}
				visited_flag[v]=true;
				var x=v;
				while(x in valE){
					x=valE[x];
				}
				if(isArray(x) && nonEmpty(x) && x[0]=='Ast'){
					delete visited_flag[v];
					return cont.bind(null,ast_func(x[1]));
				}
				else if(isArray(x)){
					return map_cps.bind(null,function(x0,cont){
						return x0().bind(null,null,function(x1){
							return ev_impl.bind(null,x1,function(x2){
								return cont.bind(null,val_func(x2));
							});
						});
					},
					x, 
					function(x){
						delete visited_flag[v];
						return cont.bind(null,x);
					});
				}
				else if(isString(x)){
					delete visited_flag[v];
					valE[x]=null;
					return cont.bind(null,null);
				}
				else{
					delete visited_flag[v];
					return cont.bind(null,x);
				}
			}
			return ev_impl.bind(null,val,cont);
		}
		var unify_impl=function(_n,_m,cont){
			var Alpha=function(x,y,u){
				if(u === undefined) {
					u = false;
				}
				var alpha_impl=function(x,y,rename,last_rename,match){
					if(u){
						var ex=x,ey=y;
						if(isArray(x) && x.length==3 && x[0]=='~' && x[2]>0){
							ex=isString(x[1])?'~'+x[1]:'~';
							while(ex in valE) ex=valE[x];
						}
						if(isArray(y) && y.length==3 && y[0]=='~' && y[2]>0){
							ey=isString(y[1])?'~'+y[1]:'~';
							while(ey in valE) ey=valE[y];
						}
						if(ex=='~' || ey=='~' || (isString(ex) && nonEmpty(ex) && ex[0]=='~' && ex==ey)){
							return true;
						}
						else if(isString(ex) && nonEmpty(ex) && ex[0]=='~'){
							if(isString(ey) && nonEmpty(ey) && ey[0]=='~'){
								valE[ex]=ey;
							}
							else{
								valE[ex]=ast_func(ey);
							}
							return true;
						}
						else if(isString(ey) && nonEmpty(ey) && ey[0]=='~'){
							valE[ey]=ast_func(ex);
							return true;
						}
						else if(isArray(ex) && nonEmpty(ex) && ex[0]=='Ast'){
							ex=ex[1];
						}
						else if(isArray(ey) && nonEmpty(ey) && ey[0]=='Ast'){
							ey=ey[1];
						}
						x=ex; y=ey;
					}
					if(isArray(x) && isArray(y)){
						if(nonEmpty(x) && nonEmpty(y) && x[0]==y[0]){
							if(x[0] in set(['<-','!=','<=','>=','<','>','=','+','-','*','/','^','!','_'])){
								return alpha_impl(x[1],y[1],rename,last_rename,false) && alpha_impl(x[2],y[2],rename,last_rename,false);
							}
							else if(x[0]=='()'){
								if(x[1].length==y[1].length){
									for(var i in x[1]){
										if(!alpha_impl(x[1][i],y[1][i],rename,last_rename,match))
											return false;
									}
									return true;
								}
								else if(u && x[1].length==y[1].length+1 && x[1][x[1].length-1][0]=='~' && x[1][x[1].length-1][2]==2){
									if(alpha_impl(x[1][x[1].length-1],['()',[]],rename,last_rename,match)){
										for(var i in y[1]){
											if(!alpha_impl(x[1][i],y[1][i],rename,last_rename,match))
												return false;
										}
										return true;
									}
									else{
										return false;
									}
								}
								else if(u && y[1].length==x[1].length+1 && y[1][y[1].length-1][0]=='~' && y[1][y[1].length-1][2]==2){
									if(alpha_impl(['()',[]],y[1][y[1].length-1],rename,last_rename,match)){
										for(var i in x[1]){
											if(!alpha_impl(x[1][i],y[1][i],rename,last_rename,match))
												return false;
										}
										return true;
									}
									else{
										return false;
									}
								}
								else if(u && nonEmpty(y[1]) && x[1].length>y[1].length){
									var last=y[1][y[1].length-1];
									if(isArray(last) && nonEmpty(last) && last[0]=='~' && last[2]==2 &&
										alpha_impl(['()',x[1].slice(y[1].length-1,x[1].length)],last,rename,last_rename,match)){
										for(var i=0; i<y[1].length-1; ++i){
											if(!alpha_impl(x[1][i],y[1][i],rename,last_rename,match))
												return false;
										}
										return true;
									}
									else{
										return false;
									}
								}
								else if(u && nonEmpty(x[1]) && x[1].length<y[1].length){
									var last=x[1][x[1].length-1];
									if(isArray(last) && nonEmpty(last) && last[0]=='~' && last[2]==2 &&
										alpha_impl(last,['()',y[1].slice(x[1].length-1,y[1].length)],rename,last_rename,match)){
										for(var i=0; i<x[1].length-1; ++i){
											if(!alpha_impl(x[1][i],y[1][i],rename,last_rename,match))
												return false;
										}
										return true;
									}
									else{
										return false;
									}
								}
								else{
									return false;
								}
							}
							else if(x[0] in set(['#','\\()\\','\\{}\\','delay','callcc','eval','curry'])){
								return alpha_impl(x[1],y[1],rename,last_rename,match);
							}
							else if(x[0]=='[]'){
								return alpha_impl(x[1],y[1],[{},{}],rename,match);
							}
							else if(x[0] in set(['\\()\\','\\{}\\'])){
								return alpha_impl(x[1],y[1],last_rename,[{},{}],match);
							}
							else if(x[0]=='->'){
								if(isArray(x[2]) && isArray(y[2])){
									if(nonEmpty(x[2]) && nonEmpty(y[2]) && x[2][0]==y[2][0] && x[2][0]=='|'){
										return alpha_impl(x[1],y[1],rename,last_rename,match) && alpha_impl(x[2],y[2],rename,last_rename,true);
									}
								}
								return alpha_impl(x[1],y[1],rename,last_rename,match) && alpha_impl(x[2],y[2],rename,last_rename,match);
							}
							else if(x[0]=='~'){
								if(match){
									if(x[1]==y[1]){
										return true;
									}
									else if(x[1]!=y[1] && !(x[1] in rename[0]) && !(y[1] in rename[1])){
										rename[0][y[1]]=x[1];
										rename[1][x[1]]=y[1];
										return true;
									}
									else{
										return false;
									}
								}
								else{
									return alpha_impl(x[1],y[1],rename,last_rename,match);
								}
							}
							else if(x[0]=='|'){
								if(x[1].length==y[1].length){
									for(var i in x[1]){
										if(match){
											var n=[{},{}];
											for (var key in rename[0]) {
												n[0][key]=rename[0][key];
											}
											for (var key in rename[1]) {
												n[1][key]=rename[1][key];
											}
											if(!(alpha_impl(x[1][i][0],y[1][i][0],n,last_rename,match)&&alpha_impl(x[1][i][1],y[1][i][1],n,last_rename,false)))
												return false;
										}
										else{
											if(!(alpha_impl(x[1][i][0],y[1][i][0],rename,last_rename,match)&&alpha_impl(x[1][i][1],y[1][i][1],rename,last_rename,false)))
												return false;
										}
									}
									return true;
								}
								else{
									return false;
								}
							}
							else if(x[0]=='None'){
								return true;
							}
							else if(x[0]=='lambda'){
								var alpha_function=function(x,y){
									var n=[{},{}];
									for (var key in rename[0]) {
										n[0][key]=rename[0][key];
									}
									for (var key in rename[1]) {
										n[1][key]=rename[1][key];
									}
									for (var i in y[2]){
										if(isString(y[2][i]) && isString(x[2][i]) && y[2][i]!=x[2][i]){
											n[0][y[2][i]]=x[2][i];
											n[1][x[2][i]]=y[2][i];
										}
										else if(isArray(y[2][i]) && isArray(x[2][i]) && y[2][i][0]==x[2][i][0] && y[2][i][0] in set(['[]','()'])){
											if(!alpha_impl(x[2][i],y[2][i],n,last_rename,true)){
												return false;
											}
										}
									}
									alpha_impl(x[1],y[1],[{},{}],last_rename,match);
									for (var i in y[2]){
										if(!alpha_impl(x[2][i],y[2][i],n,last_rename,match)){
											return false;
										}
									}
									return alpha_impl(x[3],y[3],n,last_rename,match);
								}
								if(x[2].length==y[2].length){
									return alpha_function(x,y);
								}
								else if(u && x[2].length==y[2].length+1 && x[2][x[2].length-1][0]=='~' && x[2][x[2].length-1][2]==2){
									if(alpha_impl(x[2][x[2].length-1,['()',[]]],rename,last_rename,match)){
										return alpha_function([x[0],x[1],x[2].slice(0,-1),x[3]],y);
									}
									else{
										return false;
									}
								}
								else if(u && y[2].length==x[2].length+1 && y[2][y[2].length-1][0]=='~' && y[2][y[2].length-1][2]==2){
									if(alpha_impl(['()',[]],y[2][y[2].length-1],rename,last_rename,match)){
										return alpha_function(x,[y[0],y[1],y[2].slice(0,-1),y[3]]);
									}
									else{
										return false;
									}
									alpha_impl(x[1],y[1],[{},{}],last_rename,match);
									alpha_impl(['()',[]],y[2][0],rename,last_rename,match)
									return alpha_impl(x[3],y[3],rename,last_rename,match);
								}
								else if(u && nonEmpty(y[2]) && x[2].length>y[2].length){
									var last=y[2][y[2].length-1];
									if(isArray(last) && nonEmpty(last) && last[0]=='~' && last[2]==2 &&
										alpha_impl(['()',x[2].slice(y[2].length-1,x[2].length)],last,rename,last_rename,match)){
										return alpha_function([x[0],x[1],x[2].slice(0,y[2].length-1),x[3]],[y[0],y[1],y[2].slice(0,-1),y[3]]);
									}
									else{
										return false;
									}
								}
								else if(u && nonEmpty(x[2]) && x[2].length<y[2].length){
									var last=x[2][x[2].length-1];
									if(isArray(last) && nonEmpty(last) && last[0]=='~' && last[2]==2 &&
										alpha_impl(['()',y[2].slice(x[2].length-1,y[2].length)],last,rename,last_rename,match)){
										return alpha_function([x[0],x[1],x[2].slice(0,-1),x[3]],[y[0],y[1],y[2].slice(0,x[2].length-1),y[3]]);
									}
									else{
										return false;
									}
								}
								else{
									return false;
								}
							}
							else if(x[0] in set(['def','def_const','def!','def!_const'])){
								return false;
							}
						}
						else if(isEmpty(x) && isEmpty(y)){
							return true;
						}
						else{
							return false;
						}
					}
					else if(!isArray(x) && !isArray(y)){
						if((y in rename[0])){
							y=rename[0][y];
						}
						else if(!(y in rename[0]) && (y in rename[1])){
							return false;
						}
						return x===y;
					}
					else{
						return false;
					}
				}
				return alpha_impl(x,y,[{},{}],[{},{}],false);
			}
			var U=function(x,y,cont){
				while(x in valE) x=valE[x];
				while(y in valE) y=valE[y];
				if(x==y){
					return cont.bind(null,true);
				}
				else if(isArray(x) && isArray(y)){
					if(nonEmpty(x) && x[0]=='Ast' && nonEmpty(y) && y[0]=='Ast'){
						return cont.bind(null,Alpha(x[1],y[1],true));
					}
					else if((nonEmpty(x) && x[0]=='Ast') || (nonEmpty(y) && y[0]=='Ast')){
						return cont.bind(null,false);
					}
					else{
						if(x.length!=y.length){
							return cont.bind(null,false);
						}
						else{
							var L=function(i,cont){
								if(i<x.length){
									return unify_impl.bind(null,x[i],y[i],function(v){
										if(v){
											return L.bind(null,i+1,cont);
										}
										else{
											return cont.bind(null,false);
										}
									});
								}
								else{
									return cont.bind(null,true);
								}
							}
							return L.bind(null,0,cont);
						}
					}
				}
				else if(isFunction(x) && isFunction(y) &&
					x(2)!='lambda_continuation' && x(2)!='lambda_continuation'){
					return cont.bind(null,Alpha(x(-1),y(-1)));
				}
				else if(isString(x)){
					valE[x]=y;
					return cont.bind(null,true);
				}
				else if(isString(y)){
					valE[y]=x;
					return cont.bind(null,true);
				}
				else if((isBoolean(x)||isBoolean(y)) && toBoolean(x)==toBoolean(y)){
					return cont.bind(null,true);
				}
				else{
					return cont.bind(null,false);
				}
			}

			if((_n(3)=='delay_expr' && _m(3)!='delay_expr') ||
				(_n(3)!='delay_expr' && _m(3)=='delay_expr')){
				if(_m(3)=='delay_expr'){
					var _t=_n;_n=_m;_m=_t;
				}
				return _m().bind(null,null,function(vy){
					if(isFunction(vy) && vy(2)=='free_identifier'){
						valE['~'+vy(3)]=_n;
						return cont.bind(null,true);
					}
					else if(isFunction(vy) && vy(2)=='Ast'){
						vy=['Ast',vy(-1)];
					}
					return _n().bind(null,null,function(vx){
						if(isFunction(vx) && vx(2) in set(['free_identifier','Ast'])){
							vx=vx(2)=='Ast'?['Ast',vx(-1)]:'~'+vx(3);
						}
						return U.bind(null,vx,vy,cont);
					});
				});
			}
			else{
				return _n().bind(null,null,function(vx){
					return _m().bind(null,null,function(vy){
						if(isFunction(vx) && vx(2) in set(['free_identifier','Ast'])){
							vx=vx(2)=='Ast'?['Ast',vx(-1)]:'~'+vx(3);
						}
						if(isFunction(vy) && vy(2) in set(['free_identifier','Ast'])){
							vy=vy(2)=='Ast'?['Ast',vy(-1)]:'~'+vy(3);
						}
						return U.bind(null,vx,vy,cont);
					});
				});
			}
		}

		return unify_impl.bind(null,n,m,function(r){
			if(r){
				var nv={};
				var keys=Object.keys(valE);
				var L=function(i,cont0){
					if(i<keys.length){
						return equivalent_value.bind(null,valE[keys[i]],function(x){
							nv[keys[i].replace(/^~/,'')]=isFunction(x)&&x(3)=='delay_expr'?x:val_func(x);
							return L.bind(null,i+1,cont0);
						},function(){
							return cont.bind(null,[false,{}]);
						});
					}
					else{
						return cont0.bind(null);
					}
				}
				return L.bind(null,0,function(){
					return cont.bind(null,[r,nv]);
				});
			}
			else{
				return cont.bind(null,[false,{}]);
			}
		});
	}
	var evaluate_ast_expr=function(_t, _eval, _env, _gsym, cont){
		if(isArray(_t)){
			if(nonEmpty(_t)){
				if(_t[0] in set(['->','!=','<=','>=','<','>','=','+','-','*','/','%','^','!','<-','_'])){
					return evaluate_ast_expr.bind(null,_t[1], _eval, _env, _gsym, function(x){
						return evaluate_ast_expr.bind(null,_t[2], _eval, _env, _gsym, function(y){
							return cont.bind(null,[_t[0],x,y]);
						});
					});
				}
				else if(_t[0]=='\\()\\'){
					return _eval.bind(null,_t[1], _env, _gsym, function(x){
						var r=x(-1);
						if(isArray(r) && nonEmpty(r) && r[0]=='()'){
							r.push(true);
						}
						else if(isArray(r) && nonEmpty(r) && r[0]=='~'){
							r[2]=2;
						}
						return cont.bind(null,r);
					});
				}
				else if(_t[0]=='\\{}\\'){
					return _eval.bind(null,_t[1], _env, _gsym, function(x){
						return cont.bind(null,x(-1));
					});
				}
				else if(_t[0]=='()'){
					return map_cps.bind(null,function(x,cont){
							return evaluate_ast_expr.bind(null,x, _eval, _env, _gsym, cont);
						},
						_t[1], 
						function(x){
							var ret=[];
							x.forEach(function(item,index){
								if(isArray(item) && item.length==3 && item[0]=='()' && item[2]){
									ret=ret.concat(item[1]);
								}
								else{
									ret.push(item);
								}
							});
							return cont.bind(null,['()',ret]);
						});
				}
				else if(_t[0]=='[]'){
					return cont.bind(null,_t);
				}
				else if(_t[0]=='#'){
					return cont.bind(null,_t);
				}
				else if(_t[0]=='~'){
					return evaluate_ast_expr.bind(null, _t[1], _eval, _env, _gsym, function(x){
						if(isString(x) || x==null ||
							(isArray(x)&&nonEmpty(x)&&x[0]=='#')){
							return cont.bind(null,['~',x]);
						}
						else{
							do_raise("expect identifier, given: "+AstToString(x).replace(/\n$/,''));
						}
					});
				}
				else if(_t[0] in set(['delay','callcc','eval','curry'])){
					return evaluate_ast_expr.bind(null,_t[1], _eval, _env, _gsym, function(x){
						return cont.bind(null,[_t[0],x]);
					});
				}
				else if(_t[0]=='|'){
					return map_cps.bind(null,function(x,cont){
							return evaluate_ast_expr.bind(null, x[0], _eval, _env, _gsym, function(y){
								return evaluate_ast_expr.bind(null, x[1], _eval, _env, _gsym, function(z){
									return cont.bind(null,[y,z]);
								});
							});
						},
						_t[1], 
						function(x){
							return cont.bind(null,['|',x]);
						});
				}
				else if(_t[0]=='None'){
					return cont.bind(null,_t);
				}
				else if(_t[0]=='lambda'){
					var err=function(t,msg){
						var errcode=AstToString(t).replace(/\n$/,'');
						errcode=errcode.indexOf('\n')==-1?errcode:'\n'+indent(errcode);
						do_raise(msg+errcode);
					}
					return evaluate_ast_expr.bind(null, _t[1], _eval, _env, _gsym, function(y){
						if(!(isString(y)||(isArray(y) && (y[0]=='~' || y[0]=='#')))) err(y,"invaild function name: ");
						if(_t[2].length==1 && _t[2][0][0]=='\\()\\'){
							return evaluate_ast_expr.bind(null, _t[2][0], _eval, _env, _gsym, function(z){
								if(isArray(z) && z[0]=='()'){
									z[1].forEach(function(item,index){
										if(!(isString(item)||(isArray(item) && (item[0] in set (['#','~','lambda','[]','()'])))||
											isNumber(item) || item==null)){
											err(_t[2][0],"invaild function argument: ");
										}
									});
									z=z[1];
									return evaluate_ast_expr.bind(null, _t[3], _eval, _env, _gsym, function(v){
										return cont.bind(null,['lambda',y,z,v]);
									});
								}
								else if((isString(z) && z=='None') || z==null || (isArray(z) && z[0]=='None')){
									return evaluate_ast_expr.bind(null, _t[3], _eval, _env, _gsym, function(v){
										return cont.bind(null,['lambda',y,[],v]);
									});
								}
								else if(isString(z)||(isArray(z) && (z[0] in set (['#','~','lambda','[]','()'])))||
									isNumber(z) || z==null){
									z=[z];
									return evaluate_ast_expr.bind(null, _t[3], _eval, _env, _gsym, function(v){
										return cont.bind(null,['lambda',y,z,v]);
									});
								}
								else{
									err(_t[2][0][1],"invaild function argument: ");
								}
							});
						}
						else{
							return map_cps.bind(null,function(x,cont){
								return evaluate_ast_expr.bind(null, x, _eval, _env, _gsym, function(x0){
									if(!isString(x0) && 
										!(isNumber(x0) || x0==null) &&
										!(isArray(x0) && nonEmpty(x0) && x0[0] in set (['#','~','lambda','[]','()'])) &&
										!(isArray(x0) && x0.length==3 && x0[0]=='()' && x0[2]))
										err(x0,"invaild function argument: ");
									return cont.bind(null,x0);
								});
							},
							_t[2], 
							function(z){
								var args=[];
								z.forEach(function(item,index){
									if(isArray(item) && item.length==3 && item[0]=='()' && item[2]){
										item[1].forEach(function(item0,index0){
											if(!isString(item0) && 
												!(isArray(item0) && nonEmpty(item0) && item0[0] in set (['#','~','lambda','[]','()'])) &&
												!(isNumber(item) || item==null)){
												err(item0,"invaild function argument: ");
											}
										});
										args=args.concat(item[1]);
									}
									else{
										args.push(item);
									}
								});
								return evaluate_ast_expr.bind(null, _t[3], _eval, _env, _gsym, function(v){
									return cont.bind(null,['lambda',y,args,v]);
								});
							});
						}
					});
				}
			}
			else{
				return cont.bind(null,null);
			}
		}
		else{
			return cont.bind(null,_t);
		}
	}
	var evaluate_match_expr=function(_t, _eval, _env, _gsym, cont){
		return _eval.bind(null,_t[1], _env, _gsym, function(value){
			if(isArray(_t[2]) && isEmpty(_t[2])){
				return cont.bind(null,val_func(null));
			}
			else{
				if(isArray(_t[2]) && nonEmpty(_t[2]) && _t[2][0]=='|'){
					var match_expr_impl=(function(_expr, _eval, _env, _gsym, cont){
						if(isEmpty(_expr)){
							return cont.bind(null,val_func(null));
						}
						else if(_expr.length==1){
							if(_expr[0][0]==null){
								return _eval.bind(null,_expr[0][1], _env, _gsym, function(x){
									return x().bind(null,null,function(y){
										return cont.bind(null,val_func(y));
									});
								});
							}
							else{
								return _eval.bind(null,_expr[0][0], _env, _gsym, function(x){
									return unify.bind(null, value, x, function(u){
										if(u[0]){
											var e=u[1];
											merge_dict(e, _env);
											return _eval.bind(null, _expr[0][1], e, _gsym, function(y){
												return y().bind(null,null,function(z){
													return cont.bind(null,val_func(z));
												});
											});
										}
										else{
											return cont.bind(null,val_func(null));
										}
									});
								});
							}
						}
						else{
							return _eval.bind(null, _expr[0][0], _env, _gsym, function(x){
								return unify.bind(null, value, x, function(u){
									if(u[0]){
										var e=u[1];
										merge_dict(e, _env);
										return _eval.bind(null,_expr[0][1], e, _gsym, function(y){
											return y().bind(null,null,function(z){
												return cont.bind(null,val_func(z));
											});
										});
									}
									else{
										return match_expr_impl.bind(null,_expr.slice(1),_eval,_env,_gsym,cont);
									}
								});
							});
						}
					});
					return match_expr_impl.bind(null,_t[2][1],_eval,_env,_gsym,cont);
				}
				else{
					return _eval.bind(null, _t[2], _env, _gsym, cont);
				}
			}
		});
	}
	var evaluate=function(_t, _env, _gsym, cont){
		if(isArray(_t)){
			if(nonEmpty(_t)){
				if(_t[0] in set(['!=','<=','>=','<','>','=','+','-','*','/','%','^','!','<-','_'])){
					return evaluate.bind(null,_t[1], _env, _gsym, function(x){
						return evaluate.bind(null,_t[2], _env, _gsym, function(y){
							return combinator(_t[0]).bind(null,x,y,cont);
						});
					});
				}
				else if(_t[0]=='()'){
					return map_cps.bind(null,function(x,cont){
							return evaluate.bind(null,x,_env,_gsym,cont);
						},
						_t[1], 
						function(x){
							return cont.bind(null,val_func(x));
						});
				}
				else if(_t[0]=='[]'){
					return evaluate_ast_expr.bind(null,_t[1], evaluate, _env, _gsym, function(x){
						return cont.bind(null,val_func(ast_func(x, _env, _gsym)));
					});
				}
				else if(_t[0]=='|'){
					return evaluate.bind(null,['->',true,_t], _env, _gsym, cont);
				}
				else if(_t[0]=='->'){
					return evaluate_match_expr.bind(null,_t, evaluate, _env, _gsym, cont);
				}
				else if(_t[0]=='~'){
					if(isString(_t[1]) && (_t[1] in _env || _t[1] in _gsym) && _t[2]!=-1){
						return cont.bind(null,environment(_env, _gsym)(_t[1]));
					}
					else{
						return cont.bind(null,val_func(free_identifier_func(_t[1])));
					}
				}
				else if(_t[0]=='#'){
					if(_t.length==5){
						return cont.bind(null,environment(_t[3], _t[4])(_t[1]));
					}
					else{
						return cont.bind(null,environment(_env, _gsym)(_t[1]));
					}
				}
				else if(_t[0]=='None'){
					return cont.bind(null,val_func(null));
				}
				else if(_t[0]=='lambda'){
					return cont.bind(null,val_func(func(
							_t[0],
							isArray(_t[1]) && _t[1][0]=='~' ? 
								_t[1][1] : 
								isString(_t[1]) ? _t[1] :
								do_raise("invaild function name: "+AstToString(_t[1]).replace(/\n$/,'')),
							[_t[2].map(function(arg){
								return (isArray(arg) && arg[0]=='~' ? 
									arg[1] : 
									isNumber(arg) || arg==null || isString(arg) && nonEmpty(arg) ? arg :
									isArray(arg) && nonEmpty(arg) && arg[0] in set (['#','~','lambda','[]','()']) ? arg :
									do_raise("invaild function argument: "+AstToString(arg).replace(/\n$/,'')));
							})],
							[_t[3]],
						_env, _gsym, evaluate)));
				}
				else if(_t[0]=='delay'){
					return cont.bind(null,delay_func(_t[1], _env, _gsym, evaluate));
				}
				else if(_t[0]=='callcc'){
					return evaluate.bind(null,_t[1], _env, _gsym, function(f){
						return f().bind(null,null,function(func){
							if(isFunction(func) && func(2)!='value'){
								return func().bind(null,[val_func(continuation_func(cont))],cont);
							}
							else{
								return result_of.bind(null, f, function(v){
									do_raise("calling a not callable object "+v);
								});
							}
						});
					});
				}
				else if(_t[0]=='eval'){
					return evaluate.bind(null, _t[1], _env, _gsym, function(x){
						return x().bind(null,null,function(v){
							if(v(2)!='Ast'){
								return cont.bind(null,x);
							}
							else{
								return evaluate.bind(null, v(-1), _env, _gsym, function(v0){
									return cont.bind(null,v0);
								});
							}
						});
					});
				}
				else if(_t[0]=='curry'){
					return evaluate.bind(null,_t[1], _env, _gsym, function(x){
						return x().bind(null,null,function(v){
							return cont.bind(null,val_func(curry_func(v)));
						});
					});
				}
				else if(_t[0] in set(['def','def_const','def!','def!_const'])){
					do_raise("invaild evaluate on macro <"+_t[1]+">");
				}
			}
			else{
				return cont.bind(null,val_func(null));
			}
		}
		else{
			if(!isNaN(_t)){
				return cont.bind(null,val_func(_t));
			}
			else if(isString(_t)){
				return cont.bind(null,environment(_env, _gsym)(_t));
			}
			else{
				return cont.bind(null,val_func(null));
			}
		}
	}
	var indent=function(code){
		return code.replace(/\n(?!$)/g,'\n\t').replace(/^(?!\n)/g,'\t');
	}
	var AstToString=function(Ast){
		var remove_parentheses=function(str){
			var pStack=[], pPair=[];
			var lflag=true,rflag=true;
			var remove_set={};
			var ret='';
			for(var i in str){
				if(str[i]=='('){
					if(nonEmpty(pStack)){
						pStack[pStack.length-1][1]=lflag;
					}
					pStack.push([i,false]);
					lflag=true; rflag=false;
				}
				if(str[i]==')'){
					var p=pStack.pop();
					if(p[1]&&rflag){
						pPair.push([p[0],i]);
					}
					rflag=true; lflag=false;
				}
				if(!(str[i] in set ([' ','\n','(',')']))){
					lflag=false; rflag=false;
				}
			}
			for(var i in pPair){
				remove_set[pPair[i][0]]=true;
				remove_set[pPair[i][1]]=true;
			}
			for(var i in str){
				if(!(i in remove_set)){
					ret+=str[i];
				}
			}
			return ret;
		}
		var AstToString_impl=function(_t){
			if(isArray(_t)){
				if(nonEmpty(_t)){
					if(_t[0] in set(['!=','<=','>=','<','>','=','+','-','*','/','!'])){
						return '('+AstToString_impl(_t[1])+_t[0]+AstToString_impl(_t[2])+')';
					}
					if(_t[0] in set(['^','_'])){
						return AstToString_impl(_t[1])+_t[0]+'{'+AstToString_impl(_t[2])+'}';
					}
					else if(_t[0]=='<-'){
						var f=AstToString_impl(_t[1]);
						var p=f.match(/(\-\>|[<>=]{2}|\!\=|_(?=\s|\{|\()|[\>\<\=\+\-\*\/\(\)\^\!\:\,\n\|\t\{\}\[\]\ ])/g);
						return (p?'(':'')+f+(p?')':'')+AstToString_impl(_t[2]).replace(/^{/g,'(').replace(/}$/g,')');
					}
					else if(_t[0]=='->'){
						var s1=AstToString_impl(_t[1]);
						var s2=AstToString_impl(_t[2]);
						if(s2.indexOf('\n')==-1 && s2.length<48)
							return '('+s1+_t[0]+s2+')';
						else
							return '('+s1+_t[0]+indent(s2)+')';
					}
					else if(_t[0]=='()'){
						var LB=_t[1].length>1?'(':'{';
						var RB=_t[1].length>1?')':'}';
						var ret=LB+(_t[1].map(function(x){
							return AstToString_impl(x);
						})).join(',')+RB;
						if(ret.indexOf('\n')==-1 || ret.length<48){
							return ret;
						}
						else{
							return LB+'\n'+indent((_t[1].map(function(x){
								return AstToString_impl(x);
							})).join(',\n'))+'\n'+RB;
						}
					}
					else if(_t[0]=='[]'){
						var LB='[';
						var RB=']';
						var code=AstToString_impl(_t[1]);
						var ret=LB+code+RB;
						if(ret.indexOf('\n')==-1 || ret.length<48){
							return ret;
						}
						else{
							return LB+'\n'+indent(code)+'\n'+RB;
						}
					}
					else if(_t[0] in set(['\\()\\','\\{}\\'])){
						var LB=_t[0].slice(0,2);
						var RB=_t[0].slice(2);
						var code=AstToString_impl(_t[1]);
						var ret=LB+code+RB;
						if(ret.indexOf('\n')==-1 || ret.length<48){
							return ret;
						}
						else{
							return LB+'\n'+indent(code)+'\n'+RB;
						}
					}
					else if(_t[0]=='#'){
						//return _t[1]+':'+_t[2];
						return _t[1];
					}
					else if(_t[0]=='~'){
						return '~'+AstToString_impl(_t[1]);
					}
					else if(_t[0]=='|'){
						var temp='\n';
						for (var i in _t[1]){
							var cond=AstToString_impl(_t[1][i][0]);
							var expr=AstToString_impl(_t[1][i][1]);
							if(nonEmpty(expr) && expr[0]=='(' && expr[expr.length-1]==')')
								expr=expr.slice(1,-1);
							if(expr.indexOf('\n')==-1){
								temp+='| '+cond+': ('+expr+')\n';
							}
							else{
								temp+='| '+cond+': ('+indent(expr)+')\n';
							}
						}
						return temp;
					}
					else if(_t[0]=='None'){
						return 'None';
					}
					else if(_t[0]=='lambda' || _t[0] in set(['def','def_const','def!','def!_const'])){
						var type=_t[0].replace(/_const$/,'');
						var temp='';
						var body=AstToString_impl(_t[3]);
						var indent_body=(body.indexOf('|')!=-1 || body.indexOf(type)!=-1) || body.length>24;
						temp+='('+type+':';
						if(_t[1]==''){
							temp+=_t[2].map(function(x){ return AstToString_impl(x); }).join(',').replace(/(\\\([\S\s]*?\)\\|\\\{[\S\s]*?\}\\)|~/g,'$1');
							temp+='->';
						}
						else{
							var func=AstToString_impl(_t[1]);
							var args=_t[2].map(function(x){ return AstToString_impl(x); }).join(',').replace(/(\\\([\S\s]*?\)\\|\\\{[\S\s]*?\}\\)|~/g,'$1');
							var title;
							if(args.length<=36){
								title=func+'('+args+')';
							}
							else{
								title=func+'(\n'+indent(_t[2].join(',\n'))+'\n)';
							}
							if(indent_body&&title.length>8){
								temp+='\n\t';
								body=indent(body);
							}
							temp+=title+'=';
						}
						if(indent_body){
							temp+='\n';
							temp+=indent(body)+'\n)';
						}
						else{
							temp+=body+')';
						}
						return temp;
					}
					else if(_t[0]=='delay'){
						return 'delay('+AstToString_impl(_t[1])+')';
					}
					else if(_t[0]=='callcc'){
						return 'callcc('+AstToString_impl(_t[1])+')';
					}
					else if(_t[0]=='eval'){
						return 'eval('+AstToString_impl(_t[1])+')';
					}
					else if(_t[0]=='curry'){
						return 'curry('+AstToString_impl(_t[1])+')';
					}
				}
				return '';
			}
			else{
				if(!isNaN(_t)){
					if(_t!=null){
						return _t.toString();
					}
					else{
						return '';
					}
				}
				else if(isString(_t)){
					return _t;
				}
				else{
					return '';
				}
			}
		}
		return remove_parentheses(AstToString_impl(Ast)).
			replace(/\n\t+\n/g,'\n').
			replace(/\n+/g,'\n')+'\n';
	}
	var result_of=function(x, cont){
		return x(1).bind(null, cont);
	}
	this.execute=function(__Str, cont){
		self.halt=false;
		trampoline_exec(macro_expansion.bind(null,parser(lexer(__Str)),function(Ast){
			var t=global_symtable(Ast);
			return cont.bind(null, function(f, args, cont){ 
				if(f in t){
					trampoline_exec(t[f]()(null, function(f){
						return f().bind(null, args, function(ret){return result_of.bind(null, ret, cont);});
					}));
				}
				else{
					cont('None');
				}
			});
		}));
	}

	this.terminate=function()
	{
		this.halt=true;
	}

	}

	var addGlobalStyle = (function(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	});

	function code_console(e, code)
	{
		this.element = e;
		this.continuation;
		this.inSuspend=false;
		this.inRuning=false;
		this.interp = new interpreter(this);
		this.disabled_input = true;

		var self = this;

		this.error=function(msg){
			self.inRuning=false;
			self.interp.terminate();
			var history=self.element.find(".output span");
			if(history.length>=100){
				history.first().next().remove();
				history.first().remove();
			}
			var command=$('<span class="error"></span>');
			command.text(msg);
			var output=self.element.find(".output");
			output.append(command);
			output.append('<br>');
			output.animate({scrollTop: output.prop("scrollHeight")});
		}

		this.output=function(str){
			var history=self.element.find(".output span");
			if(history.length>=100){
				history.first().next().remove();
				history.first().remove();
			}
			var command=$('<span class="result"></span>');
			command.html('&gt;&gt;&gt; '+highlight(str));
			var output=self.element.find(".output");
			output.append(command);
			output.append('<br>');
			output.animate({scrollTop: output.prop("scrollHeight")});
		}

		this.input=function(cont){
			self.element.find("textarea").removeClass('disabled');
			self.disabled_input = false;
			self.continuation=cont;
		}

		this.suspend=function(cont){
			self.element.find("textarea").removeClass('disabled');
			self.disabled_input = false;
			self.element.find("textarea").attr("placeholder","Resume to run? [Y/N]");
			self.inSuspend=true;
			self.continuation=cont;
		}

		this.clear=function(cont){
			self.element.find("pre.output").empty();
		}

		this.sleep=function(cont, time){
			setTimeout(function(){
				try { 
					cont();
				}
				catch(err) {
					if(err.name!='Error'){
						err.message='Error: '+err.message;
					}
					self.error(err.message);
				}
			}, time);
		}

		this.halt=function(cont){
			self.inRuning=false;
			self.interp.terminate();
		}

		this.element.find("textarea").keydown(function(e) {
			if(self.disabled_input){
				e.preventDefault();
				return;
			}
			var code = e.keyCode ? e.keyCode : e.which;
			if (code == 13) {  // Enter keycode
				e.preventDefault();
				if(self.inSuspend){
					var input=$(this).val().replace(/\n|\r\n/g,'').trim();
					$(this).val('');
					if(input.toUpperCase()=='Y'){
						$(this).attr("placeholder","");
						$(this).addClass('disabled');
						self.disabled_input=true;
						self.inSuspend=false;
						try {
							self.continuation();
						}
						catch(err) {
							if(err.name!='Error'){
								err.message='Error: '+err.message;
							}
							error(err.message);
						}
					}
					else if(input.toUpperCase()=='N'){
						$(this).attr("placeholder","");
						$(this).prop('disabled', true);
						self.inSuspend=false;
					}
				}
				else if ($(this).val().trim().length > 0) {
					var input=$(this).val().trim();
					var command=$('<span class="command"></span>');
					command.html(highlight(input));
					var output=self.element.find(".output");
					output.append(command);
					output.append('<br>');
					$(this).addClass('disabled');
					$(this).val('');
					self.disabled_input=true;
					output.animate({scrollTop: output.prop("scrollHeight")});
					try {
						self.continuation(input);
					}
					catch(err) {
						if(err.name!='Error'){
							err.message='Error: '+err.message;
						}
						self.error(err.message);
					}
				}
			}
		});

		var description = code.match(/(?:\/\/ [^\n]*\n)+(?:\/\/ ==description==\n)((?:\/\/ [^\n]*\n)*)(?:\/\/ ==description==\n)/);
		if(description)
		{
			var output=self.element.find(".output");
			description = description[1].replace(/^\/\/ /mg,"")
				.replace(/\n$/, "")
				.split("\n");
			description.forEach(function(d){
				var command=$('<span class="description"></span>');
				command.text(d);
				output.append(command);
				output.append('<br>');
			});
			output.append('<br>');
		}

		if(!self.inRuning) {
			if (code.length > 0) {
				//self.interp.execute(code,function(exce){
				//	exce('f',[],self.output);
				//});
				try {
					self.element.find(".run span").text("Runing");
					self.element.find("textarea").attr("placeholder","");
					self.element.find("textarea").addClass('disabled');
					self.element.find("textarea").val('');
					self.disabled_input=true;
					self.inSuspend=false;
					self.inRuning=true;
					self.interp.execute(code,function(exce){
						exce('f',[],function(x){
							self.inRuning=false;
							self.output(x);
						});
					});
				}
				catch(err) {
					if(err.name!='Error'){
						err.message='Error: '+err.message;
					}
					self.error(err.message);
				}
			}
		}

	}

	function uuidv4() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	    return v.toString(16);
	  });
	}

	var code_console_list = {};

	function create_console(e) {
		if(e.innerText.match(/^\/\/ Shirayuki script\n/)) {
			e.setAttribute("style", "display:none;");
			var con = document.createElement("DIV");
			con.className = "console";
			con.id = uuidv4();
			con.innerHTML = `<pre class="output"></pre><div class="input" style='height: 23px;'><textarea rows="1"></textarea></div><div class="shadow"></div>`;
			e.parentNode.insertBefore(con, e.nextSibling);
			e.parentNode.classList.add("console_container");
			code_console_list[con.id] = new code_console($(con), e.innerText);
		}
	}

	[...document.getElementsByTagName("code")].forEach(create_console);

	var mb = new MutationObserver(function (mutations) {
		try {
			mutations.forEach(mutation => {
				if (mutation.addedNodes) {
					mutation.addedNodes.forEach(node => {
						if(node.nodeType === Node.ELEMENT_NODE) {
							var code = node.getElementsByTagName("code");
							if(code && code.length) {
								[...code].forEach(e => {
									create_console(e);
								});
							}
						}
					});
				}

				if (mutation.removedNodes) {
					mutation.removedNodes.forEach(node => {
						if(node.nodeType === Node.ELEMENT_NODE) {
							var code_console = node.querySelectorAll("div.console");
							if(code_console && code_console.length) {
								[...code_console].forEach(e => {
									if(e.id && e.id in code_console_list) {
										code_console_list[e.id].halt();
										delete code_console_list[e.id];
									}
								});
							}
						}
					});
				}
			});
		} catch(e) {
			console.log(e);
		}
	});

	function escapeHtml(string) {
		var entityMap = {
			" ": "&nbsp;",
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': '&quot;',
			"'": '&#39;',
			"/": '&#x2F;'
		};
		return String(string).replace(/[&<>"'\/ ]/g, function (s) {
			return entityMap[s];
		});
	}

	function highlight(src){
		var length=src.length;

		var bIndex=0;
		var bStack=[];
		var sbIndex=0;
		var sbStack=[];
		var cbIndex=0;
		var cbStack=[];
		var escapeStack=[];
		var matchStack=[];

		var status=[
			function(x){
				if(x.length==0){
					return ['',''];
				}
				var t=x.match(/^\/\/[^\n]*/);
				if(t){
					return ['<span class="comment">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\b(?:def!|(?:lambda|def)\b)/);
				if(t){
					cur=1;
					return ['<span class="keyword">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\b(?:delay|callcc|eval|curry)\b/);
				if(t){
					return ['<span class="keyword">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\b(?:(?:-)?[0-9.]+|None|false|true)\b/);
				if(t){
					return ['<span class="number">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\b(?:[A-Za-z0-9]|_(?!\{|\(|\s))+/);
				if(t){
					return ['<span name="__'+t[0]+'" class="identifier">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^(?:[<>=]{2}|\!\=|[\<\>\=\+\-\*\/\%\^\!\_])/);
				if(t){
					return ['<span class="operator">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^(?:\\(?:\{|\())/);
				if(t){
					escapeStack.push(cur);
					cur=0;
					return ['<span class="operator">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^(?:(?:\}|\))\\)/);
				if(t){
					if(escapeStack.length>0){
						cur=escapeStack.pop();
					}
					return ['<span class="operator">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\|/);
				if(t){
					cur=3;
					return [t[0],x.slice(t[0].length)];
				}
				t=x.match(/^\(/);
				if(t){
					bStack.push(bIndex);
					return ['<span name="_B_'+(bIndex++)+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\)/);
				if(t){
					if(matchStack.length>0 && bStack.length==matchStack[matchStack.length-1][0]){
						cur=matchStack.pop()[1];
					}
					var index;
					if(bStack.length>0){
						index=bStack.pop();
					}
					else{
						index=-1;
					}
					return ['<span name="_B_'+index+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\[/);
				if(t){
					sbStack.push(sbIndex);
					escapeStack.push(cur);
					cur=0;
					return ['<span name="_SB_'+(sbIndex++)+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\]/);
				if(t){
					var index;
					if(sbStack.length>0){
						index=sbStack.pop();
					}
					else{
						index=-1;
					}
					if(escapeStack.length>0){
						cur=escapeStack.pop();
					}
					return ['<span name="_SB_'+index+'" id="_bracket_at_'+(length-x.length)+'" class="'+(cur==3?'condition ':'')+'bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\{/);
				if(t){
					cbStack.push(cbIndex);
					return ['<span name="_CB_'+(cbIndex++)+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\}/);
				if(t){
					var index;
					if(cbStack.length>0){
						index=cbStack.pop();
					}
					else{
						index=-1;
					}
					return ['<span name="_CB_'+index+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^,/);
				if(t){
					if(matchStack.length>0 && bStack.length==matchStack[matchStack.length-1][0]){
						cur=matchStack.pop()[1];
					}
					return [escapeHtml(x[0]),x.slice(1)];
				}
				return [escapeHtml(x[0]),x.slice(1)];
			},

			function(x){
				if(x.length==0){
					return ['',''];
				}
				var t=x.match(/^\/\/[^\n]*/);
				if(t){
					return ['<span class="comment">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^(?:\\(?:\{|\())/);
				if(t){
					escapeStack.push(2);
					cur=0;
					return ['<span class="operator">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^(?:(?:\}|\))\\)/);
				if(t){
					if(escapeStack.length>0){
						cur=escapeStack.pop();
					}
					return ['<span class="operator">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\b(?:([A-Za-z_][A-Za-z0-9_]*)(?=\s*(?:\(|=)))\b/);
				if(t){
					cur=2;
					return ['<span name="__'+t[0]+'" class="function">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\b(?:[A-Za-z_][A-Za-z0-9_]*)\b/);
				if(t){
					return ['<span name="__'+t[0]+'" class="parameter">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^(?:=|->)/);
				if(t){
					cur=0;
					return [escapeHtml(t[0]),x.slice(t[0].length)];
				}
				t=x.match(/^\(/);
				if(t){
					bStack.push(bIndex);
					return ['<span name="_B_'+(bIndex++)+'" id="_bracket_at_'+(length-x.length)+'"  class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\)/);
				if(t){
					var index;
					if(bStack.length>0){
						index=bStack.pop();
					}
					else{
						index=-1;
					}
					return ['<span name="_B_'+index+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\[/);
				if(t){
					sbStack.push(sbIndex);
					escapeStack.push(cur);
					cur=0;
					return ['<span name="_SB_'+(sbIndex++)+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\]/);
				if(t){
					var index;
					if(sbStack.length>0){
						index=sbStack.pop();
					}
					else{
						index=-1;
					}
					if(escapeStack.length>0){
						cur=escapeStack.pop();
					}
					return ['<span name="_SB_'+index+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\{/);
				if(t){
					cbStack.push(cbIndex);
					return ['<span name="_CB_'+(cbIndex++)+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\}/);
				if(t){
					var index;
					if(cbStack.length>0){
						index=cbStack.pop();
					}
					else{
						index=-1;
					}
					return ['<span name="_CB_'+index+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				return [escapeHtml(x[0]),x.slice(1)];
			},

			function(x){
				if(x.length==0){
					return ['',''];
				}
				var t=x.match(/^\/\/[^\n]*/);
				if(t){
					return ['<span class="comment">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^(?:\\(?:\{|\())/);
				if(t){
					escapeStack.push(cur);
					cur=0;
					return ['<span class="operator">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^(?:(?:\}|\))\\)/);
				if(t){
					if(escapeStack.length>0){
						cur=escapeStack.pop();
					}
					return ['<span class="operator">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\blambda\b/);
				if(t){
					matchStack.push([bStack.length,cur]);
					cur=0;
					return ['<span class="keyword">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\b(?:(?:-)?[0-9.]+|None|false|true)\b/);
				if(t){
					return ['<span class="number">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\b(?:[A-Za-z_][A-Za-z0-9_]*)\b/);
				if(t){
					return ['<span name="__'+t[0]+'" class="parameter">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^(?:=|->)/);
				if(t){
					cur=0;
					return [escapeHtml(t[0]),x.slice(t[0].length)];
				}
				t=x.match(/^\(/);
				if(t){
					bStack.push(bIndex);
					return ['<span name="_B_'+(bIndex++)+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\)/);
				if(t){
					cur=1;
					var index;
					if(bStack.length>0){
						index=bStack.pop();
					}
					else{
						index=-1;
					}
					return ['<span name="_B_'+index+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\[/);
				if(t){
					sbStack.push(sbIndex);
					escapeStack.push(cur);
					cur=0;
					return ['<span name="_SB_'+(sbIndex++)+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\]/);
				if(t){
					var index;
					if(sbStack.length>0){
						index=sbStack.pop();
					}
					else{
						index=-1;
					}
					if(escapeStack.length>0){
						cur=escapeStack.pop();
					}
					return ['<span name="_SB_'+index+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\{/);
				if(t){
					cbStack.push(cbIndex);
					return ['<span name="_CB_'+(cbIndex++)+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\}/);
				if(t){
					var index;
					if(cbStack.length>0){
						index=cbStack.pop();
					}
					else{
						index=-1;
					}
					return ['<span name="_CB_'+index+'" id="_bracket_at_'+(length-x.length)+'" class="bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				return [escapeHtml(x[0]),x.slice(1)];
			},

			function(x){
				if(x.length==0){
					return ['',''];
				}
				var t=x.match(/^\/\/[^\n]*/);
				if(t){
					return ['<span class="comment">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^(?:\\(?:\{|\())/);
				if(t){
					escapeStack.push(cur);
					cur=0;
					return ['<span class="operator">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^(?:(?:\}|\))\\)/);
				if(t){
					if(escapeStack.length>0){
						cur=escapeStack.pop();
					}
					return ['<span class="operator">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\b(?:def!|(?:lambda|def)\b)/);
				if(t){
					t0=x.slice(t[0].length).match(/^\s*:/);
					if(t0){
						return ['<span class="condition keyword">'+escapeHtml(t[0])+'</span>'+'<span class="condition">'+escapeHtml(t0[0])+'</span>',
						x.slice(t[0].length+t0[0].length)];
					}
					else{
						return ['<span class="condition keyword">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
					}
				}
				t=x.match(/^\b(?:(?:-)?[0-9.]+|None|false|true)\b/);
				if(t){
					return ['<span class="condition number">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\b[A-Za-z_](?:[A-Za-z0-9]|_(?!\{|\(|\s))*/);
				if(t){
					return ['<span name="__'+t[0]+'" class="condition identifier">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^[^:\\\[\]\(\)\{\}\s\w]+/);
				if(t){
					return ['<span class="condition">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^:/);
				if(t){
					cur=0;
					return [t[0],x.slice(t[0].length)];
				}
				t=x.match(/^\(/);
				if(t){
					bStack.push(bIndex);
					return ['<span name="_B_'+(bIndex++)+'" id="_bracket_at_'+(length-x.length)+'" class="condition bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\)/);
				if(t){
					var index;
					if(bStack.length>0){
						index=bStack.pop();
					}
					else{
						index=-1;
					}
					return ['<span name="_B_'+index+'" id="_bracket_at_'+(length-x.length)+'" class="condition bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\[/);
				if(t){
					sbStack.push(sbIndex);
					escapeStack.push(cur);
					cur=0;
					return ['<span name="_SB_'+(sbIndex++)+'" id="_bracket_at_'+(length-x.length)+'" class="condition bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\]/);
				if(t){
					var index;
					if(sbStack.length>0){
						index=sbStack.pop();
					}
					else{
						index=-1;
					}
					if(escapeStack.length>0){
						cur=escapeStack.pop();
					}
					return ['<span name="_SB_'+index+'" id="_bracket_at_'+(length-x.length)+'" class="condition bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\{/);
				if(t){
					cbStack.push(cbIndex);
					return ['<span name="_CB_'+(cbIndex++)+'" id="_bracket_at_'+(length-x.length)+'" class="condition bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				t=x.match(/^\}/);
				if(t){
					var index;
					if(cbStack.length>0){
						index=cbStack.pop();
					}
					else{
						index=-1;
					}
					return ['<span name="_CB_'+index+'" id="_bracket_at_'+(length-x.length)+'" class="condition bracket">'+escapeHtml(t[0])+'</span>',x.slice(t[0].length)];
				}
				return ['<span class="condition">'+escapeHtml(x[0])+'</span>',x.slice(1)];
			}
		];

		var t=src;
		var r='';
		var cur=0;
		while(t.length>0){
			var ret=status[cur](t);
			r+=ret[0];
			t=ret[1];
		}

		return r;
	}

	addGlobalStyle(`
	.console,
	.console pre.output,
	.console pre.output span,
	.console textarea,
	.console textarea:focus {
		font-size:14px;
		line-height:1.3;
		font-weight: normal;
		font-family:"Consolas", "Andale Mono", "Courier New", "Courier", monospace;
		border:0 none;
		outline:0 none;
		-webkit-box-shadow:none;
		   -moz-box-shadow:none;
		        box-shadow:none;
	}
	.console {
		position:relative;
		color: #ddd;
		background: #333;
		padding-top:10px;
		max-width:640px;
		margin:0px auto;
	}
	.console .shadow {
	    position: absolute;
	    left: 0px;
	    top: 10px;
	    right: 0px;
	    bottom: 32px;
		-webkit-box-shadow: inset 0px 0px 2px 2px #333;
		-moz-box-shadow: inset 0px 0px 2px 2px #333;
		box-shadow: inset 0px 0px 2px 2px #333;
		pointer-events: none;
	}
	.console pre.output {
		background: #333;
		display:block;
		white-space:pre;
		width:calc(100% - 15px);
		height:120px;
		overflow-y:auto;
		overflow-x:auto;
		position:relative;
		padding: 0 0 0 15px;
		margin:0 0 10px;
		border:0 none;
	}
	.console pre.output span              { color:#f7f7f7; }
	.console pre.output span.description  { color:#aaa; }
	.console pre.output span.command      { color:#f7f7f7; opacity: 0.7; }
	.console pre.output span.result       { color:#f7f7f7; opacity: 1;}
	.console pre.output span.error        { color:#f77; }

	.console .input {
		padding:0 0 0 15px;
		position:relative;
	}
	.console .input:before {
		content:">";
		position:absolute;
		top: 0;
		left: 0;
		color:#ddd
	}
	.console textarea {
		color:#ddd;
		background:#333;
		border:0 none;
		outline:0 none;
		padding:0;
		margin:0;
		resize: none;
		width:100%;
		overflow:hidden;
	}
	.console textarea:focus {
		outline:0 none;
	}
	.console textarea.disabled{
		color:transparent;
	}
	.console pre.output::-webkit-scrollbar,
	.console pre.output::-webkit-scrollbar-button,
	.console pre.output::-webkit-scrollbar-track,
	.console pre.output::-webkit-scrollbar-track-piece,
	.console pre.output::-webkit-scrollbar-thumb,
	.console pre.output::-webkit-scrollbar-corner,
	.console pre.output::-webkit-resizer {
		background: transparent;
	}
	.console pre.output::-webkit-scrollbar {
		width:  7px;
		height: 7px;
		-webkit-border-radius: 4px;
		        border-radius: 4px;
	}
	.console pre.output::-webkit-scrollbar-track-piece {
		-webkit-border-radius: 5px;
		        border-radius: 5px;
	}
	.console pre.output::-webkit-scrollbar-thumb {
		background: #4f4f4f;
		        border-radius: 5px;
	}
	.console pre.output::-webkit-scrollbar-button {
		width:0;
		height:0;
	}
	pre.console_container {
		background: #333;
	}
	.console pre.output span.keyword{
		font-style: italic;
		color: #66D9EF;
	}
	.console pre.output span.number{
		color:#AE81FF;
	}
	.console pre.output span.function{
		color: #A6E22E;
	}
	.console pre.output span.parameter{
		font-style: italic;
		color: #FD971F;
	}
	.console pre.output span.comment{
		color: #75715E;
	}
	.console pre.output span.operator{
		color: #F92672;
	}
	.console pre.output span.condition{
		color: #E6DB74;
	}
	`);
	mb.observe(document.body, { subtree: true, childList: true, attributes: false, characterData: false });

})();