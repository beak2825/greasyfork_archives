function $x(p, context, doc, nsResolver) {
	if (!nsResolver) nsResolver=null;
	if (!doc) doc=document;
	if (!context) context=doc;
	var arr=[];
	var xpr=doc.evaluate(
		p, context, nsResolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null
	);
	for (var i=0; item=xpr.snapshotItem(i); i++) { arr.push(item); }
	return arr;
}