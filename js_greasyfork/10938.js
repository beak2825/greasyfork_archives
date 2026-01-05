// Translation labels object
var _etChanged = false;

function etBeforeUnload(){
    if( _etChanged === false ) return true;    
    return confirm( "You have unsaved content. Are you sure you want to leave?" );
}

function etOnSubmit(){
    if( _etChanged === false ) return true;
    return confirm( "You have unsaved content. Are you sure you want to change the article state?" );
}


// Return tomorrow's date at 11:00 time
function etGetDate(){
    
    var currentDate = new Date();
    currentDate = new Date( new Date().getTime() + 24 * 60 * 60 * 1000 );
    
    var year = currentDate.getFullYear();
	var month = (currentDate.getMonth() + 1) < 10 ? '0' + ( currentDate.getMonth() + 1 ) : ( currentDate.getMonth() + 1 );
	var day = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();
    var hour = '11';
    var minutes = '00';
	
	return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes;

}

// Change the date text value if it's empty
function etChangeDate( objectId ){
	var obj = document.getElementById( objectId );
	if( obj.value.length >= 1 ) return;
	obj.value = etGetDate(); 
	obj.setAttribute( "value", etGetDate() );
}