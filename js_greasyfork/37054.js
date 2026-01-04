(function () {
	function my_del() {
		var iframe = document.getElementById('verify_dialog_frame');
		if (iframe) {
			setTimeout("my_verify_del()", 0);
			return;
		}
		
		var doc = document.getElementsByClassName('app_canvas_frame')[0].contentDocument;
		var del_btns = doc.getElementsByClassName('del_btn');
		if(del_btns.length) {
			del_btns[Math.floor(del_btns.length * Math.random())].click();
			console.log("delete clicked");
			setTimeout("my_confirm()", 600);
		} else {
			doc.getElementsByClassName("mod_pagenav_main")[0].lastChild.click();
			console.log("nex page clicked");
			setTimeout("my_del()", 2000);
		}
	}
	function my_confirm() {
		var cfm_btn = document.getElementsByClassName('qz_dialog_layer_btn qz_dialog_layer_sub');
		if (cfm_btn.length) {
			cfm_btn[0].click();
			console.log("confirm button clicked.");
			setTimeout("my_verify_del()", 500);
		} else {
			console.log("confirm button not found");
		}
	}
	function fireEnter(element) {
		var event; // The custom event that will be created

		if (document.createEvent) {
			event = document.createEvent("HTMLEvents");
			event.initEvent("keydown", true, true);
		} else {
			event = document.createEventObject();
			event.eventType = "keydown";
		}

		event.eventName = "keydown";
		event.keyCode = 13;

		if (document.createEvent) {
			element.dispatchEvent(event);
		} else {
			element.fireEvent("on" + event.eventType, event);
		}
	}
	function my_verify_del() {
		var iframe = document.getElementById('verify_dialog_frame');
		if (!iframe) {
			setTimeout("my_del()", 300);
			return;
		}
		var verify_func = function() {
			var iframe = document.getElementById('verify_dialog_frame');
			console.log("need confirm");
			var doc = iframe.contentDocument;
			var input = doc.getElementById('verifyInput');
			if(!input) {
				setTimeout(this, 100);
				return;
			}
			var focus_func = function() {
				console.log("focus_func");
				var iframe = document.getElementById('verify_dialog_frame');
				iframe.focus();
				var doc = iframe.contentDocument;
				var input = doc.getElementById('verifyInput');
				input.focus(); 
			}
			setTimeout(focus_func, 0);
			//input.onload = focus_func;
			input.onkeyup = function(event) {
				console.log("key pressed", event.keyCode);
				if (event.target.value.length == 4) {
					console.log("!!!! send confirm");
					fireEnter(event.target);
					setTimeout(my_del, 100);
				}
				return true;
			}
		};
		setTimeout(verify_func, 500);
	}
	my_del();
})();