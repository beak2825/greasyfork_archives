var getId = (userName) =>{
    fetch("https://fb-search.com/facebook-id", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en,es-ES;q=0.9,es;q=0.8",
        "content-type": "application/json;charset=UTF-8",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": "https://fb-search.com/find-my-facebook-id",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": "{\"query\":\"https://www.facebook.com/"+userName+"\"}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }).then(response => response.json()).then(data => otherUserId = data.id); console.log(otherUserId);
}
