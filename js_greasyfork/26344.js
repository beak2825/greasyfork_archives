// ==UserScript==
// @name			SecurePW v3
// @version			3.0
// @description		Allows you to use a secure password on EM
// @match			https://epicmafia.com/*
// @author       	Croned
// @namespace 		https://greasyfork.org/en/users/9694-croned
// @require         https://greasyfork.org/scripts/130-portable-md5-function/code/Portable%20MD5%20Function.js?version=10066
// @grant			GM_setValue
// @grant			GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/26344/SecurePW%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/26344/SecurePW%20v3.meta.js
// ==/UserScript==

var username = GM_getValue("emSecPw_username");
var pass = GM_getValue("emSecPw_pass");
var id = GM_getValue("emSecPw_id");

String.prototype.splice = function(idx, rem, str) {
	idx = parseInt(idx);
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

var random = function (min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
};

var encodePw = function(pass) {
	var oldPass = pass;
    pass = hex_md5(pass);
	//console.log(pass);
    for (var i = 0; i < String(oldPass)[2]; i++) {
        pass = pass.splice(String(oldPass)[3], 0, "\0");
    }
    return pass;
};

if (pass && username && id) {
	if (window.location.pathname == "/user/edit") {
		$("#changepass").find("input").each(function() {
			if ($(this).attr("type") != "submit") {
				$(this).remove();
			}
		});
		$("input[value*='password']").click(function() {
			var oldPw = encodePw(pass);
			pass = Math.random();

			$.post("/user/" + id + "/password", {prevpass: oldPw, pass: encodePw(pass), conf: encodePw(pass)}, function(res) {
				if (res[0] == 1) {
					GM_setValue("emSecPw_pass", pass);
					alert("New password set!");
				}
				else {
					alert("Incorrect password! Try again.");
				}
			});
		});
	}
	else if (window.location.pathname == "/home") {
        $("#login_form").off("submit");
        $("#login_form").submit(function (e) {
            e.preventDefault();
        });
		$("form").first().find("input").each(function() {
			if ($(this).attr("type") != "submit") {
				$(this).hide();
			}
		});
		$(".has_checkbox:has(#reme)").hide();
		$(".red").first().click(function() {
            $.post("/user/login", {'user[username]': username, 'user[password]': encodePw(pass), reme: false}, function (data) {
                if (data[0] == 0) {
                    alert("Incorrect username/password!");
                }
                else {
                    location.reload();
                }
            });
		});

		$("#forgot_password").off("click");
        $("#forgot_password").text("Reset password");
		$("#forgot_password").click(function () {
			$.get("/user/" + username + "/forgot_password", function (data) {
				if (data[0] == 1) {
					pass = null;
					GM_setValue("emSecPw_pass", pass);
					alert("A password recovery link has been sent to your email!");
					location.reload();
				}
			});
		});
	}
}
else if (window.location.pathname != "/home") {
    if (!id && pass) {
        id = $(".userteeny").attr("href").split("/")[2];
        GM_setValue("emSecPw_id", id);
    }
    else if (!pass) {
        username = $(".userteeny").text();
        GM_setValue("emSecPw_username", username);

        id = $(".userteeny").attr("href").split("/")[2];
        GM_setValue("emSecPw_id", id);

        var oldPw = prompt("Enter your old password.");
        pass = Math.random()/*prompt("Enter a password that is easy to remember. I'll make it more secure for you.")*/;

        $.post("/user/" + id + "/password", {prevpass: oldPw, pass: encodePw(pass), conf: encodePw(pass)}, function(res) {
            if (res[0] == 1) {
                GM_setValue("emSecPw_pass", pass);
                alert("New password set!");
            }
            else {
                alert("Incorrect password! Refresh to try again.");
            }
        });
    }
}

unsafeWindow.reset = function(){
    GM_setValue("emSecPw_username", "");
    GM_setValue("emSecPw_pass", "");
    GM_setValue("emSecPw_id", "");
};
