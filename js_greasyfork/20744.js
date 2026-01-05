// This code is copyright 2005-2013 by Gavin Kistner, !@phrogz.net
// It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
// Reuse or modification is free provided you abide by the terms of that license.
// (Including the first two lines above in your source code satisfies the conditions.)
jQuery(function($){
	var theCriteria = 'table.sortable';
 	var theInitializer = function(_,inTable){
		var $table = $(inTable);
		var theRowsToSort,theRowCount;
		var theSortTBodiesFlag = $table.hasClass('sort-tbodies');
		if (theSortTBodiesFlag){
			theRowsToSort = $table.find('tbody > tr:first-child');
		}else{
			theRowsToSort = [];
			var theRowCandidates = $table.find( 'tbody.sort-body:eq(0) > tr' );
			if (!theRowCandidates.length) theRowCandidates = $table.find( 'tbody:eq(0) > tr' );
			var theParentRow;
			theRowCandidates.each(function(){
				if (theParentRow && $(this).is('.sort-withprevious')){
					if (!theParentRow.sortableChildRows) theParentRow.sortableChildRows = [];
					theParentRow.sortableChildRows.push(this);
				}else{
					theRowsToSort.push(this);
					theParentRow = this;
				}				
			});
			var theCommonTBody = theRowsToSort[0].parentNode;
		}
		theRowCount = theRowsToSort.length;

		var theSortableTypes = 'text number date'.split(' ');
		$table.find( 'thead th' ).each(function(inColumnIndex,inTH){
			inTH = $(inTH);

			var theSortType = $.grep( theSortableTypes, function(inType){ return inTH.is('.sort-'+inType) } )[0];
			if (!theSortType) return;

			var theSortDescendingByDefaultFlag = inTH.is('.sort-descending');
			inTH.addClass( 'sortable' );
			inTH.click(function(){
				var theSortDescendingFlag = inTH.is('.sorted') ? inTH.sortNextDownFlag : theSortDescendingByDefaultFlag;

				// Sort the rows using the data from the column, based on the class of the column.
				// Only the first sort on a column will look up the values; subsequent cache the data
				theRowsToSort.sort(function(inRowA,inRowB){
					var theRows   = [ inRowA, inRowB ];
					var theValues = [ null,   null   ];
					for ( var i=0; i<=1; ++i ){
						var theRow = theRows[i];
						if (!theRow.sortValueCache) theRow.sortValueCache = [];
						theValues[i] = theRow.sortValueCache[ inColumnIndex ];
						if (theValues[i] == null){
							var theTD = $(theRow).find( '> *:eq('+inColumnIndex+')' );
							theValues[i] = theTD.attr('sortvalue') || theTD.text();
							switch(theSortType){
								case 'number': theValues[i] = theValues[i] * 1;           break;
								case 'text'  : theValues[i] = theValues[i].toLowerCase(); break;
								case 'date'  : theValues[i] = new Date( theValues[i] );   break;
							}
							theRow.sortValueCache[ inColumnIndex ] = theValues[i];
						}
					}
					var theResult = theValues[0] < theValues[1] ? -1 : theValues[0] > theValues[1] ? 1 : 0;
					if ( theSortDescendingFlag ) theResult *= -1;
					return theResult;
				});

				if (theSortTBodiesFlag){
					for (var i=0;i<theRowCount;++i) inTable.appendChild(theRowsToSort[i].parentNode);
				}else{
					for (var i=0;i<theRowCount;++i){
						var tr = theRowsToSort[i];
						theCommonTBody.appendChild(tr);
						if (tr.sortableChildRows) for (var j=0,len=tr.sortableChildRows.length;j<len;++j) theCommonTBody.appendChild(tr.sortableChildRows[j]);
					}
				}

				// Clear out sort information from the previously-sorted column
				var theLastSortedHead = $table.sortedHead;
				if (theLastSortedHead){
					theLastSortedHead.removeClass('sorted sorted-ascending sorted-descending');
					delete theLastSortedHead.sortNextDownFlag;
				}

				// Mark this column as sorted.
				inTH.addClass('sorted '+(theSortDescendingFlag ? 'sorted-descending' : 'sorted-ascending'));
				$table.sortedHead = inTH;
				inTH.sortNextDownFlag = !theSortDescendingFlag;
			});
			if (inTH.is('.sort-default')) inTH.click();
		});
	};
	$(theCriteria).each( theInitializer );
	$(document).bind('DOMNodeInserted',function(inEvent){
		$(inEvent.target).find(theCriteria).andSelf().filter(theCriteria).each(theInitializer);
	});
});