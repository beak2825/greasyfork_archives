//change color
function changeColor(objId, objClass, bg, font){
    if(objClass == undefined || objClass == "" || objClass == ''){
        if(objId.charAt(0) == '#'){
            $(objId).css({'color':font, 'backgroundColor':bg});
        }else if(objId.charAt(0) != '#'){
            $('#' + objId).css({'color':font, 'backgroundColor':bg});
        }
    }else if(objId == undefined || objId == "" || objId == ''){
        if(objClass.charAt(0) == '.'){
            $(objClass).css({'color':font, 'backgroundColor':bg});
        }else if (objClass.charAt(0) != '.'){
            $('.' + objClass).css({'color':font, 'backgroundColor':bg});
        }
    }else if(objId != '' || objId != "" || objId != undefined && objClass != '' || objClass != "" || objClass != undefined){
        if(objId.charAt(0) == '#'){
            $(objId).css({'color':font, 'backgroundColor':bg});
        }else if (objId.charAt(0) != '#'){
            $('#' + objId).css({'color':font, 'backgroundColor':bg});
        }
        if(objClass.charAt(0) == '.'){
            $(objClass).css({'color':font, 'backgroundColor':bg});
        }else if(objClass.charAt(0) != '.'){
            $('.' + objClass).css({'color':font, 'backgroundColor':bg});
        }
    }
};

//change size
function changeSize(objId, objClass, wdh, hgh){
    if(objClass == undefined || objClass == "" || objClass == ''){
        if(wdh != undefined || wdh != "" || wdh != '' && hgh != undefined || hgh != "" || hgh != ''){
            if(objId.charAt(0) == '#'){
                $(objId).css({'widh':wdh, 'height':hgh});
            }else if(objId.charAt(0) != '#'){
                $('#' + objId).css({'widh':wdh, 'height':hgh});
            }
        }else if(wdh != undefined || wdh != "" || wdh != '' && hgh == undefined || hgh == "" || hgh == ''){
            if(objId.charAt(0) == '#'){
                $(objId).css({'widh':wdh});
            }else if(objId.charAt(0) != '#'){
                $('#' + objId).css({'widh':wdh});
            }
        }else if(wdh == undefined || wdh == "" || wdh == '' && hgh != undefined || hgh != "" || hgh != ''){
            if(objId.charAt(0) == '#'){
                $(objId).css({'height':hgh});
            }else if(objId.charAt(0) != '#'){
                $('#' + objId).css({'height':hgh});
            }
        }else if(wdh == undefined || wdh == "" || wdh == '' && hgh == undefined || hgh == "" || hgh == ''){
            
        }
    }else if(objId == undefined || objId == "" || objId == ''){
        if(wdh != undefined || wdh != "" || wdh != '' && hgh != undefined || hgh != "" || hgh != ''){
            if(objClass.charAt(0) == '#'){
                $(objClass).css({'widh':wdh, 'height':hgh});
            }else if(objClass.charAt(0) != '.'){
                $('.' + objClass).css({'widh':wdh, 'height':hgh});
            }
        }else if(wdh != undefined || wdh != "" || wdh != '' && hgh == undefined || hgh == "" || hgh == ''){
            if(objClass.charAt(0) == '.'){
                $(objId).css({'widh':wdh});
            }else if(objClass.charAt(0) != '.'){
                $('.' + objClass).css({'widh':wdh});
            }
        }else if(wdh == undefined || wdh == "" || wdh == '' && hgh != undefined || hgh != "" || hgh != ''){
            if(objClass.charAt(0) == '.'){
                $(objClass).css({'height':hgh});
            }else if(objClass.charAt(0) != '.'){
                $('.' + objClass).css({'height':hgh});
            }
        }else if(wdh == undefined || wdh == "" || wdh == '' && hgh == undefined || hgh == "" || hgh == ''){
            
        }
    }else if(objId != '' || objId != "" || objId != undefined && objClass != '' || objClass != "" || objClass != undefined){
        if(wdh != undefined || wdh != "" || wdh != '' && hgh != undefined || hgh != "" || hgh != ''){
            if(objClass.charAt(0) == '#'){
                $(objClass).css({'widh':wdh, 'height':hgh});
            }else if(objClass.charAt(0) != '.'){
                $('.' + objClass).css({'widh':wdh, 'height':hgh});
            }
        }else if(wdh != undefined || wdh != "" || wdh != '' && hgh == undefined || hgh == "" || hgh == ''){
            if(objClass.charAt(0) == '.'){
                $(objId).css({'widh':wdh});
            }else if(objClass.charAt(0) != '.'){
                $('.' + objClass).css({'widh':wdh});
            }
        }else if(wdh == undefined || wdh == "" || wdh == '' && hgh != undefined || hgh != "" || hgh != ''){
            if(objClass.charAt(0) == '.'){
                $(objClass).css({'height':hgh});
            }else if(objClass.charAt(0) != '.'){
                $('.' + objClass).css({'height':hgh});
            }
        }else if(wdh == undefined || wdh == "" || wdh == '' && hgh == undefined || hgh == "" || hgh == ''){
            
        }
        if(wdh != undefined || wdh != "" || wdh != '' && hgh != undefined || hgh != "" || hgh != ''){
            if(objId.charAt(0) == '#'){
                $(objId).css({'widh':wdh, 'height':hgh});
            }else if(objId.charAt(0) != '#'){
                $('#' + objId).css({'widh':wdh, 'height':hgh});
            }
        }else if(wdh != undefined || wdh != "" || wdh != '' && hgh == undefined || hgh == "" || hgh == ''){
            if(objId.charAt(0) == '#'){
                $(objId).css({'widh':wdh});
            }else if(objId.charAt(0) != '#'){
                $('#' + objId).css({'widh':wdh});
            }
        }else if(wdh == undefined || wdh == "" || wdh == '' && hgh != undefined || hgh != "" || hgh != ''){
            if(objId.charAt(0) == '#'){
                $(objId).css({'height':hgh});
            }else if(objId.charAt(0) != '#'){
                $('#' + objId).css({'height':hgh});
            }
        }else if(wdh == undefined || wdh == "" || wdh == '' && hgh == undefined || hgh == "" || hgh == ''){
            
        }
    }
};
//get keycodes
function getKeycodes(){
  window.addEventListener('keydown', function(key){
    alert(key.which)
  });
};


