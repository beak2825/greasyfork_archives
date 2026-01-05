function noSpaces(value){
    return value.replace(/ /g,'');
}

function makeSettings(Name, data){
    if($('.dropdown.account .dropdown-menu li.nav-header:contains("Scripts")').length === 0){
        $('.dropdown.account .dropdown-menu').append('<li id="scriptsMenu" class="nav-header">Scripts</li>');
    }
    $('#scriptsMenu').after("<li><a id='div" + noSpaces(Name) + "Link' href='#' onclick='$(\"#div" + noSpaces(Name) + "Settings\").dialog(\"open\");return false;'>" + Name + "</a></li>");
    $('head').append('<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.0/themes/base/jquery-ui.css" type="text/css" />');
	if (typeof jQuery.ui == 'undefined') {
		jQuery.getScript("https://code.jquery.com/ui/1.12.0/jquery-ui.js", function(data2, status, jqxhr) {
		makeSettings2(Name, data);
	});
	} else {
		makeSettings2(Name, data);
	}
}

function makeSettings2(Name, data){
	var divSettings = "<div id='div" + noSpaces(Name) + "Settings'><table>";
	$.each(data,function(item,value){
		divSettings = divSettings + '<tr><td><span>' + value.Display + '</span></td>';
		switch(value.Type) {
			case "textbox":
				divSettings = divSettings + '<td><input type="textbox" id="txt' + value.Name + '"></input></td></tr>';
				break;
			case "checkbox":
				divSettings = divSettings + '<td><input type="checkbox" id="chk' + value.Name + '"></input></td></tr>';
				break;
			case "select":
				divSettings = divSettings + '<td><select id="ddl' + value.Name + '">';
				$.each(value.Options,function(item2,value2){
					divSettings = divSettings + '<option value="' + value2.Value + '">' + value2.Text + '</option>';
				});
				divSettings = divSettings + '</td></tr>';
				break;
			default:
				break;
		}
	});
    divSettings = divSettings + '</table>';
    $('section.progression').after(divSettings);
	$.each(data,function(item,value){
			switch(value.Type) {
                case "textbox":
                    $('#txt' + value.Name).val(getSetting(value.Name) === null ? value.Default === null ? "" : value.Default : getSetting(value.Name));
                    break;
                case "checkbox":
                    $('#chk' + value.Name).val();
                    if((getSetting(value.Name) === null ? value.Default === null ? "" : value.Default : getSetting(value.Name)) === "1"){
                        $('#chk' + value.Name).prop('checked','checked');
                    }
                    break;
                case "select":
                    $('#ddl' + value.Name).val(getSetting(value.Name) === null ? value.Default === null ? "" : value.Default : getSetting(value.Name));
                    break;
                default:
                    return;
            }
	});
    $('#div' + noSpaces(Name) + "Settings").dialog({
				autoOpen: false,
				height: 350,
				width: 'auto',
				modal: true,
				buttons: {
					"Save": function () {
                        $.each(data,function(item,value){
                            switch(value.Type) {
                                case "textbox":
                                    localStorage.setItem(value.Name,$('#txt' + value.Name).val());
                                    break;
                                case "checkbox":
                                    if($('#chk' + value.Name).prop('checked') == true){
                                        localStorage.setItem(value.Name,"1");
                                    } else {
                                        localStorage.setItem(value.Name,"0");
                                    }
                                    break;
                                case "select":
                                    localStorage.setItem(value.Name,$('#ddl' + value.Name).val());
                                    break;
                                default:
                                    return;
                            }
                        });
						$(this).dialog("close");
						doReload();
					},
					Cancel: function () {
						$(this).dialog("close");
					}
				}
			});
}

function getSetting(setting){
	return localStorage.getItem(setting);
}

function doReload(){
    $('<div class="yesNoDialog"></div>').appendTo('body')
    .html('<div><h6>WaniKani needs to reload for changes to take effect.\nReload now?</h6></div>')
    .dialog({
        modal: true,
        title: "Refresh?",
        zIndex: 10000,
        autoOpen: true,
        width: 'auto',
        resizable: false,
        buttons: {
            Yes: function () {
                location.reload();
            },
            No: function () {
                $(this).remove();
            }
        },
        close: function (event, ui) {
            $(this).remove();
        }
    });
}

//-------------------------------------------------------------------
// Add a <style> section to the document.
//-------------------------------------------------------------------
function addStyle(aCss) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (head) {
        style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = aCss;
        head.appendChild(style);
        return style;
    }
    return null;
}