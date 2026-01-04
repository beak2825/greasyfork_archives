/**
 * 获取油猴头设置:  @设置名=设置值
 * 
 * @exmaple
 * 
 * 
 * 
 * 
 * 

```js

// ==UserScript==
// @number       1
// @string       this is string
// @boolean      true
// @object.somekey.key1  1
// @object.somekey.key2  this is object      
// ==/UserScript==


const metas = GM_meta(GM_info.scriptMetaStr," ")

console.log(metas);
// {number:1, string:"this is string", boolean: true, object:{someKey:{key1:1,key2:"this is object"}}}  

```


 
 * @params metaString       油猴头，通常使用 GM_info.scriptMetaStr 获取
 * @params separator        分隔符，默认一个空格 : ' '
 */
function GM_meta(metaString,separator = " "){
    const object = {}
    const regexp = RegExp(`// *@(.*?)${separator}(.*)`)


    let data = metaString.match(RegExp(regexp,"g"))
    // 去除空格
    data
        .map(item=>item.trim())
    // 转换成 key value 形式
        .map(item=>{
        const match = item.match(regexp)
        return { key: match[1].trim(), value: match[2].trim() }
    })
    // 类型转换
        .map(item=>{
        item.value =
            Number(item.value) ? Number(item.value)
        :item.value === '开启' ? true
        :item.value === '关闭' ? false
        :String(item.value)
        return item
    })
    // 生成对象
        .forEach(item=>{
        // 使用 `.` 进行深度对象创建
        if(item.key.includes('.')){
            const keys = item.key.split(".")
            const endKey = keys.pop()
            let obj = undefined
            for(const key of keys){
                let target = obj || object
                if(target[key] === undefined){
                    target[key] = {}
                }
                obj = target[key]
            }
            obj[endKey] = item.value
        }else{
            object[item.key] = item.value
        }


    })

    return object
}