//keydown event
function keydown(keycode, run, elem){
  if(elem == undefined || elem == '' || elem == ""){
   window.addEventListener('keydown', function(key){
      if(key.which == keycode){
      run
      }
    })
  }else{
    elem.addEventListener('keydown', function(key){
      if(key.which == keycode){
      run
      }
    })
  }
};

//keypress event
function keypress(keycode, run, elem){
  if(elem == undefined || elem == '' || elem == ""){
   window.addEventListener('keypress', function(key){
      if(key.which == keycode){
      run
      }
    })
  }else{
    elem.addEventListener('keypress', function(key){
      if(key.which == keycode){
      run
      }
    })
  }
};

//keyup event
function keyup(keycode, run, elem){
  if(elem == undefined || elem == '' || elem == ""){
   window.addEventListener('keyup', function(key){
      if(key.which == keycode){
      run
      }
    })
  }else{
    elem.addEventListener('keyup', function(key){
      if(key.which == keycode){
      run
      }
    })
  }
};

//simulate keypress
function pressKey(elem, keycode){
  if(elem == undefined || elem == '' || elem == ""){
    $("body").trigger($.Event("keydown", { keyCode: keycode}));
    $("body").trigger($.Event("keyup", { keyCode: keycode}));
  }else{
    $(elem).trigger($.Event("keydown", { keyCode: keycode}));
    $(elem).trigger($.Event("keyup", { keyCode: keycode}));
  }
};
