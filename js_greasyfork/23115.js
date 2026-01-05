var areTmClassesAdded = false;
var isTamperClickAdded = false;
var defaultTamperlabelBkgd = 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(0,0,0,0) 50%)';
var tm = {
    addGlobalStyle: function (css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    },
    log: function (msg) {
        console.log('Tampermonkey: ' + msg);
    },
    selectText: function (targetClass) {
        var textToCopy, range;
        try {
            if (document.selection) {
                range = document.body.createTextRange();
                range.moveToElementText(document.getElementsByClassName(targetClass)[0]);
                range.select();
            } else if (window.getSelection) {
                var selection = window.getSelection();
                range = document.createRange();
                range.selectNode(document.getElementsByClassName(targetClass)[0]);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        } catch (err) {
            tm.log('Failed to select text');
        }
    },
    sysFriendly: function (el) {
        var text = $(el).text();
        $(el).text(text.replace(/\/|\:|\<|\>|\\|\||\*|\?/g, '-'));
    },
    ping: function (ip, callback) { // via http://jsfiddle.net/GSSCD/203/
        if (!this.inUse) {
            this.status = 'unchecked';
            this.inUse = true;
            this.callback = callback;
            this.ip = ip;
            var _that = this;
            this.img = new Image();

            this.img.onload = function () {
                _that.inUse = false;
                _that.callback('responded');
            };

            this.img.onerror = function (e) {
                if (_that.inUse) {
                    _that.inUse = false;
                    _that.callback('error', e);
                }
            };

            this.start = new Date().getTime();
            this.img.src = "http://" + this.ip;
            this.timer = setTimeout(function () {
                if (_that.inUse) {
                    _that.inUse = false;
                    _that.callback('timeout');
                }
            }, 1500);
        }
    },
    isTagIn: function (targetString, tags) {
        var isFound = false;
        _.each(tags, function scanTarget (tag) {
            if (targetString.toLowerCase().indexOf(tag.toLowerCase()) > -1) {
                isFound = true;
            }
        });
        return isFound;
    },
    copyTextToClipboard: function (text) {
        var copyFrom = document.createElement("textarea");
        copyFrom.textContent = text;
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(copyFrom);
        copyFrom.select();
        document.execCommand('copy');
        body.removeChild(copyFrom);
    },
    showModal: function (modalId, modalBody) {
        if ($('#' + modalId).is(":visible")) {
            $('#' + modalId).remove();
        } else {
            $('body').append('<div role="dialog" aria-label="modal for ' + modalId + '" class="popupDetailWindow" id="' + modalId + '">' +
                             '    <div class="popupDetailTitle">&nbsp;</div>' +
                             '    <div class="popupDetailContent fingery tamperModalClose" style="text-align:right;" onclick="$(this).parent().remove()">[CLOSE]</div>' +
                             '    ' + modalBody +
                             '</div>');
        }
    },
    waitTimers: [],
    getContainer: function (opts) {
        var options = {
            id: opts.id ? opts.id : opts.el.replace(/[ (:)]/g, ''),
            el: opts.el,
            try: 0,
            max: opts.max ? opts.max : 20,
            spd: opts.spd ? opts.spd : 500
        };
        clearTimeout(tm.waitTimers[options.id]);
        return new Promise(function (resolve, reject) {
            tm.waitForContainerElement(resolve, options);
        });
    },
    getElementsByText: function (str, tag) {
        var tagIndex = 0,
            foundElements,
            tagRange = ['a', 'button', 'input', 'div', 'span'],
            checkTag = function (checkStr, checkTag) {
                utils.log('checkTag( ' + checkStr + ', ' + checkTag + ')');
                return Array.prototype.slice.call(document.getElementsByTagName(checkTag)).filter(el => el.textContent.trim() === checkStr.trim());
            };
        if (tag != null) {
            return checkTag(str, tag);
        } else {
            while ((foundElements == null || foundElements.length === 0) && tagIndex < tagRange.length) {
                foundElements = checkTag(str, tagRange[tagIndex]);
                tagIndex++;
            };
            return foundElements;
        }
    },
    waitForContainerElement: function (resolve, options) {
        var $configElement = $(options.el);
        if ($configElement.length === 0) {
            options.try++;
            if (options.try < options.max) {
                tm.waitTimers[options.id] = setTimeout(tm.waitForContainerElement.bind(this, resolve, options), options.spd);
            } else {
                $('#output').val($('#output').val() + 'Maximum searches reached\n');
            }
        } else {
            resolve($configElement);
        }
    },
    copyPreferences: function (prefs) {
        tm.copyTextToClipboard(JSON.stringify(prefs));
        $.growl.notice({'message': 'Favorites copied to Clipboard'});
    },
    pastePreferences: function (prefsName) {
        let newPrefs = prompt('Paste your preferences JSON');
        if (newPrefs) {
            let confirmation = confirm('Overwrite current settings?');
            if (confirmation) {
                tm.savePreferences(prefsName, JSON.parse(newPrefs));
                alert('Prefernces saved. You may need to refresh.');
            }
        }
    },
    savePreferences: function (name, value) {
        GM_setValue(name, JSON.stringify(value));
    },
    erasePreferences: function (name) {
        GM_setValue(name, JSON.stringify({}));
    },
	prettyPrint: function (jsonString) {
		try {
			var obj = JSON.parse(jsonString);
			var pretty = JSON.stringify(obj, undefined, 4);
			return(pretty);
		} catch (e) {
			return jsonString;
		}
	},
    setTamperIcon: function (global) {
        var scriptName = global.ids != null ? global.ids.scriptName : global.scriptName,
            prefsName = global.ids != null ? global.ids.prefsName : global.prefsName,
            memsName = global.ids != null ? global.ids.memsName : global.memsName,
            mems = global.mems,
            prefs = global.prefs,
            notes = global.notes;
        if (!scriptName || !prefsName || !prefs) {
            tm.log('setTamperIcon not properly configured; please send entire global object');
            return;
        }
        // Add Tampermonkey Icon with label to identify this script
        if($('.tamperlabel').length > 0) {
            if ($('.tamperlabel').prop('title').indexOf(scriptName) === -1) {
                $('.tamperlabel').prop('title', $('.tamperlabel').prop('title') + ' | ' + scriptName);
            }
        } else {
            $('body').append('<span class="tamperlabel" title="Tampermonkey scripts: ' + scriptName + '"></span>');
        }
        if (prefsName != null && prefs != null && !global.handlePrefsLocally) {
            var tamperAction = function () {
                var modalId = scriptName.replace(/\s/g, '') + 'Options',
                    modalBody = '',
                    notesInsert = '';
				modalBody += '<div class="popupDetailTitle">' + modalId + '</div><div class="popupDetailContent">&nbsp;</div>';
                _.each(prefs, function (value, key) {
                    if (Array.isArray(value) || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                        var thisVal = typeof value === 'object' ? JSON.stringify(value) : value;
                        modalBody +=
                            '<div class="popupDetailTitle">' + key + '</div>' +
                            '<div class="popupDetailContent">';
						if (typeof (value) === 'boolean') {
							modalBody += '    <button id="toogle' + key + '" class="dds__button dds__button--mini" value="' + value + '">' + value + '</button>';
						} else {
							modalBody += '    <textarea style="width:100%" id="' + key + '" type="text">' + tm.prettyPrint(thisVal) + '</textarea>';
						}
                        modalBody += '</div>';
                    } else {
                        _.each(value, function (value2, key2) {
                            var thisVal2 = typeof value2 === 'object' ? JSON.stringify(value2) : value2;
                            modalBody +=
                                '<div class="popupDetailTitle">' + key2 + '</div>' +
                                '<div class="popupDetailContent">' +
                                '    <textarea style="width:100%" id="' + key2 + '" type="text">' + thisVal2 + '</textarea>' +
                                '</div>';
                        });
                    }
                });
                if (notes != null) {
                    modalBody += '    <div class="popupDetailTitle">&nbsp;</div><div class="popupDetailContent" style="margin-top:20px;">&nbsp;</div>';
                    _.each(notes.messages, function (note) {
                        modalBody += '    <div class="popupDetailTitle tmNote">NOTE:</div><div class="popupDetailContent tmNote">' + note + '</div>';
                    });
                    notesInsert = '    <button aria-label="Erase Tampermonkey Session Notes" class="dds__button dds__button--mini notery tBtn">Erase Notes</button>';
                }
                modalBody += '<div class="popupDetailTitle">&nbsp;</div><div class="popupDetailContent" style="text-align:right;">' +
                    notesInsert +
                    '    <button aria-label="Reset Plugin Memory" class="dds__button dds__button--mini memery tBtn">Reset Memory</button>' +
                    '    <button aria-label="Copy Your Favorites to Clipboard" class="dds__button dds__button--mini copyify tBtn">Copy Preferences</button>' +
                    '    <button aria-label="Import Your Favorites" class="dds__button dds__button--mini pasteify tBtn">Import Preferences</button>' +
                    '    <button aria-label="Reset Plugin Preferences" class="dds__button dds__button--mini resetery tBtn tBtnMain">Reset Preferences</button>' +
                    '    <button aria-label="Save Plugin Preferences" class="dds__button dds__button--mini savery tBtn tBtnMain">Save</button>' +
                    '    <button aria-label="Close Preference Window" class="dds__button dds__button--mini uiClosify tBtn">Close</button>' +
                    '</div>';

                tm.showModal(modalId, modalBody);
				
				_.each(prefs, function (value, key) {
					if (typeof value === 'boolean') {
						$('#toogle' + key).on('click', function (e) {
							prefs[key] = !($('#toogle' + key).val() === 'true');
							$('#toogle' + key).val(prefs[key]).text(prefs[key]);
							tm.savePreferences(prefsName, prefs);
						});
					}
				});

                // hide the default popup Close because for some weird reason it's not working
                $('.popupDetailContent.fingery').hide();

                $('.savery').on('click', function () {
                    _.each(prefs, function (value, key) {
						if (typeof (value) === 'boolean') {
							prefs[key] = $('#toogle' + key).val();
						} else {
							prefs[key] = $('#' + key).val();
						}
                    });
                    tm.savePreferences(prefsName, prefs);
                    alert('Prefernces saved. You may need to refresh.');
                });
                $('.resetery').on('click', function () {
                    tm.erasePreferences(prefsName);
                    alert('Preferences erased. You may need to refresh.');
                });
                $('.memery').on('click', function () {
                    tm.erasePreferences(memsName);
                    alert('Page memory erased.');
                });
                $('.copyify').on('click', function (e) {
                    tm.copyPreferences(prefs);
                });
                $('.pasteify').on('click', function (e) {
                    tm.pastePreferences(prefsName);
                });
                $('.uiClosify').on('click', function () {
                    $('#' + modalId).remove();
                });
                $('.notery').on('click', function () {
                    $('.tmNote').remove();
                    global.notes = null;
                    tm.initNotes(global);
                });

                return false;
            };
            if (!isTamperClickAdded) {
                $('.tamperlabel').unbind('click').click(tamperAction);
                isTamperClickAdded = true;
            }
        }
    },
    initNotes: function (global) {
        if (global.notes == null) {
            global.notes = {
                messages: [],
                notifiedCount: 0
            };
        }
    },
    checkNotes: function (global) {
        tm.initNotes(global);
        if (global.notes.messages.length !== global.notes.notifiedCount) {
            global.notes.notifiedCount = global.notes.messages.length;
            var blinkNotify = function () {
                if ($('.tamperlabel').css('background-color') === 'rgb(255, 0, 0)') {
                    $('.tamperlabel').css('background-color', 'transparent');
                } else {
                    $('.tamperlabel').css('background-color', 'rgb(255, 0, 0)');
                }
            }
            setTimeout(function () {
                for (var intI = 0; intI < 4; intI ++) {
                    setTimeout(blinkNotify, 1000 * intI);
                };
            }, 3000);
        }
    },
    addNote: function (global, theNote) {
        var theType,
            typeAddedIndex = -1,
            compiledNote = function () {
                var returnNote = global.scriptName + ': ';
                returnNote += (theType != null && theType.length) > 0 ? theType + ': ' : '';
                returnNote += theNote;
                return returnNote;
            };
        tm.initNotes(global);
        if (typeof theNote === 'object') {
            theType = theNote.type;
            theNote = theNote.note;
            for (var intI = 0; intI < global.notes.messages.length; intI++) {
                if (global.notes.messages[intI].indexOf(theType) > -1) {
                    typeAddedIndex = intI;
                }
            }
            if (typeAddedIndex > -1 && global.notes.messages[typeAddedIndex] !== compiledNote()) {
                global.notes.messages.splice(typeAddedIndex, 1);
                global.notes.notifiedCount--;
            }
        }
        if (global.notes.messages.indexOf(compiledNote()) === -1) {
            global.notes.messages.push(compiledNote());
        }
    },
	addClasses: function () {
		if (!areTmClassesAdded) {
			areTmClassesAdded = true;

			// generic
			tm.addGlobalStyle('.fingery { margin:0px 13px; cursor:pointer; }');

			// styles for modal popup
			tm.addGlobalStyle('.fingery { cursor: pointer; }');
			tm.addGlobalStyle('.popupDetailWindow	{ position:fixed; z-index: 999999999; top:50px; left:50px; width:75%; height:75%; background:white; border:1px solid black; border-radius: 10px; box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75); padding:10px; font-size:1.2em; overflow-y:scroll; }');
			tm.addGlobalStyle('.popupDetailTitle	{ float:left; margin-right:10px; width:15%; margin-bottom:5px; font-weight:bold; clear:both; margin-top:2px; }'); // width:6%; min-width:100px;
			tm.addGlobalStyle('.popupDetailContent	{ float:left; width:80%; line-height:0.9em; font-size:0.9em; margin-top:5px; }');
			tm.addGlobalStyle('.popupDetailContent .work-item-color	{ display:none; }');

			// tamperlabel
			tm.addGlobalStyle('.tamperlabel { position:fixed; z-index:999999999; bottom:0px; right:20px; left:unset; cursor: pointer; width:16px; height:16px; background: ' + defaultTamperlabelBkgd + '}');

			// tamperButtons
			tm.addGlobalStyle('.tBtn { background-color:#6c757d !important; height:30px; font-weight:400; color:white; vertical-align:middle; height:40px; border:0; cursor:pointer; }');
			tm.addGlobalStyle('.tBtnMain { background-color:#007bff !important; }');

                    //*-jQuery-Growl-*-Copyright-2015-Kevin-Sylvestre-*-1.3.5-*/-
                    tm.addGlobalStyle('.ontop, #growls-default, #growls-tl, #growls-tr, #growls-bl, #growls-br, #growls-tc, #growls-bc, #growls-cc, #growls-cl, #growls-cr {z-index: 99999999; position: fixed; }');
                    tm.addGlobalStyle('#growls-default {top: 10px;right: 10px; }');
                    tm.addGlobalStyle('#growls-tl {top: 10px;left: 10px; }');
                    tm.addGlobalStyle('#growls-tr {top: 10px;right: 10px; }');
                    tm.addGlobalStyle('#growls-bl {bottom: 10px;left: 10px; }');
                    tm.addGlobalStyle('#growls-br {bottom: 10px;right: 10px; }');
                    tm.addGlobalStyle('#growls-tc {top: 10px;right: 10px;left: 10px; }');
                    tm.addGlobalStyle('#growls-bc {bottom: 10px;right: 10px;left: 10px; }');
                    tm.addGlobalStyle('#growls-cc {top: 50%;left: 50%;margin-left: -125px; }');
                    tm.addGlobalStyle('#growls-cl {top: 50%;left: 10px; }');
                    tm.addGlobalStyle('#growls-cr {top: 50%;right: 10px; }');
                    tm.addGlobalStyle('#growls-tc .growl, #growls-bc .growl {margin-left: auto;margin-right: auto; }');
                    tm.addGlobalStyle('.growl {opacity: 0.8;filter: alpha(opacity=80);position: relative;border-radius: 4px;-webkit-transition: all 0.4s ease-in-out;-moz-transition: all 0.4s ease-in-out;transition: all 0.4s ease-in-out; }');
                    tm.addGlobalStyle('.growl.growl-incoming {opacity: 0;filter: alpha(opacity=0); }');
                    tm.addGlobalStyle('.growl.growl-outgoing {opacity: 0;filter: alpha(opacity=0); }');
                    tm.addGlobalStyle('.growl.growl-small {width: 200px;padding: 5px;margin: 5px; }');
                    tm.addGlobalStyle('.growl.growl-medium {width: 250px;padding: 10px;margin: 10px; }');
                    tm.addGlobalStyle('.growl.growl-large {width: 300px;padding: 15px;margin: 15px; }');
                    tm.addGlobalStyle('.growl.growl-default {color: #FFF;background: #7f8c8d; }');
                    tm.addGlobalStyle('.growl.growl-error {color: #FFF;background: #C0392B; }');
                    tm.addGlobalStyle('.growl.growl-notice {color: #FFF;background: #2ECC71; }');
                    tm.addGlobalStyle('.growl.growl-warning {color: #FFF;background: #F39C12; }');
                    tm.addGlobalStyle('.growl .growl-close {cursor: pointer;float: right;font-size: 14px;line-height: 18px;font-weight: normal;font-family: helvetica, verdana, sans-serif; }');
                    tm.addGlobalStyle('.growl .growl-title {font-size: 18px;line-height: 24px; }');
                    tm.addGlobalStyle('.growl .growl-message {font-size: 12px;line-height: 16px; }');

		}
	}

};