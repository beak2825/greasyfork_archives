function spGetTranslations( value )
{
    switch( value ){
	case "notícias":
	    return spTranslations.pt;
	case "welcome":
	    return spTranslations.en;
	default:
	    return spTranslations.en;
    }	
}

var spTranslations = {
    pt: {
	call_everyone:		'Ligar para todos',
	9999:			'Não telefonar',
	121:			'Fofocar ao telefone',
	24:			'Ligar para papear',
	61:			'Mandar mensagem no celular',
	58:			'Mandar foto engraçada por MMS',
	26:			'Passar trote',
	25:			'Ligar para namorar',
	73:			'Ligar para flertar',
	74:			'Flertar por SMS'
    },
    en: {
	call_everyone:		'Call everyone',
	9999:			'Dont Call',
	121:			'Gossip on the phone',
	24:			'Wazzup call',
	61:			'SMS friendly text',
	58:			'SMS funny pic',
	26:			'Prank call',
	25:			'Lover call',
	73:			'Flirty Phone call',
	74:			'Flirty SMS'
    }
};
