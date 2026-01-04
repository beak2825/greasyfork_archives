function spGetTranslations( value )
{
    switch( value ){
	case "welcome":
	    return spTranslations.en;
	default:
	    return spTranslations.en;
    }	
}

var spTranslations = {
    en: {
	call_everyone:		'Call everyone',
	9999:		'Dont Call',
	24:			'Wazzup call',
 	61:			'SMS friendly text', 
 	58:			'SMS funny pic',
	26:			'Prank call',
    162:        'Birthday call',
    171:        'Thank You call'
    }
};
