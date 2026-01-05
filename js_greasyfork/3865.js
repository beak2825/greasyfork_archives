function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}

function register_event(name, funcGM, funcInject)
{
	unsafeWindow.addEventListener(name, exportFunction(funcGM, unsafeWindow), false);
	addJS_Node (null, null, funcInject);
}

if(!cloneInto) { function cloneInto(obj) { return obj; } }
if(!exportFunction) { function exportFunction(obj) { return obj; } }